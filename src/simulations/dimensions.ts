/** SI dimensional algebra for generic maths nodes. Stellar proxy formulas use declared calibrated units. */
import type {Node,Edge} from '../model';
export type Dimension={M:number;L:number;T:number;K:number};
export type DimResult={units:Record<string,string>;errors:string[]};
const Z:Dimension={M:0,L:0,T:0,K:0};
const registry:Record<string,Dimension>={'kg':{M:1,L:0,T:0,K:0},'m':{M:0,L:1,T:0,K:0},'s':{M:0,L:0,T:1,K:0},'K':{M:0,L:0,T:0,K:1},'m/s':{M:0,L:1,T:-1,K:0},'m/s²':{M:0,L:1,T:-2,K:0},'N':{M:1,L:1,T:-2,K:0},'J':{M:1,L:2,T:-2,K:0},'W':{M:1,L:2,T:-3,K:0},'Pa':{M:1,L:-1,T:-2,K:0},'m²':{M:0,L:2,T:0,K:0},'m³':{M:0,L:3,T:0,K:0},'kg/m³':{M:1,L:-3,T:0,K:0},'dimensionless':Z,'fraction':Z,'':Z};
const custom=new Set(['M☉','R☉','MK','L☉','relative pressure','nm','THz','km/s','W/m²','°C','K','organisms']);
const axes=(a:Dimension,b:Dimension,fn:(x:number,y:number)=>number):Dimension=>({M:fn(a.M,b.M),L:fn(a.L,b.L),T:fn(a.T,b.T),K:fn(a.K,b.K)});
const same=(a:Dimension,b:Dimension)=>a.M===b.M&&a.L===b.L&&a.T===b.T&&a.K===b.K;
const signature=(d:Dimension)=>Object.entries(d).filter(([,p])=>p!==0).map(([k,p])=>k+(p===1?'':'^'+p)).join('·')||'dimensionless';
function parse(unit:string):Dimension|null{if(unit in registry)return registry[unit];const match=unit.match(/^(M|L|T|K)(?:\^(-?\d+(?:\.\d+)?))?(?:·(M|L|T|K)(?:\^(-?\d+(?:\.\d+)?)))?$/);if(!match)return null;const d={...Z};d[match[1] as keyof Dimension]=Number(match[2]??1);if(match[3])d[match[3] as keyof Dimension]=Number(match[4]??1);return d}
export function checkDimensions(nodes:Node[],edges:Edge[]):DimResult{
 const units:Record<string,string>={},errors:string[]=[],active=new Set<string>();
 const byId=new Map(nodes.map(n=>[n.id,n]));
 function visit(id:string):Dimension|null{
  if(id in units)return parse(units[id]);
  const n=byId.get(id);if(!n){errors.push('Unknown node '+id);return null}
  if(active.has(id)){errors.push('Circular units at '+n.label);return null}active.add(id);
  if(n.kind==='number'||n.kind==='group-input'){const u=n.unit||'dimensionless';units[id]=u;active.delete(id);if(custom.has(u))return null;const d=parse(u);if(!d)errors.push('Unknown unit '+u+' on '+n.label);return d}
  const count=n.kind==='output'?1:n.op==='sqrt'?1:['add','multiply','divide'].includes(n.op)?2:0;
  if(!count){units[id]=n.unit||'calibrated';active.delete(id);return parse(units[id])}
  const inputs:(Dimension|null)[]=[];const labels:string[]=[];
  for(let slot=0;slot<count;slot++){const e=edges.find(e=>e.to===id&&e.slot===slot);if(!e){active.delete(id);return null}inputs.push(visit(e.from));labels.push(units[e.from]||'unknown')}
  let result:Dimension|null=null;
  if(n.kind==='output'){result=inputs[0];units[id]=labels[0];}
  else if(n.op==='add'){if(inputs[0]&&inputs[1]){if(!same(inputs[0],inputs[1]))errors.push('Unit mismatch in '+n.label+': '+labels[0]+' cannot be added to '+labels[1]);else result=inputs[0]}else if(labels[0]!==labels[1])errors.push('Incompatible calibrated units in '+n.label+': '+labels.join(' vs '));units[id]=result?signature(result):labels[0]===labels[1]?labels[0]:'invalid';}
  else if(n.op==='multiply'||n.op==='divide'){if(inputs[0]&&inputs[1])result=axes(inputs[0],inputs[1],(a,b)=>n.op==='multiply'?a+b:a-b);else errors.push('Convert calibrated units to SI before using '+n.op+' in '+n.label);units[id]=result?signature(result):'invalid';}
  else if(n.op==='sqrt'){if(inputs[0])result=axes(inputs[0],Z,a=>a/2);else errors.push('Convert calibrated units to SI before sqrt in '+n.label);units[id]=result?signature(result):'invalid';}
  active.delete(id);return result;
 }
 for(const n of nodes)visit(n.id);
 return {units,errors:[...new Set(errors)]};
}
