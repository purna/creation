import solutions from '../data/challenge-solutions.json';
import earthSolutions from '../data/earth-cheat-solutions.json';
import {makeDay1Demo} from './demoPresets';
import {newEarthGraph,validateEarthChallenge} from './earthValidation';
import {checkStarGraph} from './starGraph';
import type {Node,Edge} from '../model';
export type CheatGraph={nodes:Node[];edges:Edge[]};
type CheatLevel=2|3;
export function cheatStarGraph():CheatGraph{
 const graph=makeDay1Demo('working');
 const example=solutions.days.find(d=>d.day===1)?.challenges[0]?.examples?.[0]?.inputs;
 if(!example)throw Error('Day 1 reference JSON missing');
 for(const [id,value] of Object.entries(example)){
  const node=graph.nodes.find(n=>n.id===id);
  if(node&&typeof value==='number')node.value=value;
 }
 if(!checkStarGraph(graph.nodes,graph.edges).complete)throw Error('Day 1 JSON reference did not validate');
 return graph;
}
export function cheatEarthGraph(id:string,level:CheatLevel):CheatGraph{
 const inputs=(earthSolutions.challenges as Record<string,{a:number;b:number;sensitivity:number;uncertainty:number}>)[id];
 if(!inputs)throw Error('Missing JSON reference '+id);
 const graph=newEarthGraph(id,level);
 for(const [key,value] of Object.entries(inputs)){
  const node=graph.nodes.find(n=>n.id===key);
  if(node)node.value=value;
 }
 graph.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
 const check=validateEarthChallenge(id,graph,level);
 if(!check.passed)throw Error('JSON reference rejected for '+id+': '+check.reason);
 return graph;
}
