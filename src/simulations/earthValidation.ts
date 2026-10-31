import {evaluate,type Node,type Edge} from '../model';
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
'd3-12':{op:'divide',min:1,max:1.2,a:100,b:100}
};
export const earthRule=(id:string)=>rules[id];
export function newEarthGraph(id:string):{nodes:Node[];edges:Edge[]}{
 const r=earthRule(id);if(!r)throw Error('Unknown challenge '+id);
 return {nodes:[{id:'a',kind:'number',op:'constant',label:'Input A',value:r.a,x:25,y:30},{id:'b',kind:'number',op:'constant',label:'Input B',value:r.b,x:25,y:180},{id:'calc',kind:'formula',op:r.op,label:id,x:320,y:100},{id:'out',kind:'output',op:'display',label:'Result',x:610,y:100}],edges:[]};
}
export function validateEarthChallenge(id:string,g:{nodes:Node[];edges:Edge[]}){
 const r=earthRule(id);
 if(!r)return {passed:false,value:undefined as number|undefined,reason:'Unknown rule'};
 const a=g.nodes.find(n=>n.id==='a'),b=g.nodes.find(n=>n.id==='b'),calc=g.nodes.find(n=>n.id==='calc'),out=g.nodes.find(n=>n.id==='out');
 if(!a||!b||!calc||!out||out.kind!=='output'||a.kind!=='number'||b.kind!=='number'||calc.kind!=='formula'||calc.op!==r.op)return {passed:false,value:undefined,reason:'Required inputs or formula missing'};
 const required=[['a','calc',0],['b','calc',1],['calc','out',0]] as const;
 if(!required.every(([from,to,slot])=>g.edges.filter(e=>e.to===to&&e.slot===slot).length===1&&g.edges.some(e=>e.from===from&&e.to===to&&e.slot===slot)))return {passed:false,value:undefined,reason:'Connect both inputs and output'};
 if(typeof a.value!=='number'||typeof b.value!=='number'||!Number.isFinite(a.value)||!Number.isFinite(b.value)||a.value<=0||b.value<=0)return {passed:false,value:undefined,reason:'Inputs must be positive finite numbers'};
 const result=evaluate(g.nodes,g.edges),value=result.result;
 if(value===undefined||result.errors.length)return {passed:false,value,reason:result.errors.join('; ')||'Invalid calculation'};
 const passed=value>=r.min&&value<=r.max;
 return {passed,value,reason:passed?'Accepted classroom range': 'Expected '+r.min+' to '+r.max+'; received '+value.toPrecision(4)};
}
