import {describe,it,expect} from 'vitest';
import {starPlayState,bandMargin,copyGraph,experimentStart,referenceExperiment,makeRepairPuzzle,predictOutcome,setExperimentValue} from './starPlay';
import {newStarGraph,newStarChallengeGraph,STAR_FORMULAS,checkStarGraphAtLevel} from './starGraph';
import {validateStar} from './star';
const day1CheckIds=['gravity','pressure','core','fusion','hydro','thermal','stable'] as const;
function fullStarGraph(){const g=newStarGraph();const required=[...STAR_FORMULAS.flatMap(f=>f.inputs.map((from,slot)=>({from,to:f.id,slot}))),{from:'stable',to:'out',slot:0}];for(const r of required)g.edges.push(r);return g;}
describe('Day 1 individual challenges at Easy and Hard levels',()=>{
 for(const [index,checkId] of day1CheckIds.entries()){
  const challengeNum=index+1;
  it(`d1-${challengeNum} ${checkId} passes at Level 2 Easy with complete wired graph`,()=>{
   const g=fullStarGraph();const checked=checkStarGraphAtLevel(g.nodes,g.edges,2);
   expect(checked.checks[index]?.passed).toBe(true);
  });
  it(`d1-${challengeNum} ${checkId} passes at Level 3 Hard with robustness`,()=>{
   const g=fullStarGraph();const checked=checkStarGraphAtLevel(g.nodes,g.edges,3);
   expect(checked.checks[index]?.passed).toBe(true);expect(checked.robustness?.passed).toBe(true);expect(checked.robustness?.scenarios).toBe(10);
  });
  it(`d1-${challengeNum} ${checkId} fails at Level 2 when formula wires are removed`,()=>{
   const g=fullStarGraph();g.edges=[];const checked=checkStarGraphAtLevel(g.nodes,g.edges,2);
   expect(checked.checks[index]?.passed).not.toBe(true);
  });
  it(`d1-${challengeNum} ${checkId} rejects non-finite stellar inputs`,()=>{
   const g=fullStarGraph();const mass=g.nodes.find(n=>n.id==='mass');if(mass)mass.value=NaN;const checked=checkStarGraphAtLevel(g.nodes,g.edges,2);
   expect(checked.checks[index]?.passed).not.toBe(true);
  });
 }
});
describe('validator-driven play and replay',()=>{
 it('loads fuel without awarding a challenge or completing the day',()=>{
  const graph=newStarChallengeGraph();
  expect(starPlayState(graph,2).fuelPassed).toBe(false);
  graph.edges.push({from:'hydrogen',to:'fusion',slot:2});
  const state=starPlayState(graph,2);
  expect(state.fuelPassed).toBe(true);expect(state.checked.complete).toBe(false);
  expect(state.payoffs.every(p=>!p.passed)).toBe(true);expect(state.score).toBe(0);
 });
 it('rejects out-of-range fuel and duplicate fuel connections',()=>{
  const graph=referenceExperiment();graph.nodes.find(n=>n.id==='hydrogen')!.value=.2;
  expect(starPlayState(graph,2).fuelPassed).toBe(false);
  graph.nodes.find(n=>n.id==='hydrogen')!.value=.7;
  graph.edges.push({from:'mass',to:'fusion',slot:2});
  expect(starPlayState(graph,2).fuelPassed).toBe(false);
 });
 for(const level of [2,3] as const)it('scores the validated reference at Level '+level,()=>{
  const state=starPlayState(referenceExperiment(),level);
  expect(state.checked.complete).toBe(true);expect(state.payoffs.every(p=>p.passed)).toBe(true);
  expect(state.score).toBe(100);expect(state.tier).toBe('Gold');
 });
 it('does not celebrate the stable star if the final output is missing',()=>{
  const graph=referenceExperiment();graph.edges=graph.edges.filter(e=>e.to!=='out');
  const state=starPlayState(graph,2);
  expect(state.payoffs[6].passed).toBe(false);expect(state.score).toBe(0);
 });
 it('shows a real thermal failure for the one-edit repair puzzle',()=>{
  const graph=makeRepairPuzzle();const state=starPlayState(graph,2);
  expect(state.payoffs[5].state).toBe('fail');expect(state.checked.complete).toBe(false);
  setExperimentValue(graph,'luminosity',1);
  expect(starPlayState(graph,2).checked.complete).toBe(true);
 });
 it('does not change the original graph while experimenting',()=>{
  const graph=referenceExperiment(),original=copyGraph(graph),sandbox=experimentStart(graph);
  setExperimentValue(sandbox,'coreMK',7);
  expect(graph).toEqual(original);expect(starPlayState(sandbox,2).checked.complete).toBe(false);
 });
 it('returns deterministic margins and zero score outside a band',()=>{
  expect(bandMargin(15,10,15,20)).toBe(1);expect(bandMargin(10,10,15,20)).toBe(0);
  expect(bandMargin(12.5,10,15,20)).toBe(.5);expect(bandMargin(NaN,10,15,20)).toBe(0);
  expect(bandMargin(21,10,15,20)).toBe(0);
 });
 it('does not mutate a graph while scoring or predicting',()=>{
  const graph=referenceExperiment(),before=copyGraph(graph);
  starPlayState(graph,3);for(let i=0;i<3;i++)predictOutcome(graph,i);
  expect(graph).toEqual(before);
 });
 for(const mass of [.5,1,1.5])for(const radius of [.8,1,1.4])for(const fuel of [.5,.7,.8]){
  it(`predictions agree with model at M=${mass}, R=${radius}, X=${fuel}`,()=>{
   const graph=referenceExperiment();setExperimentValue(graph,'mass',mass);setExperimentValue(graph,'radius',radius);setExperimentValue(graph,'hydrogen',fuel);
   const a=predictOutcome(graph,0),b=predictOutcome(graph,1),c=predictOutcome(graph,2);
   expect(a.direction).toBe('up');expect(a.after/a.before).toBeCloseTo(2);
   expect(b.direction).toBe('down');expect(b.after/b.before).toBeCloseTo(.25);
   expect(c.direction).toBe('down');expect(c.after/c.before).toBeCloseTo(.64);
   expect(validateStar(c.afterInput).fusion).toBe(c.after);
  });
 }
});
