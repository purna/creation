import {describe,it,expect} from 'vitest';
import {newStarGraph,checkStarGraph} from './starGraph';
import {connectionFeedback,guideSteps} from './starGuide';
import {checkDimensions} from './dimensions';
import type {Node,Edge} from '../model';
const wired=()=>{const g=newStarGraph();for(const step of guideSteps)step.inputs.forEach((input,slot)=>g.edges.push({from:input.id,to:step.id,slot}));return g};
describe('Day 1 stellar learning',()=>{
 it('does not unlock an unwired template',()=>{const g=newStarGraph();expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false)});
 it('unlocks a correctly wired solar-calibrated stable star',()=>{const g=wired();expect(checkStarGraph(g.nodes,g.edges).complete).toBe(true)});
 it('rejects wrong formula input and reports required unit',()=>{const g=newStarGraph();const v=connectionFeedback(g.nodes,g.edges,'radius','gravity',0);expect(v.ok).toBe(false);expect(v.message).toContain('M☉')});
 it('rejects mismatched source unit',()=>{const g=newStarGraph();g.nodes.find(n=>n.id==='mass')!.unit='kg';expect(connectionFeedback(g.nodes,g.edges,'mass','gravity',0).ok).toBe(false)});
 it('rejects circular wiring',()=>{const g=newStarGraph();expect(connectionFeedback(g.nodes,[{from:'thermal',to:'hydro',slot:0}], 'hydro','thermal',0).ok).toBe(false)});
 it('rejects physically unstable star despite correct wiring',()=>{const g=wired();g.nodes.find(n=>n.id==='coreMK')!.value=5;expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false)});
 it('rejects missing final output wire',()=>{const g=wired();g.edges=g.edges.filter(e=>e.to!=='out');expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false)});
 it('rejects a wrong source unit in imported graph',()=>{const g=wired();g.nodes.find(n=>n.id==='mass')!.unit='kg';expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false)});
 it('rejects missing intermediate formula connection',()=>{const g=wired();g.edges=g.edges.filter(e=>!(e.to==='fusion'&&e.slot===2));expect(checkStarGraph(g.nodes,g.edges).complete).toBe(false)});
});
describe('SI dimensional analysis',()=>{
 const n=(id:string,kind:Node['kind'],op:string,unit?:string):Node=>({id,kind,op,label:id,x:0,y:0,unit,value:1});
 it('multiplies force by distance to get energy',()=>{const nodes=[n('force','number','constant','N'),n('distance','number','constant','m'),n('work','formula','multiply'),n('out','output','display')];const edges:Edge[]=[{from:'force',to:'work',slot:0},{from:'distance',to:'work',slot:1},{from:'work',to:'out',slot:0}];const result=checkDimensions(nodes,edges);expect(result.errors).toEqual([]);expect(result.units.work).toBe('M·L^2·T^-2')});
 it('rejects adding distance and time',()=>{const nodes=[n('distance','number','constant','m'),n('time','number','constant','s'),n('sum','formula','add')];expect(checkDimensions(nodes,[{from:'distance',to:'sum',slot:0},{from:'time',to:'sum',slot:1}]).errors.join()).toContain('Unit mismatch')});
 it('divides distance by time into velocity',()=>{const nodes=[n('distance','number','constant','m'),n('time','number','constant','s'),n('velocity','formula','divide')];const r=checkDimensions(nodes,[{from:'distance',to:'velocity',slot:0},{from:'time',to:'velocity',slot:1}]);expect(r.units.velocity).toBe('L·T^-1')});
 it('reports unsupported calibrated units in generic multiplication',()=>{const nodes=[n('sun','number','constant','M☉'),n('distance','number','constant','m'),n('product','formula','multiply')];expect(checkDimensions(nodes,[{from:'sun',to:'product',slot:0},{from:'distance',to:'product',slot:1}]).errors.length).toBeGreaterThan(0)});
});
