import {describe,it,expect} from 'vitest';
import {cheatStarGraph,cheatEarthGraph} from './cheatSolutions';
import {checkStarGraph} from './starGraph';
import {validateEarthChallenge,rules} from './earthValidation';
import {evaluateDayGraphs,saveChallengeGraph,starterGraph} from './challengeGraphEngine';
describe('JSON-backed developer cheat solutions',()=>{
 it('loads a validated Day 1 graph from solution JSON',()=>{
  const g=cheatStarGraph();
  expect(checkStarGraph(g.nodes,g.edges).complete).toBe(true);
 });
 for(const level of [2,3] as const){
  for(const id of Object.keys(rules)){
   it('loads a passing '+id+' Level '+level+' graph',()=>{
    const g=cheatEarthGraph(id,level);
    expect(validateEarthChallenge(id,g,level).passed).toBe(true);
   });
  }
  for(const day of [1,2]){
   it('unlocks Day '+(day+1)+' only after all JSON graphs saved at Level '+level,()=>{
    const memory=new Map<string,string>();
    const store={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>{memory.set(key,value)}};
    const old=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
    Object.defineProperty(globalThis,'localStorage',{configurable:true,value:store});
    try{
     expect(evaluateDayGraphs(day,starterGraph(day),level).complete).toBe(false);
     const ids=Object.keys(rules).filter(id=>id.startsWith('d'+(day+1)+'-'));
     for(const id of ids)saveChallengeGraph(store,day,id,cheatEarthGraph(id,level),level);
     expect(evaluateDayGraphs(day,starterGraph(day),level).complete).toBe(true);
    }finally{if(old)Object.defineProperty(globalThis,'localStorage',old);else Reflect.deleteProperty(globalThis,'localStorage');}
   });
  }
 }
});
