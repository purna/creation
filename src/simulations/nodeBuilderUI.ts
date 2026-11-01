import {newBlueprint,validateBlueprint,saveBlueprint} from './nodeBuilder';
import type {Node} from '../model';
export function openNodeBuilder(onUse:(node:Node)=>void){
 const root=document.createElement('section');root.className='node-builder-overlay';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
 const b=newBlueprint('custom-'+Date.now(),'My formula',[{id:'a'},{id:'b'}],'add');
 root.innerHTML='<div class="node-builder-window"><h2>Physics Node Builder</h2><p>Build a formula from two input nodes and an operator. Connect its ports, test an example, then save and use it.</p><label>Name <input id="nb-name" value="My formula"></label><label>Operator <select id="nb-op"><option>add</option><option>multiply</option><option>divide</option><option>sqrt</option></select></label><div class="node-builder-canvas"><span>Input A</span><span>Operator</span><span>Output</span><span>Input B</span></div><label>A <input id="nb-a" type="number" value="3" step="any"></label><label>B <input id="nb-b" type="number" value="4" step="any"></label><label>Expected result <input id="nb-result" type="number" value="7" step="any"></label><p><label><input id="nb-wire-a" type="checkbox"> A → operator</label><label><input id="nb-wire-b" type="checkbox"> B → operator</label><label><input id="nb-wire-out" type="checkbox"> Operator → output</label></p><button id="nb-test">Test</button><button id="nb-save">Save</button><button id="nb-use">Use in challenge</button><button id="nb-close">Close</button><p id="nb-status" role="status"></p></div>';
 const el=(id:string)=>root.querySelector<HTMLInputElement>('#'+id)!;
 const status=(msg:string)=>{root.querySelector<HTMLElement>('#nb-status')!.textContent=msg};
 const sync=()=>{
  b.name=el('nb-name').value.trim();
  b.graph.nodes.find(n=>n.id==='calc')!.op=(root.querySelector<HTMLSelectElement>('#nb-op')!).value;
  b.graph.nodes.find(n=>n.id==='a')!.value=Number(el('nb-a').value);
  b.graph.nodes.find(n=>n.id==='b')!.value=Number(el('nb-b').value);
  b.graph.edges=[];
  if(el('nb-wire-a').checked)b.graph.edges.push({from:'a',to:'calc',slot:0});
  if(el('nb-wire-b').checked)b.graph.edges.push({from:'b',to:'calc',slot:1});
  if(el('nb-wire-out').checked)b.graph.edges.push({from:'calc',to:'out',slot:0});
  b.expected=[{inputs:{a:Number(el('nb-a').value),b:Number(el('nb-b').value)},value:Number(el('nb-result').value),tolerance:0.0001}];
  return validateBlueprint(b);
 };
 root.querySelector<HTMLButtonElement>('#nb-test')!.onclick=()=>{const result=sync();status(result.passed?'✓ Worked example passed':result.errors.join('; '))};
 root.querySelector<HTMLButtonElement>('#nb-save')!.onclick=()=>{try{sync();saveBlueprint(localStorage,b);status('Blueprint saved')}catch(e){status(String(e))}};
 root.querySelector<HTMLButtonElement>('#nb-use')!.onclick=()=>{
  try{sync();saveBlueprint(localStorage,b);const group=JSON.parse(JSON.stringify(b.graph)) as typeof b.graph;
   for(let i=0;i<b.inputs.length;i++){const n=group.nodes.find(n=>n.id===b.inputs[i].id);if(n){n.kind='group-input';n.op='input'+i}}
   onUse({id:'n'+Date.now(),kind:'group',op:'group',label:b.name,x:180,y:120,group});root.remove();
  }catch(e){status(String(e))}
 };
 root.querySelector<HTMLButtonElement>('#nb-close')!.onclick=()=>root.remove();
 document.body.appendChild(root);
}
