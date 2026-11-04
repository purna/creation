import {describe,it,expect} from 'vitest';
import {day6Animations,day6PayoffState} from './day6Payoffs';
import {newEarthGraph} from './earthValidation';
const wires=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
describe('Day 6 payoff contract',()=>{
  it('covers every Day 6 challenge once',()=>{
    expect(new Set(day6Animations.map(x=>x.id)).size).toBe(14);
    expect(day6Animations.filter(x=>x.id.startsWith('d6-'))).toHaveLength(14);
  });
  for(const {id} of day6Animations)for(const level of [2,3] as const){
    it(`${id} level ${level} only succeeds after actual validation`,()=>{
      const g=newEarthGraph(id,level);expect(day6PayoffState(id,g,level).state).toBe('idle');
      g.edges=wires.slice(0,1);expect(day6PayoffState(id,g,level).state).toBe('live');
      g.edges=[...wires];expect(day6PayoffState(id,g,level).state).toBe('success');
      g.edges.push({from:'b',to:'calc',slot:0});expect(day6PayoffState(id,g,level).state).toBe('fail');
    });
    it(`${id} level ${level} preview cannot change graph or accept non-finite input`,()=>{
      const g=newEarthGraph(id,level),before=JSON.stringify(g);const preview=day6PayoffState(id,g,level);
      expect(preview.preview).toBe(true);expect(preview.verdict.passed).toBe(false);expect(JSON.stringify(g)).toBe(before);
      for(const value of [NaN,Infinity,-1]){g.nodes[0].value=value;g.edges=[...wires];const s=day6PayoffState(id,g,level);expect(s.state).not.toBe('success');expect(Number.isFinite(s.strength)).toBe(true);expect(s.value).toBeUndefined()}
    });
  }
  it('Hard analysis remains required even when the picture has an accepted numeric result',()=>{
    const g=newEarthGraph('d6-1',3);g.edges=[...wires];g.nodes=g.nodes.filter(n=>n.id!=='uncertainty');
    const s=day6PayoffState('d6-1',g,3);expect(s.state).toBe('fail');
  });
  it('rejects substituted formulas and unknown challenges',()=>{
    const g=newEarthGraph('d6-1');g.edges=[...wires];g.nodes.find(n=>n.id==='calc')!.op='divide';expect(day6PayoffState('d6-1',g,2).value).toBeUndefined();expect(()=>day6PayoffState('d6-15',g,2)).toThrow();
  });
});
