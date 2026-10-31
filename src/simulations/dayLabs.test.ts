import {describe,it,expect} from 'vitest';
import {stages} from '../model';
import {labSpec,labPreset,labCheck} from './dayLabs';
describe('Days 2–6 starter lab examples',()=>{for(let day=1;day<=5;day++){it('Day '+(day+1)+' has guidance',()=>expect(labSpec(day)?.concept).toBeTruthy());for(const mode of ['working','nearly','broken'] as const){it('Day '+(day+1)+' '+mode,()=>{const g=labPreset(day,stages[day],mode);expect(labCheck(day,g.nodes,g.edges).passed).toBe(mode==='working')})}it('Day '+(day+1)+' disconnected fails',()=>{const g=labPreset(day,stages[day],'working');expect(labCheck(day,g.nodes,[]).passed).toBe(false)})}});
