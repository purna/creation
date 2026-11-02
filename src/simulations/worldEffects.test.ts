import {describe,it,expect} from 'vitest';
import {worldEffectState} from './worldEffects';
describe('Completion-driven world animations',()=>{
 it('does not show Day 2 clouds until all challenges pass',()=>{
  expect(worldEffectState(1,false).clouds).toBe(false);
  expect(worldEffectState(1,true).clouds).toBe(true);
 });
 it('starts Day 3 with the current Day 2 clouds before land is complete',()=>{
  expect(worldEffectState(2,false,true,true)).toMatchObject({clouds:true,land:false});
  expect(worldEffectState(2,true,true,true)).toMatchObject({clouds:true,land:true});
 });
 it('keeps an incomplete Day 2 atmosphere when previewing Day 3',()=>{
  expect(worldEffectState(2,false,true,false)).toMatchObject({clouds:false,land:false});
  expect(worldEffectState(2,true,true,false)).toMatchObject({clouds:false,land:true});
 });
 it('respects disabled effects',()=>{
  expect(worldEffectState(1,true,false).clouds).toBe(false);
  expect(worldEffectState(2,true,false,true)).toMatchObject({clouds:false,land:false});
 });
 it('does not unlock Earth animations on Day 1',()=>{
  expect(worldEffectState(0,true)).toMatchObject({clouds:false,land:false});
 });
});
