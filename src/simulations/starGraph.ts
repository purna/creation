import {evaluate,type Node,type Edge} from '../model';
import {validateStar,type StarInput,STAR_SOLVER} from './star';
export const GRAPH_SOLVER=STAR_SOLVER+'-graph-v2';
export const STAR_FIELDS=['mass','radius','hydrogen','coreMK','luminosity'] as const;
type Field=typeof STAR_FIELDS[number];
const inputLabels:Record<Field,string>={mass:'Stellar mass (M☉)',radius:'Stellar radius (R☉)',hydrogen:'Hydrogen fraction (0–1)',coreMK:'Core temperature (million K)',luminosity:'Radiated luminosity (L☉)'};
const formulas=[
 {id:'gravity',op:'star-gravity',label:'Gravity: 274M/R²',inputs:['mass','radius']},
 {id:'pressure',op:'star-pressure',label:'Compression: M²/R⁴',inputs:['mass','radius']},
 {id:'core',op:'star-core',label:'Core pressure: MT/(15.7R³)',inputs:['mass','coreMK','radius']},
 {id:'fusion',op:'star-fusion',label:'Fusion: M²/R³ × (X/0.7)² × (T/15.7)⁴',inputs:['mass','radius','hydrogen','coreMK']},
 {id:'hydro',op:'star-hydro',label:'Hydrostatic residual',inputs:['pressure','core']},
 {id:'thermal',op:'star-thermal',label:'Thermal residual',inputs:['fusion','luminosity']},
 {id:'stable',op:'star-stable',label:'Stability integration',inputs:['hydro','thermal']}
] as const;
export function newStarGraph():{nodes:Node[];edges:Edge[]}{
 const values:Record<Field,number>={mass:1,radius:1,hydrogen:.70,coreMK:15.7,luminosity:1};
 const nodes:Node[]=[...STAR_FIELDS.map((id,i)=>({id,kind:'number' as const,op:'constant',label:inputLabels[id],x:20,y:20+i*112,value:values[id],unit:id==='mass'?'M☉':id==='radius'?'R☉':id==='coreMK'?'MK':id==='luminosity'?'L☉':'fraction'})),...formulas.map((f,i)=>({id:f.id,kind:'formula' as const,op:f.op,label:f.label,x:315+(i>=4?280:0),y:20+(i%4)*130,unit:({gravity:'m/s²',pressure:'relative pressure',core:'relative pressure',fusion:'L☉',hydro:'dimensionless',thermal:'dimensionless',stable:'dimensionless'} as Record<string,string>)[f.id]})),{id:'out',kind:'output' as const,op:'display',label:'Stable star result',x:875,y:170}];
 return {nodes,edges:[]};
}
export function graphStarInput(nodes:Node[]):StarInput|null{
 const obj={} as StarInput;
 for(const field of STAR_FIELDS){const n=nodes.find(n=>n.id===field&&n.kind==='number'&&n.op==='constant');if(!n||typeof n.value!=='number'||!Number.isFinite(n.value))return null;obj[field]=n.value;}
 return obj;
}
export function checkStarGraph(nodes:Node[],edges:Edge[]){
 const input=graphStarInput(nodes);const evaluated=evaluate(nodes,edges);const physics=input?validateStar(input):null;
 const connected=new Set<string>();
 const actual=Object.fromEntries(formulas.map(f=>[f.id,false])) as Record<string,boolean>;
 for(const f of formulas){const n=nodes.find(n=>n.id===f.id&&n.kind==='formula'&&n.op===f.op);if(!n)continue;
  const ok=f.inputs.every((source,slot)=>edges.some(e=>e.to===f.id&&e.slot===slot&&e.from===source)&&nodes.find(n=>n.id===source)?.unit===({mass:'M☉',radius:'R☉',hydrogen:'fraction',coreMK:'MK',luminosity:'L☉',gravity:'m/s²',pressure:'relative pressure',core:'relative pressure',fusion:'L☉',hydro:'dimensionless',thermal:'dimensionless'} as Record<string,string>)[source]);
  const probe=evaluate(nodes,edges.filter(e=>e.to!=='out').concat({from:f.id,to:'out',slot:0}));
  if(ok&&f.inputs.every(s=>STAR_FIELDS.includes(s as Field)||connected.has(s))&&Number.isFinite(probe.result)){connected.add(f.id);actual[f.id]=true;}
 }
 const checks=physics?.checks.map((c,i)=>{
  const needed=[['gravity','pressure'],['gravity'],['pressure','core'],['fusion'],['hydro'],['thermal'],['stable']][i];
  return {...c,passed:c.passed&&needed.every(k=>actual[k]),detail:c.detail+(needed.every(k=>actual[k])?'':' · connect required formula inputs')};
 })??[];
 const outConnected=edges.some(e=>e.from==='stable'&&e.to==='out'&&e.slot===0);
 const complete=checks.length===7&&checks.every(c=>c.passed)&&outConnected&&evaluated.result!==undefined;
 return {input,checks,complete,values:evaluated.values,errors:evaluated.errors,connected:actual,solverVersion:GRAPH_SOLVER};
}
export const STAR_FORMULAS=formulas;
