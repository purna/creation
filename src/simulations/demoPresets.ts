import {newStarGraph,STAR_FORMULAS,checkStarGraph} from './starGraph';
import type {Node,Edge} from '../model';
export type DemoPreset='working'|'nearly'|'broken';
export function makeDay1Demo(preset:DemoPreset):{nodes:Node[];edges:Edge[]}{
 const graph=newStarGraph();
 for(const f of STAR_FORMULAS)f.inputs.forEach((from,slot)=>graph.edges.push({from,to:f.id,slot}));
 graph.edges.push({from:'stable',to:'out',slot:0});
 if(preset==='nearly')graph.nodes.find(n=>n.id==='luminosity')!.value=1.12;
 if(preset==='broken')graph.nodes.find(n=>n.id==='coreMK')!.value=7;
 return graph;
}
export function describeDay1Demo(preset:DemoPreset):string{
 const g=makeDay1Demo(preset),r=checkStarGraph(g.nodes,g.edges);
 return preset==='working'?'Complete solar-calibrated solution: '+r.checks.filter(c=>c.passed).length+'/7 checks pass.':
 preset==='nearly'?'Near miss: all equations are wired, but radiation exceeds fusion by about 12%. Tune luminosity toward 1 L☉.':
 'Unstable star: low core temperature prevents a balanced fusion-powered star. Explore the failed checks.';
}
export function makeStarterDemo(day:number):{nodes:Node[];edges:Edge[]}|null{
 if(day===0)return makeDay1Demo('working');
 return null;
}
