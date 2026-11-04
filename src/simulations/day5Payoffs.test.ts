import {describe,it,expect} from 'vitest';
import {day5Animations,day5PayoffState} from './day5Payoffs';
import {newEarthGraph} from './earthValidation';
const wires=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
describe('Day 5 payoff contract',()=>{
  it('covers every Day 5 challenge once',()=>{
    expect(new Set(day5Animations.map(x=>x.id)).size).toBe(12);
    expect(day5Animations.filter(x=>x.id.startsWith('d5-'))).toHaveLength(12);
  });
  for(const {id} of day5Animations)for(const level of [2,3] as const){
    it(`${id} level ${level} only succeeds after actual validation`,()=>{
      const g=newEarthGraph(id,level);expect(day5PayoffState(id,g,level).state).toBe('idle');
      g.edges=wires.slice(0,1);expect(day5PayoffState(id,g,level).state).toBe('live');
      g.edges=[...wires];expect(day5PayoffState(id,g,level).state).toBe('success');
      g.edges.push({from:'b',to:'calc',slot:0});expect(day5PayoffState(id,g,level).state).toBe('fail');
    });
    it(`${id} level ${level} preview cannot change graph or accept non-finite input`,()=>{
      const g=newEarthGraph(id,level),before=JSON.stringify(g);const preview=day5PayoffState(id,g,level);
      expect(preview.preview).toBe(true);expect(preview.verdict.passed).toBe(false);expect(JSON.stringify(g)).toBe(before);
      for(const value of [NaN,Infinity,-1]){g.nodes[0].value=value;g.edges=[...wires];const s=day5PayoffState(id,g,level);expect(s.state).not.toBe('success');expect(Number.isFinite(s.strength)).toBe(true);expect(s.value).toBeUndefined()}
    });
  }
  it('Hard analysis remains required even when the picture has an accepted numeric result',()=>{
    const g=newEarthGraph('d5-1',3);g.edges=[...wires];g.nodes=g.nodes.filter(n=>n.id!=='uncertainty');
    const s=day5PayoffState('d5-1',g,3);expect(s.state).toBe('fail');
  });
  it('rejects substituted formulas and unknown challenges',()=>{
    const g=newEarthGraph('d5-1');g.edges=[...wires];g.nodes.find(n=>n.id==='calc')!.op='divide';expect(day5PayoffState('d5-1',g,2).value).toBeUndefined();expect(()=>day5PayoffState('d5-13',g,2)).toThrow();
  });
});
