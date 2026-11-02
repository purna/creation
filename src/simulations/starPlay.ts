import type {Node,Edge} from '../model';
import {validateStar,defaultStar,type StarInput} from './star';
import {checkStarGraphAtLevel,graphStarInput} from './starGraph';
import {makeDay1Demo} from './demoPresets';
import {solutionRule} from './solutionRanges';
export type PlayGraph={nodes:Node[];edges:Edge[]};
export type PayoffState='idle'|'live'|'success'|'fail';
export const payoffTitles=['Fuel and gravity','Gravitational compression','Core conditions','Fusion ignition','Pressure balance','Energy balance','Stable star'];
export function copyGraph(graph:PlayGraph):PlayGraph{return JSON.parse(JSON.stringify(graph))}
export function bandMargin(value:number,min:number,target:number,max:number){
 if(!Number.isFinite(value)||value<min||value>max)return 0;
 if(value===target)return 1;
 return Math.max(0,Math.min(1,value<target?(value-min)/(target-min):(max-value)/(max-target)));
}
export function starPlayState(graph:PlayGraph,level:2|3){
 const checked=checkStarGraphAtLevel(graph.nodes,graph.edges,level),input=graphStarInput(graph.nodes);
 const physics=input?validateStar(input):null;
 const raw=input&&physics?{gravity:physics.gravity,pressure:physics.pressure,core:input.coreMK,fusion:physics.fusion,hydro:physics.hydroResidual,thermal:physics.thermalResidual,stable:Math.max(physics.hydroResidual,physics.thermalResidual)}:null;
 const baseline=validateStar(defaultStar);
 const margins=raw&&input?[
  Math.min(bandMargin(input.mass,.08,1,3),bandMargin(input.hydrogen,.5,.7,.8),bandMargin(raw.gravity,30,274,3000)),
  bandMargin(raw.gravity,30,274,3000),
  Math.min(bandMargin(input.coreMK,8,15.7,30),bandMargin(raw.pressure,.02,1,80)),
  bandMargin(raw.fusion,.03,baseline.fusion,50),
  Math.max(0,1-raw.hydro/.08),Math.max(0,1-raw.thermal/.08),
  Math.max(0,1-raw.stable/.04)
 ]:Array(7).fill(0);
 const targets=['gravity','pressure','core','fusion','hydro','thermal','stable'];
 const payoffs=payoffTitles.map((title,i)=>{
  const passed=i===6?checked.complete:!!checked.checks[i]?.passed;
  const wired=graph.edges.some(e=>e.to===targets[i]);
  const state:PayoffState=passed?'success':wired?(checked.connected[targets[i] as keyof typeof checked.connected]?'fail':'live'):'idle';
  return {id:'d1-'+(i+1),title,state,passed,margin:passed?margins[i]:0,value:raw?.[targets[i] as keyof typeof raw],reason:checked.checks[i]?.detail||'Add the five stellar input parameters.'};
 });
 const fuelConnected=graph.edges.filter(e=>e.to==='fusion'&&e.slot===2).length===1&&graph.edges.some(e=>e.from==='hydrogen'&&e.to==='fusion'&&e.slot===2)&&graph.nodes.find(n=>n.id==='hydrogen')?.unit==='fraction';
 const fuelPassed=!!physics?.checks[0]?.passed&&fuelConnected;
 // The solver produces 12 trajectory samples over 240 steps. This is not a lifetime in years.
 const stableFactor=physics?.stable?Math.min(1,physics.trajectory.length/12):0;
 const efficiency=Math.min(1,13/Math.max(1,graph.nodes.length));
 const score=checked.complete?Math.round(margins.reduce((a,b)=>a+b,0)/7*100*stableFactor*efficiency):0;
 return {checked,input,physics,payoffs,fuelConnected,fuelPassed,score,tier:!checked.complete?'In progress':score>=85?'Gold':score>=65?'Silver':'Pass',stableFactor,efficiency};
}
export const experimentFields=['mass','radius','hydrogen','coreMK','luminosity'] as const;
export const predictionScenarios=[
 {id:'mass',title:'Double the mass at the same radius',field:'mass',factor:2,output:'gravity',explanation:'In this model g = 274 M/R², so gravity rises in direct proportion to mass when radius stays fixed.'},
 {id:'radius',title:'Double the radius at the same mass',field:'radius',factor:2,output:'gravity',explanation:'In this model g = 274 M/R². Doubling radius reduces gravity to one quarter.'},
 {id:'fuel',title:'Reduce hydrogen fuel by 20%',field:'hydrogen',factor:.8,output:'fusion',explanation:'This classroom fusion proxy depends on the square of hydrogen fraction. Reducing fuel reduces fusion power.'}
] as const;
export function predictOutcome(graph:PlayGraph,index:number){
 const scenario=predictionScenarios[index];if(!scenario)throw Error('Unknown prediction');
 const before=graphStarInput(graph.nodes);if(!before)throw Error('Prediction needs finite stellar inputs');
 const after={...before,[scenario.field]:before[scenario.field]*scenario.factor};
 const first=validateStar(before),second=validateStar(after);
 const a=first[scenario.output],b=second[scenario.output];
 const direction=Math.abs(a-b)<1e-9?'same':b>a?'up':'down';
 return {before:a,after:b,direction,afterInput:after,explanation:scenario.explanation};
}
export function makeRepairPuzzle(){const graph=makeDay1Demo('working');graph.nodes.find(n=>n.id==='luminosity')!.value=1.12;return graph}
export function experimentStart(current:PlayGraph){return copyGraph(current)}
export function referenceExperiment(){return makeDay1Demo('working')}
export function setExperimentValue(graph:PlayGraph,field:keyof StarInput,value:number){
 if(!Number.isFinite(value)||value<0||!experimentFields.includes(field))throw Error('Use a finite non-negative stellar input');
 const node=graph.nodes.find(n=>n.id===field&&n.kind==='number');if(!node)throw Error('Input missing');node.value=value;
}
export function payoffRange(id:string){return solutionRule(id)?.acceptance||null}
