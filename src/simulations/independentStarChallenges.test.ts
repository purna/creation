import {describe,it,expect} from 'vitest';
import {newStarGraph,STAR_FORMULAS} from './starGraph';
import {assembleDay1Challenges} from './independentStarChallenges';
import {saveChallengeGraph} from './challengeGraphEngine';
describe('Day 1 independent challenge integration',()=>{
 it('requires each of seven separately saved graphs',()=>{
  const master=newStarGraph();
  const data=new Map<string,string>();
  const store={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}};
  expect(assembleDay1Challenges(store,master,2).complete).toBe(false);
  for(let i=0;i<7;i++){
   const g=newStarGraph();
   for(let j=0;j<=i;j++)for(const [slot,from] of STAR_FORMULAS[j].inputs.entries())g.edges.push({from,to:STAR_FORMULAS[j].id,slot});
   saveChallengeGraph(store,0,'d1-'+(i+1),g,2);
  }
  const result=assembleDay1Challenges(store,master,2);
  expect(result.missing).toHaveLength(0);
  expect(result.complete).toBe(true);
 });
});
