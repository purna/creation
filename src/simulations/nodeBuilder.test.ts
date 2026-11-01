import {describe,it,expect} from 'vitest';
import {newBlueprint,validateBlueprint,saveBlueprint,loadBlueprint,instantiateBlueprint} from './nodeBuilder';
describe('reusable node builder',()=>{
 const make=()=>{
  const b=newBlueprint('math.sum','Sum',[{id:'a'},{id:'b'}],'add');
  b.graph.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
  b.expected=[{inputs:{a:3,b:4},value:7,tolerance:0.000001},{inputs:{a:8,b:5},value:13,tolerance:0.000001}];
  return b;
 };
 it('validates a complete reusable formula with multiple fixtures',()=>expect(validateBlueprint(make()).passed).toBe(true));
 it('rejects incorrect numerical examples',()=>{const b=make();b.expected[1].value=12;expect(validateBlueprint(b).passed).toBe(false)});
 it('rejects dangling wires',()=>{const b=make();b.graph.edges[0].from='missing';expect(validateBlueprint(b).passed).toBe(false)});
 it('persists and loads only validated objects',()=>{
  const data=new Map<string,string>();
  const store={setItem:(k:string,v:string)=>data.set(k,v),getItem:(k:string)=>data.get(k)??null};
  const b=make();saveBlueprint(store,b);
  expect(loadBlueprint(store,b.id)?.name).toBe('Sum');
  expect(instantiateBlueprint(b,'instance').nodes.find(n=>n.id==='instance-calc')).toBeDefined();
 });
});
