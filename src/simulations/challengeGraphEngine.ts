import {creationChallenges,stages,evaluate,type Node,type Edge} from '../model';
import {checkStarGraph} from './starGraph';
import {earthRule,validateEarthChallenge} from './earthValidation';

export type ChallengeGraph={nodes:Node[];edges:Edge[]};
export type ChallengeState='planned'|'incomplete'|'invalid'|'passed';
export type ChallengeResult={id:string;title:string;state:ChallengeState;value?:number;reason:string;dependsOn:string[]};
export type DayGraphResult={day:number;challenges:ChallengeResult[];complete:boolean;masterValue?:number};

/** A shared registry and validator. Never awards credit to roadmap-only challenges. */
export function challengeDefinitions(day:number){
 return creationChallenges[day]?.items.map(item=>({id:item.id,title:item.name,dependsOn:[...item.dependsOn]}))??[];
}
export function evaluateDayGraphs(day:number,graph:ChallengeGraph):DayGraphResult{
 const definitions=challengeDefinitions(day);
 const result=evaluate(graph.nodes,graph.edges);
 if(day===0){
  const checked=checkStarGraph(graph.nodes,graph.edges);
  const challenges=definitions.map((item,i):ChallengeResult=>{
   const check=checked.checks[i];
   return { ...item,state:check?.passed?'passed':checked.connected[(['gravity','pressure','core','fusion','hydro','thermal','stable'] as const)[i]]?'invalid':'incomplete',
    reason:check?.detail??'Required scientific calculation not available',value:result.values[(['gravity','pressure','core','fusion','hydro','thermal','stable'] as const)[i]]};
  });
  return {day,challenges,complete:checked.complete,masterValue:checked.complete?result.result:undefined};
 }
 if(day===1||day===2){
  const challenges=definitions.map((item):ChallengeResult=>{
   const rule=earthRule(item.id);
   const checked=rule?validateEarthChallenge(item.id,graph):null;
   return {...item,state:checked?.passed?'passed':checked?.value===undefined?'incomplete':'invalid',value:checked?.value,reason:checked?.reason??'No scientific validator'};
  });
  return {day,challenges,complete:challenges.length>0&&challenges.every(c=>c.state==='passed'),masterValue:undefined};
 }
 const challenges=definitions.map(item=>({...item,state:'planned' as const,reason:'Not yet implemented'}));
 return {day,challenges,complete:false,masterValue:undefined};
}
export function starterGraph(day:number):ChallengeGraph{
 const stage=stages[day];
 if(!stage)throw Error('Unknown creation day '+day);
 return {nodes:JSON.parse(JSON.stringify(stage.nodes)),edges:JSON.parse(JSON.stringify(stage.edges))};
}
export function saveChallengeGraph(storage:Pick<Storage,'setItem'>,day:number,id:string,graph:ChallengeGraph){
 if(!challengeDefinitions(day).some(item=>item.id===id))throw Error('Unknown challenge '+id);
 storage.setItem('before-adam-challenge-v1-'+day+'-'+id,JSON.stringify(graph));
}
export function loadChallengeGraph(storage:Pick<Storage,'getItem'>,day:number,id:string):ChallengeGraph|null{
 if(!challengeDefinitions(day).some(item=>item.id===id))return null;
 try{
  const raw=storage.getItem('before-adam-challenge-v1-'+day+'-'+id);
  if(!raw)return null;
  const graph=JSON.parse(raw) as ChallengeGraph;
  return Array.isArray(graph.nodes)&&Array.isArray(graph.edges)?graph:null;
 }catch{return null}
}

/** Extract a challenge-sized editable graph from the canonical day graph.
 * Dependency nodes remain visible, but only the selected formula is editable.
 * Day 1 retains canonical node ids so completed wires can merge back safely.
 */
export function extractChallengeGraph(day:number,index:number,master:ChallengeGraph):ChallengeGraph{
 const defs=challengeDefinitions(day);
 if(index<0||index>=defs.length)throw Error('Unknown challenge index');
 if(day!==0)return {nodes:JSON.parse(JSON.stringify(master.nodes)),edges:JSON.parse(JSON.stringify(master.edges))};
 const ids=['gravity','pressure','core','fusion','hydro','thermal','stable'] as const;
 const target=ids[index];
 const inputs:Record<string,string[]>={gravity:['mass','radius'],pressure:['mass','radius'],core:['mass','coreMK','radius'],fusion:['mass','radius','hydrogen','coreMK'],hydro:['pressure','core'],thermal:['fusion','luminosity'],stable:['hydro','thermal']};
 const visible=new Set<string>();
 const visit=(id:string)=>{if(visible.has(id))return;visible.add(id);for(const upstream of inputs[id]||[])visit(upstream)};
 visit(target);
 const nodes=master.nodes.filter(n=>visible.has(n.id)).map(n=>JSON.parse(JSON.stringify(n)) as Node);
 const edges=master.edges.filter(e=>visible.has(e.to)&&visible.has(e.from)).map(e=>({...e}));
 // A challenge has a real, inspectable output even before it is merged into the day.
 nodes.push({id:'challenge-result',kind:'output',op:'display',label:'Challenge result',x:680,y:160});
 edges.push({from:target,to:'challenge-result',slot:0});
 return {nodes,edges};
}
/** Merge only this challenge's input wires and shared numeric parameters into
 * the canonical graph. Other challenges' edges are never overwritten.
 */
export function mergeChallengeGraph(day:number,index:number,master:ChallengeGraph,part:ChallengeGraph):ChallengeGraph{
 if(day!==0)return master;
 const target=['gravity','pressure','core','fusion','hydro','thermal','stable'][index];
 if(!target)return master;
 const nodes=master.nodes.map(n=>{
  const changed=part.nodes.find(p=>p.id===n.id);
  return changed&&n.kind==='number'&&changed.kind==='number'?{...n,value:changed.value}:n;
 });
 const allowed=new Set(master.nodes.map(n=>n.id));
 const expected:Record<string,string[]>={gravity:['mass','radius'],pressure:['mass','radius'],core:['mass','coreMK','radius'],fusion:['mass','radius','hydrogen','coreMK'],hydro:['pressure','core'],thermal:['fusion','luminosity'],stable:['hydro','thermal']};
 const edges=master.edges.filter(e=>e.to!==target);
 const slots=new Set<number>();
 for(const e of part.edges){
  if(e.to!==target||!allowed.has(e.from)||!Number.isInteger(e.slot)||e.slot<0||e.slot>=expected[target].length||slots.has(e.slot))continue;
  // Preserve wrong but structurally valid connections so learners can diagnose them.
  slots.add(e.slot);edges.push({...e});
 }
 return {nodes,edges};
}
