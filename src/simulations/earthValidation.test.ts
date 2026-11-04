import {describe,it,expect,beforeEach,afterEach} from 'vitest';
import {earthRule,newEarthGraph,validateEarthChallenge,rules} from './earthValidation';
import {evaluateDayGraphs,saveChallengeGraph,loadChallengeGraph} from './challengeGraphEngine';
const wired=(id:string)=>{
 const g=newEarthGraph(id);
 g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
 return g;
};
describe('Day 2–6 classroom challenge fixtures',()=>{
 for(const id of Object.keys(rules)){
  it(id+' accepts a connected reference solution',()=>{
   expect(earthRule(id)).toBeDefined();
   const g=wired(id);
   expect(validateEarthChallenge(id,g).passed).toBe(true);
  });
  if(id.startsWith('d4-')||id.startsWith('d5-')||id.startsWith('d6-')){
   it(id+' rejects a substituted equation even when its result is in range',()=>{
    const g=wired(id);g.nodes.find(n=>n.id==='calc')!.expression=String((rules[id].min+rules[id].max)/2);
    expect(validateEarthChallenge(id,g).passed).toBe(false);
   });
   it(id+' rejects an out-of-range result',()=>{
    const g=wired(id);g.nodes.find(n=>n.id==='a')!.value=1e9;
    expect(validateEarthChallenge(id,g).passed).toBe(false);
   });
  }
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
  it(id+' passes at Level 3 Hard with sensitivity and uncertainty nodes',()=>{
   const g=newEarthGraph(id,3);
   g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   expect(validateEarthChallenge(id,g,3).passed).toBe(true);
  });
  it(id+' fails at Level 3 Hard without uncertainty node',()=>{
   const g=newEarthGraph(id,3);
   g.nodes=g.nodes.filter(n=>n.id!=='uncertainty');
   g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   expect(validateEarthChallenge(id,g,3).passed).toBe(false);
  });
  it(id+' fails at Level 3 Hard with zero uncertainty',()=>{
   const g=newEarthGraph(id,3);
   const u=g.nodes.find(n=>n.id==='uncertainty')!;u.value=0;
   g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   expect(validateEarthChallenge(id,g,3).passed).toBe(false);
  });
 }
});
describe('Day completion gates and persistence',()=>{
 const data=new Map<string,string>();
 const store={setItem:(k:string,v:string)=>{data.set(k,v)},getItem:(k:string)=>data.get(k)??null};
 beforeEach(()=>{data.clear();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:store});});
 afterEach(()=>{Reflect.deleteProperty(globalThis,'localStorage');});
 for(const day of [1,2,3,4,5]){
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
