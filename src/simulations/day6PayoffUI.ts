import {day6Animations,day6PayoffState,type PayoffGraph} from './day6Payoffs';
import {newEarthGraph} from './earthValidation';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function diagram(s:ReturnType<typeof day6PayoffState>){
  const k=s.animation.kind,x=s.strength,colour=s.state==='success'?'#9ee2ad':'#9bbddb',f=Math.min(1,x);
  const portion=s.a===undefined||s.b===undefined?0:Math.max(0,Math.min(1,s.a/Math.max(1e-9,s.a+s.b)));
  const dots=(n:number,c:string)=>Array.from({length:n},(_,i)=>`<circle class="earth-flow" cx="${40+(i*47)%260}" cy="${50+(i*31)%110}" r="${2+i%3}" fill="${c}"/>`).join('');
  switch(k){
  case 'habitat':return `<rect x="40" y="70" width="240" height="60" fill="#276789"/>`+`<rect x="43" y="73" width="${234*portion}" height="54" fill="#a7be8c"/>`+`<text x="160" y="180" text-anchor="middle" fill="${colour}">Suitable habitat</text>`;
  case 'grazing':return dots(Math.round(3+f*12),'#a7be8c')+`<path d="M40 140q120-80 240 0" fill="none" stroke="#8edaff" stroke-width="3"/>`;
  case 'predator':return `<circle cx="100" cy="100" r="10" fill="#ed8b6a"/>`+`<circle cx="220" cy="100" r="14" fill="#5a3e36"/>`+`<path d="M110 100 L 210 100" stroke="${colour}" stroke-width="${1+f*3}"/>`;
  case 'tiles':return Array.from({length:10},(_,i)=>`<rect x="${40+i*28}" y="120" width="22" height="${s.state==='success'?40:10}" fill="${i<Math.round(f*10)?colour:'#444'}"/>`).join('');
  case 'settlement':return `<rect x="100" y="110" width="120" height="50" fill="#8b7d6b"/>`+`<rect x="130" y="90" width="60" height="20" fill="#6b5d4b"/>`+`<text x="160" y="170" text-anchor="middle" fill="${colour}">Population within capacity</text>`;
  case 'fields':return `<rect x="40" y="120" width="240" height="50" fill="#7d7a7c"/>`+`<rect x="43" y="123" width="${Math.min(234,f*234)}" height="44" fill="#a7be8c"/>`;
  case 'water':return `<path d="M40 150 L 160 60 L 280 150 Z" fill="#3f9ccc" opacity="${.4+f*.6}"/>`+`<rect x="255" y="30" width="18" height="120" fill="#17334e"/>`+`<rect x="255" y="${150-f*120}" width="18" height="${f*120}" fill="${colour}"/>`;
  case 'landmap':return `<rect x="40" y="70" width="120" height="100" fill="#a7be8c"/>`+`<rect x="160" y="70" width="120" height="${100*portion}" fill="#276789"/>`+`<text x="160" y="185" text-anchor="middle" fill="${colour}">Land allocation</text>`;
  case 'energy':return `<rect x="40" y="120" width="240" height="40" fill="#39506b33"/>`+`<rect x="43" y="123" width="${Math.min(234,f*234)}" height="34" fill="#f5cc7e"/>`;
  case 'treatment':return `<path d="M40 140 L 160 60 L 280 140" fill="none" stroke="#7d7a7c" stroke-width="4"/>`+`<path d="M80 120 L 160 80 L 240 120" fill="none" stroke="${colour}" stroke-width="${2+f*4}"/>`;
  case 'protection':return `<rect x="40" y="70" width="240" height="60" fill="#7d7a7c"/>`+`<rect x="43" y="73" width="${234*portion}" height="54" fill="#a7be8c"/>`+`<text x="160" y="180" text-anchor="middle" fill="${colour}">Protected habitat</text>`;
  case 'carbon':return `<circle cx="160" cy="100" r="40" fill="#c76a49"/>`+`<circle cx="160" cy="100" r="${15+f*20}" fill="${colour}"/>`;
  case 'recovery':return `<path d="M80 140L160 80L240 140Z" fill="none" stroke="${colour}" stroke-width="3"/>`+`<circle cx="80" cy="140" r="6" fill="${colour}"/>`+`<circle cx="160" cy="80" r="6" fill="${colour}"/>`+`<circle cx="240" cy="140" r="6" fill="${colour}"/>`;
  case 'audit':return `<rect x="40" y="70" width="240" height="60" fill="#17334e"/>`+`<rect x="43" y="73" width="${234*portion}" height="54" fill="${colour}"/>`+`<text x="160" y="180" text-anchor="middle" fill="${colour}">Planetary audit</text>`;
  default:return dots(8,'#a7be8c');
  }
}
export function day6PayoffMarkup(id:string,graph:PayoffGraph,level:2|3){
  const s=day6PayoffState(id,graph,level),n=s.value===undefined?'Awaiting valid inputs':s.value.toPrecision(5);
  return `<section class="day6-payoff" data-payoff="${id}" data-level="${level}" data-state="${s.state}"><div class="payoff-scene-heading"><strong>${esc(s.animation.title)}</strong><span>${s.state==='success'?'★ Accepted':s.state==='fail'?'Needs adjustment':s.state==='live'?'Live preview':'Not connected'}</span></div><svg viewBox="0 0 320 200" role="img" aria-label="${esc(s.animation.title)}: ${s.state}">${diagram(s)}</svg><p role="status">${esc(s.verdict.reason)}</p><p>${s.preview?'Preview only · ':''}Result: <strong>${esc(n)}</strong> · Target ${s.min}–${s.max}</p><small>Before: ${esc(s.animation.before)}<br>After: ${esc(s.animation.after)}</small><div class="play-actions"><button data-day6-replay ${s.verdict.passed?'':'disabled'}>Replay payoff</button><button data-day6-skip>Skip animation</button></div></section>`;
}
export function setupDay6Payoffs(root:ParentNode=document,reference=false){
  root.querySelectorAll<HTMLElement>('.day6-payoff').forEach(element=>{
    const reduced=preference()||matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.classList.toggle('still',reduced);
    const key=element.dataset.payoff+':'+element.dataset.level;
    let seen:string[]=[];try{const data=JSON.parse(localStorage.getItem('creation-day6-payoffs-v1')||'[]');if(Array.isArray(data))seen=data.filter(x=>typeof x==='string')}catch{}
    let timer:ReturnType<typeof setTimeout>|undefined;
    const play=()=>{element.classList.toggle('still',reduced);element.classList.toggle('celebrating',!reduced);clearTimeout(timer);timer=setTimeout(()=>{element.classList.remove('celebrating');element.classList.add('still')},3000)};
    if(element.dataset.state==='success'&&!reference&&!seen.includes(key)){
     seen.push(key);try{localStorage.setItem('creation-day6-payoffs-v1',JSON.stringify(seen))}catch{}play();
    }
    element.querySelector<HTMLButtonElement>('[data-day6-replay]')!.onclick=play;
    element.querySelector<HTMLButtonElement>('[data-day6-skip]')!.onclick=()=>{clearTimeout(timer);element.classList.remove('celebrating');element.classList.add('still')};
  });
}
function preference(){try{return localStorage.getItem('creation-play-motion')==='reduced'}catch{return false}}
export function openDay6Payoffs(options:{day:number;level:2|3;initial:number;graph:(id:string)=>PayoffGraph;openGraph:(index:number)=>void}){
  const items=day6Animations.filter((x:{id:string})=>x.id.startsWith('d6-'));
  if(!items.length)return;
  const d=document.createElement('dialog');d.id='day6-payoffs';d.className='star-play-dialog';d.setAttribute('aria-labelledby','day6-payoff-heading');
  let index=Math.min(options.initial,items.length-1),reference=false;
  function render(){
   const item=items[index],g=reference?newEarthGraph(item.id,options.level):options.graph(item.id);
   if(reference)g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
   d.innerHTML=`<div class="help-heading"><h2 id="day6-payoff-heading">Day 6 · Living World</h2><button data-close aria-label="Close day 6 payoffs">✕</button></div><label>Challenge<select id="day6-payoff-focus">${items.map((x:{id:string;title:string},i:number)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${esc(x.title)}</option>`).join('')}</select></label><div class="play-preferences"><label><input id="day6-reduced" type="checkbox" ${preference()||matchMedia('(prefers-reduced-motion: reduce)').matches?'checked':''}> Reduced motion</label></div><p>${reference?'Reference preview only. Your graph and completion are unchanged.':'Your saved challenge graph. Success requires its actual validator to pass.'}</p>${day6PayoffMarkup(item.id,g,options.level)}<div class="play-actions"><button data-reference>${reference?'Show my graph':'Preview reference (sandbox)'}</button><button data-open>Open challenge graph</button></div><p class="help-note">Educational diagram animations. Budgets and ratios do not prove planetary sustainability. Animations never award completion.</p>`;
   setupDay6Payoffs(d,reference);
   d.querySelector<HTMLButtonElement>('[data-close]')!.onclick=()=>d.close();
   d.querySelector<HTMLSelectElement>('#day6-payoff-focus')!.onchange=e=>{index=Number((e.target as HTMLSelectElement).value);reference=false;render()};
   d.querySelector<HTMLInputElement>('#day6-reduced')!.onchange=e=>{try{localStorage.setItem('creation-play-motion',(e.target as HTMLInputElement).checked?'reduced':'full')}catch{}render()};
   d.querySelector<HTMLButtonElement>('[data-reference]')!.onclick=()=>{reference=!reference;render()};
   d.querySelector<HTMLButtonElement>('[data-open]')!.onclick=()=>{d.close();options.openGraph(index)};
  }
  d.addEventListener('close',()=>{d.remove();document.querySelector<HTMLButtonElement>('#open-day6-payoffs')?.focus()},{once:true});
  document.body.append(d);render();d.showModal();
}
