import {day5Animations,day5PayoffState,type PayoffGraph} from './day5Payoffs';
import {newEarthGraph} from './earthValidation';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function diagram(s:ReturnType<typeof day5PayoffState>){
  const k=s.animation.kind,x=s.strength,colour=s.state==='success'?'#9ee2ad':'#9bbddb',f=Math.min(1,x);
  const portion=s.a===undefined||s.b===undefined?0:Math.max(0,Math.min(1,s.a/Math.max(1e-9,s.a+s.b)));
  const water=`<rect x="20" y="90" width="280" height="90" fill="#1e5a8a"/>`;
  const dots=(n:number,c:string)=>Array.from({length:n},(_,i)=>`<circle class="earth-flow" cx="${40+(i*47)%260}" cy="${50+(i*31)%110}" r="${2+i%3}" fill="${c}"/>`).join('');
  switch(k){
  case 'light':return water+`<g class="earth-flow" stroke="#f5cc7e" stroke-width="3" opacity="${.2+f*.8}">${[40,70,100,130,160,190].map(y=>`<path d="M140 ${y}h60l-10-8m10 8-10 8"/>`).join('')}</g>`+`<path d="M170 60a40 40 0 0 1 0 80Z" fill="#f5cc7e" opacity="${f*.7}"/>`;
  case 'oxygen':return `<circle cx="160" cy="100" r="50" fill="#276789"/>`+`<rect x="255" y="40" width="18" height="120" fill="#17334e"/>`+`<rect x="255" y="${160-f*120}" width="18" height="${f*120}" fill="${colour}"/>`;
  case 'nutrients':return water+`<path d="M40 140q60-50 120 0t60 0" fill="none" stroke="#7acfff" stroke-width="4"/>`+dots(Math.round(2+f*14),'#a7be8c')+`<path d="M200 140q-60-50-120 0t-60 0" fill="none" stroke="#7acfff" stroke-width="4"/>`;
  case 'plankton':return water+dots(Math.round(3+f*16),'#c5f08b')+`<circle cx="160" cy="60" r="20" fill="#f5cc7e" opacity="${f*.8}"/>`;
  case 'pyramid':return `<path d="M160 160L120 100L200 100Z" fill="#a7be8c" opacity="${.4+f*.6}"/>`+`<path d="M160 140L135 80L185 80Z" fill="${colour}" opacity="${.6+f*.4}"/>`+`<text x="160" y="175" text-anchor="middle" fill="${colour}">Producer → Consumer</text>`;
  case 'shoal':return water+dots(Math.round(5+f*20),'#65b7ff')+`<path d="M40 100q120-60 240 0" fill="none" stroke="#8edaff" stroke-width="3"/>`;
  case 'lift':return `<circle cx="160" cy="100" r="14" fill="#d8dce5"/>`+`<path d="M160 40 L 160 160" stroke="${colour}" stroke-width="3"/>`+`<path d="M150 40 L 170 60 M150 60 L 170 40" stroke="${colour}" stroke-width="2"/>`+`<path d="M160 160 L 160 110" stroke="#888" stroke-width="3"/>`;
  case 'energy':return `<rect x="40" y="140" width="240" height="30" fill="#39506b33"/>`+`<rect x="43" y="143" width="${Math.min(234,f*234)}" height="24" fill="${colour}"/>`;
  case 'birds':return dots(Math.round(3+f*12),'#d8dce5')+`<path d="M40 60q60-30 120 0t60 0" fill="none" stroke="#8edaff" stroke-width="3"/>`;
  case 'foodweb':return `<circle cx="160" cy="60" r="12" fill="${colour}"/>`+`<circle cx="80" cy="120" r="10" fill="#a7be8c"/>`+`<circle cx="240" cy="120" r="10" fill="#a7be8c"/>`+`<path d="M150 72 L 140 108" stroke="${colour}" stroke-width="2"/>`+`<path d="M170 72 L 180 108" stroke="${colour}" stroke-width="2"/>`;
  case 'tiles':return Array.from({length:10},(_,i)=>`<rect x="${40+i*28}" y="120" width="22" height="${s.state==='success'?40:10}" fill="${i<Math.round(f*10)?colour:'#444'}"/>`).join('');
  case 'generations':return `<path d="M80 140L160 60L240 140Z" fill="none" stroke="${colour}" stroke-width="3"/>`+`<circle cx="160" cy="60" r="8" fill="${colour}"/>`+`<circle cx="80" cy="140" r="6" fill="${colour}"/>`+`<circle cx="240" cy="140" r="6" fill="${colour}"/>`;
  default:return water+dots(8,'#a7be8c');
  }
}
export function day5PayoffMarkup(id:string,graph:PayoffGraph,level:2|3){
  const s=day5PayoffState(id,graph,level),n=s.value===undefined?'Awaiting valid inputs':s.value.toPrecision(5);
  return `<section class="day5-payoff" data-payoff="${id}" data-level="${level}" data-state="${s.state}"><div class="payoff-scene-heading"><strong>${esc(s.animation.title)}</strong><span>${s.state==='success'?'★ Accepted':s.state==='fail'?'Needs adjustment':s.state==='live'?'Live preview':'Not connected'}</span></div><svg viewBox="0 0 320 200" role="img" aria-label="${esc(s.animation.title)}: ${s.state}">${diagram(s)}</svg><p role="status">${esc(s.verdict.reason)}</p><p>${s.preview?'Preview only · ':''}Result: <strong>${esc(n)}</strong> · Target ${s.min}–${s.max}</p><small>Before: ${esc(s.animation.before)}<br>After: ${esc(s.animation.after)}</small><div class="play-actions"><button data-day5-replay ${s.verdict.passed?'':'disabled'}>Replay payoff</button><button data-day5-skip>Skip animation</button></div></section>`;
}
export function setupDay5Payoffs(root:ParentNode=document,reference=false){
  root.querySelectorAll<HTMLElement>('.day5-payoff').forEach(element=>{
    const reduced=preference()||matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.classList.toggle('still',reduced);
    const key=element.dataset.payoff+':'+element.dataset.level;
    let seen:string[]=[];try{const data=JSON.parse(localStorage.getItem('creation-day5-payoffs-v1')||'[]');if(Array.isArray(data))seen=data.filter(x=>typeof x==='string')}catch{}
    let timer:ReturnType<typeof setTimeout>|undefined;
    const play=()=>{element.classList.toggle('still',reduced);element.classList.toggle('celebrating',!reduced);clearTimeout(timer);timer=setTimeout(()=>{element.classList.remove('celebrating');element.classList.add('still')},3000)};
    if(element.dataset.state==='success'&&!reference&&!seen.includes(key)){
     seen.push(key);try{localStorage.setItem('creation-day5-payoffs-v1',JSON.stringify(seen))}catch{}play();
    }
    element.querySelector<HTMLButtonElement>('[data-day5-replay]')!.onclick=play;
    element.querySelector<HTMLButtonElement>('[data-day5-skip]')!.onclick=()=>{clearTimeout(timer);element.classList.remove('celebrating');element.classList.add('still')};
  });
}
function preference(){try{return localStorage.getItem('creation-play-motion')==='reduced'}catch{return false}}
export function openDay5Payoffs(options:{day:number;level:2|3;initial:number;graph:(id:string)=>PayoffGraph;openGraph:(index:number)=>void}){
  const items=day5Animations.filter((x:{id:string})=>x.id.startsWith('d5-'));
  if(!items.length)return;
  const d=document.createElement('dialog');d.id='day5-payoffs';d.className='star-play-dialog';d.setAttribute('aria-labelledby','day5-payoff-heading');
  let index=Math.min(options.initial,items.length-1),reference=false;
  function render(){
   const item=items[index],g=reference?newEarthGraph(item.id,options.level):options.graph(item.id);
   if(reference)g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   d.innerHTML=`<div class="help-heading"><h2 id="day5-payoff-heading">Day 5 · Sea and Sky Life</h2><button data-close aria-label="Close day 5 payoffs">✕</button></div><label>Challenge<select id="day5-payoff-focus">${items.map((x:{id:string;title:string},i:number)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${esc(x.title)}</option>`).join('')}</select></label><div class="play-preferences"><label><input id="day5-reduced" type="checkbox" ${preference()||matchMedia('(prefers-reduced-motion: reduce)').matches?'checked':''}> Reduced motion</label></div><p>${reference?'Reference preview only. Your graph and completion are unchanged.':'Your saved challenge graph. Success requires its actual validator to pass.'}</p>${day5PayoffMarkup(item.id,g,options.level)}<div class="play-actions"><button data-reference>${reference?'Show my graph':'Preview reference (sandbox)'}</button><button data-open>Open challenge graph</button></div><p class="help-note">Educational diagram animations. Budgets and ratios do not prove ecosystem stability. Animations never award completion.</p>`;
   setupDay5Payoffs(d,reference);
   d.querySelector<HTMLButtonElement>('[data-close]')!.onclick=()=>d.close();
   d.querySelector<HTMLSelectElement>('#day5-payoff-focus')!.onchange=e=>{index=Number((e.target as HTMLSelectElement).value);reference=false;render()};
   d.querySelector<HTMLInputElement>('#day5-reduced')!.onchange=e=>{try{localStorage.setItem('creation-play-motion',(e.target as HTMLInputElement).checked?'reduced':'full')}catch{}render()};
   d.querySelector<HTMLButtonElement>('[data-reference]')!.onclick=()=>{reference=!reference;render()};
   d.querySelector<HTMLButtonElement>('[data-open]')!.onclick=()=>{d.close();options.openGraph(index)};
  }
  d.addEventListener('close',()=>{d.remove();document.querySelector<HTMLButtonElement>('#open-day5-payoffs')?.focus()},{once:true});
  document.body.append(d);render();d.showModal();
}
