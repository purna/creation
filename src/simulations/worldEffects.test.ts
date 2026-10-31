import {describe,it,expect} from 'vitest';
import {worldEffectState} from './worldEffects';
describe('Completion-driven world animations',()=>{
 it('does not show Day 2 clouds until all challenges pass',()=>{
  expect(worldEffectState(1,false).clouds).toBe(false);
  expect(worldEffectState(1,true).clouds).toBe(true);
 });
 it('Day 3 completion reveals land and retains Day 2 clouds',()=>{
  expect(worldEffectState(2,false)).toMatchObject({clouds:false,land:false});
  expect(worldEffectState(2,true)).toMatchObject({clouds:true,land:true});
 });
 it('respects disabled effects',()=>{
  expect(worldEffectState(1,true,false).clouds).toBe(false);
  expect(worldEffectState(2,true,false)).toMatchObject({clouds:false,land:false});
 });
 it('does not unlock Earth animations on Day 1',()=>{
  expect(worldEffectState(0,true)).toMatchObject({clouds:false,land:false});
 });
});
