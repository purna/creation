import {type Node,type Edge} from '../model';
import {earthRule,validateEarthChallenge} from './earthValidation';
export type PayoffGraph={nodes:Node[];edges:Edge[]};
export const day6Animations=[
 ['d6-1','Habitat area','Unfilled suitable-habitat patches.','Habitat patches illustrate suitable/total area fraction.','habitat'],
 ['d6-2','Herbivore food budget','Plant-food supply short of herbivore demand.','Grazing illustration follows plant-food supply/demand; regrowth is not simulated.','grazing'],
 ['d6-3','Predator balance','Prey-energy supply short of predator demand.','Predator/prey budget illustration; coupled population oscillations are not calculated.','predator'],
 ['d6-4','Biodiversity','Species-retention tiles incomplete.','Species tiles reflect retained/reference count; ecological balance is not proven.','tiles'],
 ['d6-5','Human population','Population/capacity budget unresolved.','Settlement illustration follows population/capacity ratio.','settlement'],
 ['d6-6','Food production','Food supply below demand.','Fields and supply bar illustrate food production/demand.','fields'],
 ['d6-7','Freshwater supply','Freshwater supply below demand.','Water connection and gauge illustrate freshwater supply/demand.','water'],
 ['d6-8','Land allocation','Land-use fractions unallocated or overallocated.','Land map colours illustrate allocated fractions.','landmap'],
 ['d6-9','Energy supply','Energy supply below demand.','Power-source indicators illustrate energy supply/demand.','energy'],
 ['d6-10','Waste and pollution','Waste exceeds treatment capacity.','Treatment-flow indicator illustrates waste/treatment capacity; recycling dynamics are not calculated.','treatment'],
 ['d6-11','Habitat protection','Protected-area fraction below target.','Protected-area shading follows area fraction; species recovery is not calculated.','protection'],
 ['d6-12','Carbon and climate budget','Carbon emissions exceed uptake.','Carbon gauge follows emissions/uptake ratio; temperature trend is not calculated.','carbon'],
 ['d6-13','Disturbance recovery','Recovery comparison below target.','Recovery comparison shows after/before population ratio; shock response is not simulated.','recovery'],
 ['d6-14','Planetary audit','Whole-world audit incomplete.','Audit illustration shows supplied checks-passed/required ratio; full planetary simulation and World Challenge Mode are not implemented.','audit']
].map(([id,title,before,after,kind])=>({id,title,before,after,kind}));
export function day6PayoffState(id:string,graph:PayoffGraph,level:2|3){
  const animation=day6Animations.find(a=>a.id===id);if(!animation)throw Error('No payoff for '+id);
  const rule=earthRule(id),verdict=validateEarthChallenge(id,graph,level);
  const preview=verdict.value===undefined&&verdict.reason==='Connect both inputs and output'
   ?validateEarthChallenge(id,{nodes:graph.nodes.map(n=>({...n})),edges:[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}]},2).value:undefined;
  const raw=verdict.value??preview,value=typeof raw==='number'&&Number.isFinite(raw)?raw:undefined;
  const state=verdict.passed?'success':graph.edges.length===0?'idle':graph.edges.length<3?'live':'fail';
  const target=(rule.min+rule.max)/2;
  const strength=value===undefined?0:Math.max(0,Math.min(2,value/Math.max(target,1e-9)));
  const input=(name:string)=>{const v=graph.nodes.find(n=>n.id===name)?.value;return typeof v==='number'&&Number.isFinite(v)?v:undefined};
  return {animation,verdict,state,value,preview:preview!==undefined&&verdict.value===undefined,strength,a:input('a'),b:input('b'),min:rule.min,max:rule.max};
}
