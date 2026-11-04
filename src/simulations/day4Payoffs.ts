import {type Node,type Edge} from '../model';
import {earthRule,validateEarthChallenge} from './earthValidation';
export type PayoffGraph={nodes:Node[];edges:Edge[]};
export const day4Animations=[
 ['d4-1','Newtonian gravity','No field lines or test-mass pull.','Gravity field and test-mass illustration follows computed acceleration.','gravity'],
 ['d4-2','Circular orbital speed','No accepted orbital speed; speed marker outside band.','Speed trail follows accepted circular-speed calculation; spiral-in or ejection needs an orbital solver.','orbit'],
 ['d4-3','Earth-like orbit','Open or missing orbit trail.','Orbit-period illustration; a closed trail alone must not claim integrated stability.','kepler'],
 ['d4-4','Eight planets','Unlit planet markers.','Eight planet markers light up when their required calculation passes.','planets'],
 ['d4-5','Orbital encounters','Unresolved closest approach; encounter calculation incomplete.','Encounter-distance illustration; perturbed orbital trails need a validated integration model.','encounter'],
 ['d4-6','Orbital stability','Orbital-energy budget drifting.','Energy-drift indicator follows final/initial energy ratio; ejection is not calculated.','energy'],
 ['d4-7','Rotation and day-night','No accepted day length; terminator stationary.','Day/night illustration follows computed rotation period.','rotation'],
 ['d4-8','Moon orbit','Moon period unresolved; Moon marker stationary.','Moon-period illustration; tidal bulge needs a separate tide calculation.','moon'],
 ['d4-9','Lunar phases','Blank lunar-phase strip.','Phase strip follows calculated synodic period.','phases'],
 ['d4-10','Axial tilt and seasons','No accepted seasonal tilt; illumination angle unresolved.','Seasonal illumination illustrates effective tilt; no climate seasons are simulated.','tilt'],
 ['d4-11','Calendar','Calendar count incomplete.','Year clock follows rotations/year; leap-year correction needs its own rule.','calendar'],
 ['d4-12','Orbital and environmental audit','Orbital audit checks incomplete.','Audit indicators show supplied checks-passed/required ratio; they do not run independent orbital tests.','audit']
].map(([id,title,before,after,kind])=>({id,title,before,after,kind}));
export function day4PayoffState(id:string,graph:PayoffGraph,level:2|3){
  const animation=day4Animations.find(a=>a.id===id);if(!animation)throw Error('No payoff for '+id);
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
