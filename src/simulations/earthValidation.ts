import {evaluate,type Node,type Edge} from '../model';
import {challengeCriteria} from './challengeCriteria';
export const rules:Record<string,{op:string;min:number;max:number;a:number;b:number}>={
'd2-1':{op:'gravity',min:8,max:12,a:1,b:1},
'd2-2':{op:'divide',min:10,max:50,a:11.2,b:.5},
'd2-3':{op:'flux',min:1100,max:1600,a:1,b:1},
'd2-4':{op:'divide',min:.95,max:1.05,a:239,b:239},
'd2-5':{op:'phase',min:1,max:1,a:20,b:1},
'd2-6':{op:'multiply',min:1,max:8,a:.7,b:5},
'd2-7':{op:'divide',min:.9,max:1.1,a:3.5,b:3.5},
'd2-8':{op:'divide',min:.98,max:1.02,a:100,b:100},
'd3-1':{op:'add',min:.95,max:1.05,a:.32,b:.68},
'd3-2':{op:'add',min:30,max:60,a:20,b:25},
'd3-3':{op:'divide',min:.9,max:1.1,a:45,b:45},
'd3-4':{op:'add',min:.98,max:1.02,a:.6,b:.4},
'd3-5':{op:'divide',min:1,max:15,a:50,b:10},
'd3-6':{op:'divide',min:.8,max:1.2,a:4,b:3.8},
'd3-7':{op:'divide',min:.98,max:1.02,a:1.332,b:1.332},
'd3-8':{op:'divide',min:.9,max:1.1,a:100,b:100},
'd3-9':{op:'divide',min:.9,max:1.1,a:2,b:2},
'd3-10':{op:'multiply',min:.4,max:1,a:.8,b:.8},
'd3-11':{op:'divide',min:1,max:1.3,a:1.1,b:1},
'd3-12':{op:'divide',min:1,max:1.2,a:110,b:100}
};
export const earthRule=(id:string)=>rules[id];
export function newEarthGraph(id:string,level:2|3=2):{nodes:Node[];edges:Edge[]}{
 const r=earthRule(id);if(!r)throw Error('Unknown challenge '+id);
 return {nodes:[{id:'a',kind:'number',op:'constant',label:'Input A',value:r.a,x:25,y:30},{id:'b',kind:'number',op:'constant',label:'Input B',value:r.b,x:25,y:180},{id:'calc',kind:'formula',op:r.op,label:id,x:320,y:100},{id:'out',kind:'output',op:'display',label:'Result',x:610,y:100},...(level===3?[{id:'sensitivity',kind:'number' as const,op:'constant',label:'Sensitivity',value:0.01,x:30,y:320},{id:'uncertainty',kind:'number' as const,op:'constant',label:'Uncertainty',value:0.001,x:30,y:450}]:[])],edges:[]};
}
export function validateEarthChallenge(id:string,g:{nodes:Node[];edges:Edge[]},level:2|3=2){
 const r=earthRule(id);
 if(!r)return {passed:false,value:undefined as number|undefined,reason:'Unknown rule'};
 const a=g.nodes.find(n=>n.id==='a'),b=g.nodes.find(n=>n.id==='b'),calc=g.nodes.find(n=>n.id==='calc'),out=g.nodes.find(n=>n.id==='out');
 if(!a||!b||!calc||!out||out.kind!=='output'||a.kind!=='number'||b.kind!=='number'||calc.kind!=='formula'||calc.op!==r.op)return {passed:false,value:undefined,reason:'Required inputs or formula missing'};
 const required=[['a','calc',0],['b','calc',1],['calc','out',0]] as const;
 if(!required.every(([from,to,slot])=>g.edges.filter(e=>e.to===to&&e.slot===slot).length===1&&g.edges.some(e=>e.from===from&&e.to===to&&e.slot===slot)))return {passed:false,value:undefined,reason:'Connect both inputs and output'};
 if(typeof a.value!=='number'||typeof b.value!=='number'||!Number.isFinite(a.value)||!Number.isFinite(b.value)||a.value<=0||b.value<=0)return {passed:false,value:undefined,reason:'Inputs must be positive finite numbers'};
 const result=evaluate(g.nodes,g.edges),value=result.result;
 if(value===undefined||result.errors.length)return {passed:false,value,reason:result.errors.join('; ')||'Invalid calculation'};
 const sensitivity=g.nodes.find(n=>n.id==='sensitivity');
 const uncertainty=g.nodes.find(n=>n.id==='uncertainty');
 if(level===3&&(!sensitivity||sensitivity.kind!=='number'||typeof sensitivity.value!=='number'||!Number.isFinite(sensitivity.value)||sensitivity.value<0||!uncertainty||uncertainty.kind!=='number'||typeof uncertainty.value!=='number'||!Number.isFinite(uncertainty.value)||uncertainty.value<=0))return {passed:false,value,reason:'A Level requires a positive relative measurement uncertainty and sensitivity tolerance'};
 let calculatedSensitivity=0,propagatedUncertainty=0;
 if(level===3){
  // Central finite differences on the actual connected graph, not a learner-entered result.
  const h=1e-4;
  const derivative=(id:string,original:number)=>{
   const sample=(factor:number)=>{
    const ns=g.nodes.map(n=>n.id===id?{...n,value:original*factor}:n);
    return evaluate(ns,g.edges).result;
   };
   const plus=sample(1+h),minus=sample(1-h);
   return plus===undefined||minus===undefined?NaN:(plus-minus)/(2*h*original);
  };
  const da=derivative('a',a.value!),db=derivative('b',b.value!);
  if(!Number.isFinite(da)||!Number.isFinite(db))return {passed:false,value,reason:'Sensitivity could not be calculated'};
  const relative=uncertainty!.value!;
  const sigmaA=Math.abs(a.value!)*relative,sigmaB=Math.abs(b.value!)*relative;
  propagatedUncertainty=Math.hypot(da*sigmaA,db*sigmaB);
  calculatedSensitivity=Math.hypot(da*a.value!,db*b.value!)/Math.max(Math.abs(value),1e-9);
  if(calculatedSensitivity>sensitivity!.value!*1000)return {passed:false,value,reason:'Calculated sensitivity exceeds configured tolerance'};
 }
 const robust=level===2||r.min===r.max||value-propagatedUncertainty>=r.min&&value+propagatedUncertainty<=r.max;
 const inRange=value>=r.min&&value<=r.max;
 const criteria=challengeCriteria(id,level,{graph:true,numerical:inRange,simulation:Number.isFinite(value),analysis:robust});
 const passed=inRange&&robust&&criteria.passed;
 return {passed,value,calculatedSensitivity,propagatedUncertainty,reason:passed?'Accepted classroom range · '+criteria.reason+(level===3?' · computed sensitivity '+calculatedSensitivity.toFixed(3)+'; propagated ±'+propagatedUncertainty.toPrecision(3):''):'Expected '+r.min+' to '+r.max+' including propagated uncertainty; received '+value.toPrecision(4)};
}

export function newEarthChallengeGraph(id:string,level:2|3=2){const g=newEarthGraph(id,level);const a=g.nodes.find(n=>n.id==='a')!;const b=g.nodes.find(n=>n.id==='b')!;a.value=Number(a.value)*0.001;if(earthRule(id)?.op==='add')b.value=Number(b.value)*0.001;if(earthRule(id)?.op==='phase')a.value=150;if(level===3)g.nodes=g.nodes.filter(n=>!['a','b','calc'].includes(n.id));return g;}
