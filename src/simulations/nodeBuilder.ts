import {evaluate,type Node,type Edge} from '../model';
import {arity} from '../model';
export type Blueprint={schemaVersion:1;id:string;name:string;outputUnit?:string;inputs:{id:string;unit?:string}[];graph:{nodes:Node[];edges:Edge[]};expected:{inputs:Record<string,number>;value:number;tolerance:number}[]};
const clone=<T>(x:T):T=>JSON.parse(JSON.stringify(x));
export function validateBlueprint(b:Blueprint){
 const errors:string[]=[];
 if(b.schemaVersion!==1||!b.id.trim()||!b.name.trim())errors.push('Invalid blueprint identity');
 const ids=b.graph.nodes.map(n=>n.id);
 if(new Set(ids).size!==ids.length)errors.push('Duplicate node identifiers');
 if(!ids.includes('out')||b.graph.nodes.find(n=>n.id==='out')?.kind!=='output')errors.push('Missing output node');
 for(const port of b.inputs)if(!b.graph.nodes.some(n=>n.id===port.id&&n.kind==='number'))errors.push('Missing input '+port.id);
 for(const edge of b.graph.edges){
  if(!ids.includes(edge.from)||!ids.includes(edge.to))errors.push('Dangling connection');
  const dest=b.graph.nodes.find(n=>n.id===edge.to);
  const inputCount=dest?.kind==='output'?1:dest?.kind==='number'||dest?.kind==='group-input'?0:arity[dest?.op??'']??0;
  if(dest&&(!Number.isInteger(edge.slot)||edge.slot<0||edge.slot>=inputCount))errors.push('Invalid port slot');
 }
 if(!b.expected.length)errors.push('At least one worked example is required');
 for(const fixture of b.expected){
  const nodes=b.graph.nodes.map(n=>Object.prototype.hasOwnProperty.call(fixture.inputs,n.id)?{...n,value:fixture.inputs[n.id]}:n);
  const result=evaluate(nodes,b.graph.edges);
  if(result.errors.length||result.result===undefined||!Number.isFinite(result.result)||Math.abs(result.result-fixture.value)>fixture.tolerance)errors.push('Failed worked example');
 }
 return {passed:errors.length===0,errors};
}
export function newBlueprint(id:string,name:string,inputs:{id:string;unit?:string}[],op:string):Blueprint{
 const nodes:Node[]=[...inputs.map((input,i)=>({id:input.id,kind:'number' as const,op:'constant',label:input.id,x:20,y:30+i*110,value:1,unit:input.unit})),{id:'calc',kind:'formula',op,label:name,x:290,y:120},{id:'out',kind:'output',op:'display',label:'Output',x:570,y:120}];
 return {schemaVersion:1,id,name,inputs,graph:{nodes,edges:[]},expected:[]};
}
export function instantiateBlueprint(b:Blueprint,prefix:string){
 const verdict=validateBlueprint(b);
 if(!verdict.passed)throw Error('Blueprint not validated: '+verdict.errors.join('; '));
 const graph=clone(b.graph);
 return {nodes:graph.nodes.map(n=>({...n,id:prefix+'-'+n.id})),edges:graph.edges.map(e=>({...e,from:prefix+'-'+e.from,to:prefix+'-'+e.to}))};
}
export function saveBlueprint(storage:Pick<Storage,'setItem'>,b:Blueprint){
 const result=validateBlueprint(b);
 if(!result.passed)throw Error(result.errors.join('; '));
 storage.setItem('before-adam-blueprint-v1-'+b.id,JSON.stringify(b));
}
export function loadBlueprint(storage:Pick<Storage,'getItem'>,id:string):Blueprint|null{
 try{const raw=storage.getItem('before-adam-blueprint-v1-'+id);if(!raw)return null;const b=JSON.parse(raw) as Blueprint;return validateBlueprint(b).passed?b:null}catch{return null}
}
