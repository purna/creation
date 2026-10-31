import {describe,it,expect,beforeEach,afterEach} from 'vitest';
import {newEarthGraph,validateEarthChallenge,rules} from './earthValidation';
import {evaluateDayGraphs,saveChallengeGraph} from './challengeGraphEngine';
const wire=(id:string,level:2|3)=>{const g=newEarthGraph(id,level);g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];return g;};
describe('GCSE and A Level validator separation',()=>{
 for(const id of Object.keys(rules)){
  it(id+' passes GCSE reference and A Level reference',()=>{
   expect(validateEarthChallenge(id,wire(id,2),2).passed).toBe(true);
   expect(validateEarthChallenge(id,wire(id,3),3).passed).toBe(true);
  });
  it(id+' rejects GCSE-only graph at A Level',()=>{
   expect(validateEarthChallenge(id,wire(id,2),3).passed).toBe(false);
  });
  it(id+' rejects incomplete A Level uncertainty',()=>{
   const g=wire(id,3);g.nodes.find(n=>n.id==='uncertainty')!.value=0;
   expect(validateEarthChallenge(id,g,3).passed).toBe(false);
  });
 }
 const data=new Map<string,string>();
 const store={setItem:(k:string,v:string)=>{data.set(k,v)},getItem:(k:string)=>data.get(k)??null};
 beforeEach(()=>{data.clear();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:store});});
 afterEach(()=>{Reflect.deleteProperty(globalThis,'localStorage');});
 for(const day of [1,2]){
  it('Day '+(day+1)+' completion is isolated by learning level',()=>{
   const ids=Object.keys(rules).filter(id=>id.startsWith('d'+(day+1)+'-'));
   for(const id of ids)saveChallengeGraph(store,day,id,wire(id,2),2);
   expect(evaluateDayGraphs(day,wire(ids[0],2),2).complete).toBe(true);
   expect(evaluateDayGraphs(day,wire(ids[0],3),3).complete).toBe(false);
   for(const id of ids)saveChallengeGraph(store,day,id,wire(id,3),3);
   expect(evaluateDayGraphs(day,wire(ids[0],3),3).complete).toBe(true);
  });
 }
});
