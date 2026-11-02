import {type Node,type Edge} from '../model';
import {earthRule,validateEarthChallenge} from './earthValidation';
export type PayoffGraph={nodes:Node[];edges:Edge[]};
export const earthAnimations=[
 ['d2-1','Retain an atmosphere','Gas layer missing or drifting away.','Gas-retention illustration follows calculated gravity.','gravity'],
 ['d2-2','Hold on to gas','Thin or escaping atmosphere.','Retention gauge follows escape speed / thermal speed. This model does not calculate pressure.','retention'],
 ['d2-3','Light the planet','Dark day side.','Sunlight rays and day-side brightness follow incoming flux.','light'],
 ['d2-4','Balance heating','Heating and cooling unequal.','Balance and thermal colour follow absorbed / outgoing flux, not a calculated temperature.','thermal'],
 ['d2-5','Make liquid water','Ice, liquid or vapour depends on temperature.','Simplified phase diagram. Pressure is an input but does not affect this classroom phase rule.','water'],
 ['d2-6','Raise vapour','Still sea surface.','Vapour illustrates cloud fraction × cycle multiplier, not a physical evaporation rate.','vapour'],
 ['d2-7','Close the water loop','Evaporation and precipitation unequal.','Cloud and rain loop illustrates the evaporation / precipitation budget.','rain'],
 ['d2-8','Keep the water','Water inventory drifting.','Inventory gauge compares final / initial water; no climate time-lapse is simulated.','inventory'],
 ['d3-1','Account for land and ocean','Land and ocean fractions unresolved.','Partition diagram shows land + ocean fractions, not core or mantle formation.','partition'],
 ['d3-2','Warm the interior','Interior heat budget outside range.','Interior glow follows radiogenic + primordial heat. No decay over time is calculated.','heat'],
 ['d3-3','Transport heat','Heat loss and supply unequal.','Heat arrows illustrate loss / supply. Mantle convection is not simulated.','transport'],
 ['d3-4','Partition the crust','Crust and mantle fractions unresolved.','Segments show crust + mantle fractions; plate fracture is illustrative.','plates'],
 ['d3-5','Move the plates','Plate motion calculation incomplete.','Drift arrows and motion follow calculated travel distance / elapsed years.','drift'],
 ['d3-6','Build a landscape','Uplift and erosion unbalanced.','Mountain height illustrates uplift / erosion balance, not predicted elevation or eruption dynamics.','mountain'],
 ['d3-7','Balance the ocean','Ocean-volume budget drifting.','Water line illustrates final / initial volume, not a sea-level height prediction.','coast'],
 ['d3-8','Feed the rivers','River inflow and outflow unequal.','Flowing path illustrates inflow / outflow. Channel erosion is not simulated.','river'],
 ['d3-9','Make soil','Bare rock; soil budget unbalanced.','Soil layer illustrates formation / erosion ratio, not depth accumulated over time.','soil'],
 ['d3-10','Support photosynthesis','Light or water availability insufficient.','Green glow follows light × water suitability; oxygen concentration is not calculated.','green'],
 ['d3-11','Grow plant cover','Recruitment and losses unbalanced.','Plant cover illustrates recruits / losses. Spatial population growth is not simulated.','plants'],
 ['d3-12','Support a living landscape','Available resources do not cover requirements.','Forest illustrates available / required resources; multigeneration stability is not simulated.','forest']
].map(([id,title,before,after,kind])=>({id,title,before,after,kind}));
export function earthPayoffState(id:string,graph:PayoffGraph,level:2|3){
 const animation=earthAnimations.find(a=>a.id===id);if(!animation)throw Error('No payoff for '+id);
 const rule=earthRule(id),verdict=validateEarthChallenge(id,graph,level);
 // Preview wiring exists only in this temporary copy. It can never award success.
 const preview=verdict.value===undefined&&verdict.reason==='Connect both inputs and output'
  ?validateEarthChallenge(id,{nodes:graph.nodes.map(n=>({...n})),edges:[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}]},2).value:undefined;
 const raw=verdict.value??preview,value=typeof raw==='number'&&Number.isFinite(raw)?raw:undefined;
 const state=verdict.passed?'success':graph.edges.length===0?'idle':graph.edges.length<3?'live':'fail';
 const target=(rule.min+rule.max)/2;
 const strength=value===undefined?0:Math.max(0,Math.min(2,value/Math.max(target,1e-9)));
 const input=(name:string)=>{const v=graph.nodes.find(n=>n.id===name)?.value;return typeof v==='number'&&Number.isFinite(v)?v:undefined};
 return {animation,verdict,state,value,preview:preview!==undefined&&verdict.value===undefined,strength,a:input('a'),b:input('b'),min:rule.min,max:rule.max};
}
