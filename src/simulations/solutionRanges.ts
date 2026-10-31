import solutionData from '../data/challenge-solutions.json';
import type {StarInput} from './star';

type Acceptance={output:string;unit:string;min:number;max:number;maxExclusive?:boolean;params?:Record<string,number[]>;description:string};
type SolutionEntry={id:string;title:string;status:string;validator:string;acceptance:Acceptance|null;examples:{name:string;inputs:StarInput}[]};
const entries=(solutionData.days as {day:number;challenges:SolutionEntry[]}[]).flatMap(day=>day.challenges);
const byId=new Map(entries.map(entry=>[entry.id,entry]));

export function solutionRule(id:string){return byId.get(id)??null}
export function checkSolutionRange(id:string,values:Record<string,number>,input:StarInput|null){
 const rule=solutionRule(id);
 if(!rule||rule.status!=='active'||!rule.acceptance)return {passed:false,reason:'No implemented acceptance rule'};
 const a=rule.acceptance;
 const value=values[a.output];
 if(!Number.isFinite(value))return {passed:false,reason:'Connect the required output: '+a.output};
 if(value<a.min||(a.maxExclusive?value>=a.max:value>a.max))return {passed:false,reason:`${a.output} = ${value.toPrecision(5)} ${a.unit}; expected ${a.min} to ${a.max}${a.maxExclusive?' (exclusive)':''}`};
 for(const [key,range] of Object.entries(a.params||{})){
  const v=input?.[key as keyof StarInput];
  if(v===undefined||!Number.isFinite(v)||v<range[0]||v>range[1])
   return {passed:false,reason:`${key} must be between ${range[0]} and ${range[1]}`};
 }
 return {passed:true,reason:`Within ${a.min}–${a.max} ${a.unit}`};
}
