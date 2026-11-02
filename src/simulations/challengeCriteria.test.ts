import {describe,it,expect} from 'vitest';
import {challengeCriteria,challengeExample} from './challengeCriteria';
import {newStarGraph,STAR_FORMULAS,checkStarGraphAtLevel} from './starGraph';
import {newEarthGraph,validateEarthChallenge,rules} from './earthValidation';
describe('JSON challenge criteria across all six days',()=>{
 for(const day of [1,2,3,4,5,6])for(let i=1;i<=(day===1?7:day===2?8:day===6?14:12);i++){
  const id='d'+day+'-'+i;
  it(id+' has examples and exactly 3 GCSE / 4 A Level criteria',()=>{
   expect(challengeExample(id)?.examples.length).toBeGreaterThan(0);
   expect(challengeCriteria(id,2,{graph:true,numerical:true,simulation:true}).passed).toBe(true);
   expect(challengeCriteria(id,3,{graph:true,numerical:true,simulation:true}).passed).toBe(false);
   expect(challengeCriteria(id,3,{graph:true,numerical:true,simulation:true,analysis:true}).passed).toBe(true);
  });
 }
 it('Day 1 Level 3 uses ten robustness scenarios',()=>{
  const g=newStarGraph();
  for(const f of STAR_FORMULAS)f.inputs.forEach((from,slot)=>g.edges.push({from,to:f.id,slot}));
  g.edges.push({from:'stable',to:'out',slot:0});
  const result=checkStarGraphAtLevel(g.nodes,g.edges,3);
  expect(result.robustness?.scenarios).toBe(10);
  expect(result.complete).toBe(true);
 });
 for(const id of Object.keys(rules))it(id+' computes propagated uncertainty at Level 3',()=>{
  const g=newEarthGraph(id,3);
  g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
  const result=validateEarthChallenge(id,g,3);
  expect(result.passed).toBe(true);
  expect(result.calculatedSensitivity).toBeGreaterThanOrEqual(0);
  expect(result.propagatedUncertainty).toBeGreaterThanOrEqual(0);
 });
});
