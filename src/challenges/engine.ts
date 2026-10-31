import {evaluate,type Node,type Edge} from '../model';
import {checkStarGraph,GRAPH_SOLVER} from '../simulations/starGraph';
import {labCheck} from '../simulations/dayLabs';
import {scoreAttempt} from './catalog';
import {validateStar} from '../simulations/star';
import {deriveWorld,worldScore,type WorldMetrics} from './coupling';
export type Graph={nodes:Node[];edges:Edge[]};
export type Evidence={id:string;day:number;level:2|3;status:'validated'|'failed'|'unimplemented'|'stale';score:number|null;reason:string;fingerprint:string;solver:string;updatedAt:number};
export type Attempt={id:string;day:number;level:2|3;score:number;valid:boolean;fingerprint:string;createdAt:number};
export type Ledger={schemaVersion:1;evidence:Record<string,Evidence>;best:Record<string,Attempt>;history:Attempt[]};
export const LEDGER_KEY='before-adam-challenge-ledger-v1';
export function readLedger():Ledger{try{const v=JSON.parse(localStorage.getItem(LEDGER_KEY)||'null');if(v?.schemaVersion===1&&v.evidence&&v.best&&Array.isArray(v.history))return v}catch{}return {schemaVersion:1,evidence:{},best:{},history:[]}}
export function writeLedger(v:Ledger){localStorage.setItem(LEDGER_KEY,JSON.stringify(v))}
export function signature(graph:Graph){return JSON.stringify({nodes:graph.nodes.map(n=>[n.id,n.op,n.value,n.expression,n.unit]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))),edges:graph.edges.map(e=>[e.from,e.to,e.slot]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))})}
export function assess(day:number,level:2|3,graph:Graph,world?:WorldMetrics):Evidence[]{
 const now=Date.now(),fingerprint=signature(graph),result:Evidence[]=[];
 const count=[7,8,12,12,12,14][day-1];
 const star=day===1?checkStarGraph(graph.nodes,graph.edges):null;
 const lab=day>1?labCheck(day-1,graph.nodes,graph.edges):null;
 const metrics=world||deriveWorld({[day]:graph});
 for(let i=1;i<=count;i++){const id='d'+day+'-'+i;let status:Evidence['status']='unimplemented',reason='Physics validator not implemented yet',score:number|null=null;
 if(day===1&&star){const c=star.checks[i-1];if(c){status=c.passed?'validated':'failed';reason=c.detail;const physics=star.input?validateStar(star.input):null;const residual=i===5?physics?.hydroResidual:i===6?physics?.thermalResidual:i===7?Math.max(physics?.hydroResidual??1,physics?.thermalResidual??1):0;const quality=i>=5?100*Math.exp(-Math.max(0,residual??1)*12):i===2?100*Math.exp(-Math.abs((physics?.gravity??274)-274)/274):i===3?100*Math.exp(-Math.abs((star.input?.coreMK??15.7)-15.7)/15.7):i===4?100*Math.exp(-Math.abs(Math.log(Math.max(.0001,physics?.fusion??1)))):100;score=scoreAttempt({feasibility:c.passed?100:0,stability:quality,efficiency:quality,resilience:quality});if(i===7&&!star.complete){status='failed';reason='Stable output must be connected and all seven checks must pass';score=0}}}
 // Only the matching starter calculation can supply preliminary evidence.
 if(day===2&&i===5||day===3&&i===1||day===4&&i===2||day===5&&i===1||day===6&&i===5){status=lab?.passed?'validated':'failed';reason=(lab?.reason||'No solver output')+' · Starter model only';const quality=worldScore(metrics);score=scoreAttempt({feasibility:lab?.passed?100:0,stability:quality.stability,efficiency:quality.efficiency,resilience:quality.resilience});if(metrics.warnings.length)reason+=' · '+metrics.warnings.join('; ')}
 result.push({id,day,level,status,score,reason,fingerprint,solver:day===1?GRAPH_SOLVER:'starter-lab-v1',updatedAt:now})}
 return result;
}
export function reconcile(ledger:Ledger,day:number,level:2|3,graph:Graph,world?:WorldMetrics):Ledger{
 const evidence=assess(day,level,graph,world),key=(id:string)=>id+':'+level;
 const prior=Object.values(ledger.evidence);
 const previous=prior.find(e=>e.day===day&&e.level===level);const changed=previous?previous.fingerprint!==signature(graph):prior.some(e=>e.day>day&&e.level===level);
 for(const entry of prior){if(changed&&entry.day>day&&entry.status!=='stale'){ledger.evidence[key(entry.id)]={...entry,status:'stale',reason:'Earlier day changed: re-run this challenge before relying on the result'}}}
 for(const e of evidence){ledger.evidence[key(e.id)]=e;if(e.score!==null){const attempt:Attempt={id:e.id,day,level,score:e.score,valid:e.status==='validated',fingerprint:e.fingerprint,createdAt:e.updatedAt};const prev=ledger.best[key(e.id)];if(attempt.valid&&(!prev||attempt.score>prev.score))ledger.best[key(e.id)]=attempt;ledger.history.push(attempt)}}
 ledger.history=ledger.history.slice(-500);return ledger;
}
export function dailySummary(ledger:Ledger,day:number,level:2|3){const entries=Object.values(ledger.evidence).filter(e=>e.day===day&&e.level===level);return {validated:entries.filter(e=>e.status==='validated').length,failed:entries.filter(e=>e.status==='failed').length,unimplemented:entries.filter(e=>e.status==='unimplemented').length,stale:entries.filter(e=>e.status==='stale').length,total:[7,8,12,12,12,14][day-1]}}
