import {describe,it,expect} from 'vitest';
import {newStarGraph,checkStarGraph} from './starGraph';
import {guideSteps} from './starGuide';
import {extractChallengeGraph,mergeChallengeGraph,saveChallengeGraph,loadChallengeGraph,evaluateDayGraphs} from './challengeGraphEngine';
import {evaluate} from '../model';

const wired=()=>{
 const graph=newStarGraph();
 for(const step of guideSteps)for(let slot=0;slot<step.inputs.length;slot++)
  graph.edges.push({from:step.inputs[slot].id,to:step.id,slot});
 return graph;
};

describe('Day 1 isolated challenge graphs',()=>{
 it('extracts a small graph with a directly testable result',()=>{
  const master=newStarGraph();
  const part=extractChallengeGraph(0,0,master);
  expect(part.nodes.map(n=>n.id)).toContain('challenge-result');
  expect(part.nodes.map(n=>n.id)).not.toContain('thermal');
  expect(part.edges).toContainEqual({from:'gravity',to:'challenge-result',slot:0});
  expect(evaluate(part.nodes,part.edges).result).toBeUndefined();
 });
 it('calculates the selected challenge when wired',()=>{
  const master=wired();
  const part=extractChallengeGraph(0,0,master);
  expect(evaluate(part.nodes,part.edges).result).toBeCloseTo(274);
 });
 it('includes upstream dependency calculations in later challenges',()=>{
  const part=extractChallengeGraph(0,6,wired());
  expect(part.nodes.map(n=>n.id)).toEqual(expect.arrayContaining(['pressure','core','fusion','hydro','thermal','stable']));
  expect(evaluate(part.nodes,part.edges).result).toBeDefined();
 });
 it('merges the selected challenge without erasing other challenge wires',()=>{
  const master=wired();
  const part=extractChallengeGraph(0,0,master);
  part.edges=part.edges.filter(e=>e.to!=='gravity');
  const merged=mergeChallengeGraph(0,0,master,part);
  expect(merged.edges.filter(e=>e.to==='gravity')).toHaveLength(0);
  expect(merged.edges.filter(e=>e.to==='pressure')).toEqual(master.edges.filter(e=>e.to==='pressure'));
  expect(checkStarGraph(merged.nodes,merged.edges).complete).toBe(false);
 });
 it('rejects duplicate input slots during merge',()=>{
  const master=newStarGraph();
  const part=extractChallengeGraph(0,0,master);
  part.edges.push({from:'mass',to:'gravity',slot:0},{from:'radius',to:'gravity',slot:0});
  const merged=mergeChallengeGraph(0,0,master,part);
  expect(merged.edges.filter(e=>e.to==='gravity'&&e.slot===0)).toHaveLength(1);
 });
 it('saves and reloads independently',()=>{
  const memory=new Map<string,string>();
  const storage={setItem:(k:string,v:string)=>{memory.set(k,v)},getItem:(k:string)=>memory.get(k)??null};
  const part=extractChallengeGraph(0,0,wired());
  saveChallengeGraph(storage,0,'d1-1',part);
  // IDs vary by content registry; use the registered definition instead in other tests.
  expect(memory.size).toBe(1);
  expect(loadChallengeGraph(storage,0,'d1-1')).toEqual(part);
 });
 it('does not award a stable star to an incomplete master',()=>{
  expect(evaluateDayGraphs(0,newStarGraph()).complete).toBe(false);
 });
});
