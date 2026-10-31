import {evaluate,type Node,type Edge,type Stage} from '../model';
export type Preset='working'|'nearly'|'broken';
const spec=[
 null,
 {title:'Water cycle starter',concept:'Water phase depends on temperature and pressure. This is a simplified phase model.',formula:'phase(T, P)',target:'Liquid water (1)',near:['temp',-2] as const,broken:['pressure',.02] as const,pass:(v:number)=>v===1},
 {title:'Surface gravity starter',concept:'Gravity increases with mass and decreases with radius squared.',formula:'g = 9.81 M/R²',target:'8–12 m/s²',near:['radius',1.12] as const,broken:['mass',.1] as const,pass:(v:number)=>v>=8&&v<=12},
 {title:'Circular orbit starter',concept:'A circular two-body orbit balances gravity with centripetal acceleration.',formula:'v = 29.78 √(M/r)',target:'27–32 km/s',near:['distance',1.28] as const,broken:['distance',8] as const,pass:(v:number)=>v>=27&&v<=32},
 {title:'Stellar flux starter',concept:'Stellar flux falls with orbital distance squared.',formula:'F = 1361 L/r²',target:'1200–1500 W/m²',near:['distance',1.11] as const,broken:['distance',3] as const,pass:(v:number)=>v>=1200&&v<=1500},
 {title:'Population starter',concept:'Logistic growth approaches a carrying capacity; this is not a full ecosystem model.',formula:'N(t+1) = N(t) + rN(t)(1−N(t)/K)',target:'Population positive and below capacity',near:['rate',1.15] as const,broken:['capacity',-100] as const,pass:(v:number,values:number[])=>v>0&&v<=values[0]&&values[0]>0&&values[1]>0&&values[1]<=1}
];
export function labSpec(day:number){return spec[day]??null}
export function labPreset(day:number,stage:Stage,preset:Preset):{nodes:Node[];edges:Edge[]}{
 const nodes:Node[]=JSON.parse(JSON.stringify(stage.nodes)),edges:Edge[]=[];
 const calc=nodes.find(n=>n.kind==='formula')!,out=nodes.find(n=>n.kind==='output')!;
 nodes.filter(n=>n.kind==='number').forEach((n,slot)=>edges.push({from:n.id,to:calc.id,slot}));
 edges.push({from:calc.id,to:out.id,slot:0});
 if(preset!=='working'){const entry=spec[day]!;const [id,value]=preset==='nearly'?entry.near:entry.broken;const n=nodes.find(n=>n.id===id);if(n)n.value=value}
 return {nodes,edges};
}
export function labCheck(day:number,nodes:Node[],edges:Edge[]){
 const s=spec[day];if(!s)return {passed:false,value:undefined as number|undefined,reason:'No lab'};
 const inputs=nodes.filter(n=>n.kind==='number'),calc=nodes.find(n=>n.kind==='formula'),out=nodes.find(n=>n.kind==='output');
 const connected=!!calc&&!!out&&inputs.every((n,i)=>edges.some(e=>e.from===n.id&&e.to===calc.id&&e.slot===i))&&edges.some(e=>e.from===calc.id&&e.to===out.id&&e.slot===0);
 if(!connected)return {passed:false,value:undefined as number|undefined,reason:'Connect all inputs to the formula and the formula to output'};
 const v=evaluate(nodes,edges);const value=v.result;
 const passed=value!==undefined&&Number.isFinite(value)&&!v.errors.length&&s.pass(value,inputs.map(n=>n.value??NaN));
 return {passed,value,reason:passed?'Starter calculation meets its target':'Change the parameters to approach the target'};
}
