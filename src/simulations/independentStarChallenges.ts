import {checkStarGraphAtLevel} from './starGraph';
import {challengeDefinitions,mergeChallengeGraph,loadChallengeGraph,type ChallengeGraph} from './challengeGraphEngine';
export function assembleDay1Challenges(storage:Pick<Storage,'getItem'>,master:ChallengeGraph,level:2|3){
 let graph:ChallengeGraph={nodes:master.nodes.map(n=>({...n})),edges:[]};
 const missing:string[]=[];
 for(const [index,item] of challengeDefinitions(0).entries()){
  const saved=loadChallengeGraph(storage,0,item.id,level);
  if(!saved){missing.push(item.id);continue;}
  graph=mergeChallengeGraph(0,index,graph,saved);
 }
 graph.edges.push({from:'stable',to:'out',slot:0});
 const checked=checkStarGraphAtLevel(graph.nodes,graph.edges,level);
 return {graph,missing,complete:missing.length===0&&checked.complete,checked};
}
