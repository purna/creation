import {describe,it,expect,beforeEach,afterEach} from 'vitest';
import {earthRule,newEarthGraph,validateEarthChallenge,rules} from './earthValidation';
import {evaluateDayGraphs,saveChallengeGraph,loadChallengeGraph} from './challengeGraphEngine';
const wired=(id:string)=>{
 const g=newEarthGraph(id);
 g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
 return g;
};
describe('Day 2 and 3 challenge physics fixtures',()=>{
 for(const id of Object.keys(rules)){
  it(id+' accepts a connected reference solution',()=>{
   expect(earthRule(id)).toBeDefined();
   const g=wired(id);
   expect(validateEarthChallenge(id,g).passed).toBe(true);
  });
  it(id+' rejects missing wires',()=>{
   const g=wired(id);g.edges.pop();
   expect(validateEarthChallenge(id,g).passed).toBe(false);
  });
  it(id+' rejects invalid physical inputs',()=>{
   const g=wired(id);g.nodes.find(n=>n.id==='a')!.value=-1;
   expect(validateEarthChallenge(id,g).passed).toBe(false);
  });
  it(id+' rejects duplicate connections',()=>{
   const g=wired(id);g.edges.push({from:'b',to:'calc',slot:0});
   expect(validateEarthChallenge(id,g).passed).toBe(false);
  });
 }
});
describe('Day completion gates and persistence',()=>{
 const data=new Map<string,string>();
 const store={setItem:(k:string,v:string)=>{data.set(k,v)},getItem:(k:string)=>data.get(k)??null};
 beforeEach(()=>{data.clear();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:store});});
 afterEach(()=>{Reflect.deleteProperty(globalThis,'localStorage');});
 for(const day of [1,2]){
  const ids=Object.keys(rules).filter(id=>id.startsWith('d'+(day+1)+'-'));
  it('Day '+(day+1)+' requires all '+ids.length+' validated graphs',()=>{
   const master=newEarthGraph(ids[0]);
   expect(evaluateDayGraphs(day,master).complete).toBe(false);
   for(const id of ids){saveChallengeGraph(store,day,id,wired(id));expect(loadChallengeGraph(store,day,id)).toEqual(wired(id));}
   expect(evaluateDayGraphs(day,master).complete).toBe(true);
   const broken=wired(ids[0]);broken.edges=[];
   saveChallengeGraph(store,day,ids[0],broken);
   expect(evaluateDayGraphs(day,master).complete).toBe(false);
  });
 }
});
