import {describe,it,expect} from 'vitest';
import {newStarChallengeGraph,checkStarGraph} from './starGraph';
import {newEarthChallengeGraph,newEarthGraph,validateEarthChallenge,rules} from './earthValidation';
describe('Players must solve numerical challenges',()=>{
 it('Day 1 starts with an unstable star',()=>{
  const g=newStarChallengeGraph();
  expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false);
  expect(g.nodes.find(n=>n.id==='coreMK')?.value).not.toBe(15.7);
 });
 for(const level of [2,3] as const)for(const id of Object.keys(rules)){
  it(id+' Level '+level+' begins with parameters distinct from reference',()=>{
   const g=newEarthChallengeGraph(id,level),reference=newEarthGraph(id,level);
   expect(g.edges).toHaveLength(0);
   expect(g.nodes.find(n=>n.id==='a')?.value).not.toBe(reference.nodes.find(n=>n.id==='a')?.value);
   g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   expect(validateEarthChallenge(id,g,level).passed).toBe(false);
  });
 }
});
