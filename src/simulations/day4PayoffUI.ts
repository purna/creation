import {day4Animations,day4PayoffState,type PayoffGraph} from './day4Payoffs';
import {newEarthGraph} from './earthValidation';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function diagram(s:ReturnType<typeof day4PayoffState>){
  const k=s.animation.kind,x=s.strength,colour=s.state==='success'?'#9ee2ad':'#9bbddb',f=Math.min(1,x);
  const portion=s.a===undefined||s.b===undefined?0:Math.max(0,Math.min(1,s.a/Math.max(1e-9,s.a+s.b)));
  const sun=`<circle cx="160" cy="100" r="22" fill="#ffc76e"/>`;
  const orbitLine=(r:number)=>`<circle cx="160" cy="100" r="${r}" fill="none" stroke="#39506b33" stroke-width="1"/>`;
  const planet=(cx:number,cy:number,r:number,color:string)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
  switch(k){
  case 'gravity':return sun+`<path d="M160 100 L 160 40 M160 100 L 160 160 M160 100 L 220 100 M160 100 L 100 100" stroke="${colour}" stroke-width="${1+f*3}"/>`+`<circle cx="220" cy="100" r="${4+f*6}" fill="${colour}"/>`;
  case 'orbit':return sun+orbitLine(50)+`<path d="M210 100 A 50 50 0 ${f>0.5?1:0} 1 ${160+50*Math.cos(f*Math.PI*2)} ${100+50*Math.sin(f*Math.PI*2)}" fill="none" stroke="${colour}" stroke-width="3"/>`+planet(160+50*Math.cos(f*Math.PI*2),100+50*Math.sin(f*Math.PI*2),6,'#65b7ff');
  case 'kepler':return sun+orbitLine(55)+orbitLine(75)+`<path d="M215 100 A 55 55 0 1 1 ${160+55*Math.cos(f*Math.PI*4)} ${100+55*Math.sin(f*Math.PI*4)}" fill="none" stroke="${colour}" stroke-width="3" stroke-dasharray="${f>0.5?'none':'6 6'}"/>`;
  case 'planets':return sun+[.387,.723,1,1.524,5.2,9.58,19.2,30.1].map((r:number,i:number)=>`<g transform="translate(160,100)"><circle cx="${160+r*8}" cy="100" r="${2+i%3}" fill="${s.state==='success'?'#9ee2ad':'#888'}"/></g>`).join('');
  case 'encounter':return sun+orbitLine(60)+`<circle cx="${160+60*Math.cos(f*Math.PI)}" cy="${100+60*Math.sin(f*Math.PI)}" r="6" fill="#ed8b6a"/>`+`<circle cx="${160+50*Math.cos(f*Math.PI*1.3)}" cy="${100+50*Math.sin(f*Math.PI*1.3)}" r="5" fill="#b7aaa0"/>`;
  case 'energy':return sun+`<path d="M100 100 Q 160 40 220 100 T 160 160 T 100 100" fill="none" stroke="${colour}" stroke-width="${1+f*3}"/>`;
  case 'rotation':return sun+`<path d="M130 100 A 30 30 0 0 1 ${130+30*Math.cos(f*Math.PI*2)} ${100+30*Math.sin(f*Math.PI*2)}" fill="none" stroke="${colour}" stroke-width="4"/>`+`<line x1="160" y1="100" x2="${160+30*Math.cos(f*Math.PI*2)}" y2="${100+30*Math.sin(f*Math.PI*2)}" stroke="${colour}" stroke-width="2"/>`;
  case 'moon':return sun+`<circle cx="200" cy="100" r="40" fill="none" stroke="#888" stroke-width="1"/>`+`<circle cx="${200+40*Math.cos(f*Math.PI*2)}" cy="${100+40*Math.sin(f*Math.PI*2)}" r="4" fill="#d8dce5"/>`;
  case 'phases':return `<g transform="translate(160,100)">`+[0,0.25,0.5,0.75].map((p:number)=>`<circle cx="${(p-0.5)*40}" cy="0" r="14" fill="${p<f?'#d8dce5':'#444'}" stroke="#888" stroke-width="1"/> `).join('')+`</g>`;
  case 'tilt':return sun+`<path d="M160 60 L 160 140" stroke="#888" stroke-width="2"/>`+`<path d="M140 100 L ${140+Math.cos(f*Math.PI/2)*40} ${100-Math.sin(f*Math.PI/2)*40}" stroke="${colour}" stroke-width="3"/>`;
  case 'calendar':return sun+`<circle cx="160" cy="100" r="45" fill="none" stroke="#39506b33" stroke-width="2"/>`+`<path d="M205 100 A 45 45 0 ${f>0.5?1:0} 1 ${160+45*Math.cos(f*Math.PI*2*1.03)} ${100+45*Math.sin(f*Math.PI*2*1.03)}" fill="none" stroke="${colour}" stroke-width="3"/>`;
  case 'audit':return `<rect x="40" y="70" width="240" height="60" fill="#17334e"/>`+`<rect x="43" y="73" width="${234*portion}" height="54" fill="${colour}"/>`;
  default:return sun+orbitLine(50);
  }
}
export function day4PayoffMarkup(id:string,graph:PayoffGraph,level:2|3){
  const s=day4PayoffState(id,graph,level),n=s.value===undefined?'Awaiting valid inputs':s.value.toPrecision(5);
  return `<section class="day4-payoff" data-payoff="${id}" data-level="${level}" data-state="${s.state}"><div class="payoff-scene-heading"><strong>${esc(s.animation.title)}</strong><span>${s.state==='success'?'★ Accepted':s.state==='fail'?'Needs adjustment':s.state==='live'?'Live preview':'Not connected'}</span></div><svg viewBox="0 0 320 200" role="img" aria-label="${esc(s.animation.title)}: ${s.state}">${diagram(s)}</svg><p role="status">${esc(s.verdict.reason)}</p><p>${s.preview?'Preview only · ':''}Result: <strong>${esc(n)}</strong> · Target ${s.min}–${s.max}</p><small>Before: ${esc(s.animation.before)}<br>After: ${esc(s.animation.after)}</small><div class="play-actions"><button data-day4-replay ${s.verdict.passed?'':'disabled'}>Replay payoff</button><button data-day4-skip>Skip animation</button></div></section>`;
}
export function setupDay4Payoffs(root:ParentNode=document,reference=false){
  root.querySelectorAll<HTMLElement>('.day4-payoff').forEach(element=>{
    const reduced=preference()||matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.classList.toggle('still',reduced);
    const key=element.dataset.payoff+':'+element.dataset.level;
    let seen:string[]=[];try{const data=JSON.parse(localStorage.getItem('creation-day4-payoffs-v1')||'[]');if(Array.isArray(data))seen=data.filter(x=>typeof x==='string')}catch{}
    let timer:ReturnType<typeof setTimeout>|undefined;
    const play=()=>{element.classList.toggle('still',reduced);element.classList.toggle('celebrating',!reduced);clearTimeout(timer);timer=setTimeout(()=>{element.classList.remove('celebrating');element.classList.add('still')},3000)};
    if(element.dataset.state==='success'&&!reference&&!seen.includes(key)){
     seen.push(key);try{localStorage.setItem('creation-day4-payoffs-v1',JSON.stringify(seen))}catch{}play();
    }
    element.querySelector<HTMLButtonElement>('[data-day4-replay]')!.onclick=play;
    element.querySelector<HTMLButtonElement>('[data-day4-skip]')!.onclick=()=>{clearTimeout(timer);element.classList.remove('celebrating');element.classList.add('still')};
  });
}
function preference(){try{return localStorage.getItem('creation-play-motion')==='reduced'}catch{return false}}
export function openDay4Payoffs(options:{day:number;level:2|3;initial:number;graph:(id:string)=>PayoffGraph;openGraph:(index:number)=>void}){
  const items=day4Animations.filter((x:{id:string})=>x.id.startsWith('d4-'));
  if(!items.length)return;
  const d=document.createElement('dialog');d.id='day4-payoffs';d.className='star-play-dialog';d.setAttribute('aria-labelledby','day4-payoff-heading');
  let index=Math.min(options.initial,items.length-1),reference=false;
  function render(){
   const item=items[index],g=reference?newEarthGraph(item.id,options.level):options.graph(item.id);
   if(reference)g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   d.innerHTML=`<div class="help-heading"><h2 id="day4-payoff-heading">Day 4 · Sun, Moon and Planets</h2><button data-close aria-label="Close day 4 payoffs">✕</button></div><label>Challenge<select id="day4-payoff-focus">${items.map((x:{id:string;title:string},i:number)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${esc(x.title)}</option>`).join('')}</select></label><div class="play-preferences"><label><input id="day4-reduced" type="checkbox" ${preference()||matchMedia('(prefers-reduced-motion: reduce)').matches?'checked':''}> Reduced motion</label></div><p>${reference?'Reference preview only. Your graph and completion are unchanged.':'Your saved challenge graph. Success requires its actual validator to pass.'}</p>${day4PayoffMarkup(item.id,g,options.level)}<div class="play-actions"><button data-reference>${reference?'Show my graph':'Preview reference (sandbox)'}</button><button data-open>Open challenge graph</button></div><p class="help-note">Educational diagram animations. Budgets and ratios do not prove full orbital stability. Animations never award completion.</p>`;
   setupDay4Payoffs(d,reference);
   d.querySelector<HTMLButtonElement>('[data-close]')!.onclick=()=>d.close();
   d.querySelector<HTMLSelectElement>('#day4-payoff-focus')!.onchange=e=>{index=Number((e.target as HTMLSelectElement).value);reference=false;render()};
   d.querySelector<HTMLInputElement>('#day4-reduced')!.onchange=e=>{try{localStorage.setItem('creation-play-motion',(e.target as HTMLInputElement).checked?'reduced':'full')}catch{}render()};
   d.querySelector<HTMLButtonElement>('[data-reference]')!.onclick=()=>{reference=!reference;render()};
   d.querySelector<HTMLButtonElement>('[data-open]')!.onclick=()=>{d.close();options.openGraph(index)};
  }
  d.addEventListener('close',()=>{d.remove();document.querySelector<HTMLButtonElement>('#open-day4-payoffs')?.focus()},{once:true});
  document.body.append(d);render();d.showModal();
}
