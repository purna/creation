import {describe,it,expect} from 'vitest';
import {earthAnimations,earthPayoffState} from './earthPayoffs';
import {newEarthGraph} from './earthValidation';
const wires=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
describe('Day 2 and 3 payoff contract',()=>{
 it('covers every challenge once',()=>{expect(new Set(earthAnimations.map(x=>x.id)).size).toBe(20);expect(earthAnimations.filter(x=>x.id.startsWith('d2-'))).toHaveLength(8);expect(earthAnimations.filter(x=>x.id.startsWith('d3-'))).toHaveLength(12)});
 for(const {id} of earthAnimations)for(const level of [2,3] as const){
  it(`${id} level ${level} only succeeds after actual validation`,()=>{
   const g=newEarthGraph(id,level);expect(earthPayoffState(id,g,level).state).toBe('idle');
   g.edges=wires.slice(0,1);expect(earthPayoffState(id,g,level).state).toBe('live');
   g.edges=[...wires];expect(earthPayoffState(id,g,level).state).toBe('success');
   g.edges.push({from:'b',to:'calc',slot:0});expect(earthPayoffState(id,g,level).state).toBe('fail');
  });
  it(`${id} level ${level} preview cannot change graph or accept non-finite input`,()=>{
   const g=newEarthGraph(id,level),before=JSON.stringify(g);const preview=earthPayoffState(id,g,level);
   expect(preview.preview).toBe(true);expect(preview.verdict.passed).toBe(false);expect(JSON.stringify(g)).toBe(before);
   for(const value of [NaN,Infinity,-1]){g.nodes[0].value=value;g.edges=[...wires];const s=earthPayoffState(id,g,level);expect(s.state).not.toBe('success');expect(Number.isFinite(s.strength)).toBe(true);expect(s.value).toBeUndefined()}
  });
 }
 it('Hard analysis remains required even when the picture has an accepted numeric result',()=>{
  const g=newEarthGraph('d2-1',3);g.edges=[...wires];g.nodes=g.nodes.filter(n=>n.id!=='uncertainty');
  const s=earthPayoffState('d2-1',g,3);expect(s.value).toBeGreaterThan(8);expect(s.state).toBe('fail');
 });
 it('rejects substituted formulas and unknown challenges',()=>{
  const g=newEarthGraph('d2-1');g.edges=[...wires];g.nodes.find(n=>n.id==='calc')!.op='divide';expect(earthPayoffState('d2-1',g,2).value).toBeUndefined();expect(()=>earthPayoffState('d6-1',g,2)).toThrow();
 });
});
