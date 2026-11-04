import {type Node,type Edge} from '../model';
import {earthRule,validateEarthChallenge} from './earthValidation';
export type PayoffGraph={nodes:Node[];edges:Edge[]};
export const day5Animations=[
 ['d5-1','Underwater light','Dark water; transmitted-light budget incomplete.','Light shafts illustrate surface light × transmitted fraction.','light'],
 ['d5-2','Dissolved oxygen','Low or unmeasured dissolved oxygen.','Oxygen gauge illustrates calculated concentration.','oxygen'],
 ['d5-3','Nutrient recycling','Nutrient recycling budget incomplete.','Nutrient-flow illustration follows recycled/consumed ratio; upwelling is not calculated.','nutrients'],
 ['d5-4','Phytoplankton production','No plankton production shown.','Plankton glow illustrates captured energy; biomass growth is not simulated.','plankton'],
 ['d5-5','Trophic energy transfer','Empty trophic energy pyramid.','Energy pyramid illustrates consumer/producer energy ratio.','pyramid'],
 ['d5-6','Fish populations','Fish population/capacity budget incomplete.','Shoal illustration reflects population/capacity ratio; schooling dynamics are not calculated.','shoal'],
 ['d5-7','Bird lift','Lift below required weight margin.','Lift/weight arrows illustrate the calculated force margin.','lift'],
 ['d5-8','Flight energy','Flight-energy budget short of demand.','Energy bar illustrates available/required flight energy; wing beats are not simulated.','energy'],
 ['d5-9','Bird populations','Bird recruitment/loss budget incomplete.','Bird illustration follows recruitment/loss budget; take-off dynamics are not calculated.','birds'],
 ['d5-10','Connected food webs','Food-web production insufficient for consumption.','Food-web links illustrate production/consumption ratio; species interactions are not simulated.','foodweb'],
 ['d5-11','Biodiversity','Unfilled species-richness tiles.','Species tiles show richness relative to reference; evenness is not calculated.','tiles'],
 ['d5-12','Multigeneration stability','Initial/final population comparison incomplete.','Population comparison illustrates final/initial ratio; stable cycles across generations are not proven.','generations']
].map(([id,title,before,after,kind])=>({id,title,before,after,kind}));
export function day5PayoffState(id:string,graph:PayoffGraph,level:2|3){
  const animation=day5Animations.find(a=>a.id===id);if(!animation)throw Error('No payoff for '+id);
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
