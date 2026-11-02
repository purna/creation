import {earthAnimations,earthPayoffState,type PayoffGraph} from './simulations/earthPayoffs';
import {newEarthGraph} from './simulations/earthValidation';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const preference=()=>{try{return localStorage.getItem('creation-play-motion')==='reduced'}catch{return false}};
function diagram(s:ReturnType<typeof earthPayoffState>){
 const k=s.animation.kind,x=s.strength,colour=s.state==='success'?'#9ee2ad':'#9bbddb',f=Math.min(1,x),phase=s.value;
 const portion=s.a===undefined||s.b===undefined?0:Math.max(0,Math.min(1,s.a/Math.max(1e-9,s.a+s.b)));
 const planet=`<circle cx="160" cy="100" r="55" fill="#276789"/>`;
 const waves=`<path d="M30 155q30-14 60 0t60 0t60 0t60 0" fill="none" stroke="#8edaff" stroke-width="5"/>`;
 const arrows=`<path d="M45 65h65l-10-10m10 10-10 10M275 135h-65l10-10m-10 10 10 10" fill="none" stroke="${colour}" stroke-width="5"/>`;
 const plants=(count:number)=>Array.from({length:count},(_,i)=>`<g transform="translate(${30+i*25},${150-(i%2)*8})"><path d="M0 10v-35M0-12q-22-22-15-25Q0-35 0-12M0-18q22-22 15-25Q0-40 0-18" fill="${colour}" stroke="${colour}" stroke-width="3"/></g>`).join('');
 const dots=(count:number)=>Array.from({length:count},(_,i)=>`<circle class="earth-flow" cx="${45+(i*43)%235}" cy="${45+(i*29)%95}" r="${2+i%3}" fill="${colour}"/>`).join('');
 switch(k){
 case 'gravity':return planet+`<circle cx="160" cy="100" r="${58+(1-f)*24}" fill="none" stroke="${colour}" stroke-width="${2+f*8}" stroke-dasharray="${s.state==='success'?'none':'8 8'}"/>`+dots(Math.round(4+f*12));
 case 'retention':return planet+`<circle cx="160" cy="100" r="68" fill="none" stroke="${colour}" stroke-width="${3+f*10}"/><rect x="255" y="35" width="18" height="125" fill="#17334e"/><rect x="255" y="${160-f*125}" width="18" height="${f*125}" fill="${colour}"/>`;
 case 'light':return planet+`<g class="earth-flow" stroke="#f5cc7e" stroke-width="4" opacity="${.15+f*.85}">${[50,75,100,125,150].map(y=>`<path d="M15 ${y}h90l-12-6m12 6-12 6"/>`).join('')}</g><path d="M160 45a55 55 0 0 0 0 110Z" fill="#f5cc7e" opacity="${f*.8}"/>`;
 case 'thermal':return `<circle cx="160" cy="100" r="60" fill="hsl(${220-x*100} 65% 45%)"/>`+arrows+`<path d="M70 175h180M${70+Math.min(1,x/2)*180} 165v20" stroke="${colour}" stroke-width="4"/>`;
 case 'water':return waves+(phase===0?`<path d="M75 130l25-65 35 65 30-50 40 50Z" fill="#d7edff"/>`:phase===2?dots(18):`<path d="M55 130q100-45 210 0v35H55Z" fill="#3f9ccc"/>`);
 case 'vapour':return waves+dots(Math.round(3+f*20));
 case 'rain':return waves+`<path d="M75 70q-20-35 20-40q20-35 50 0q40-10 50 25q50 5 20 25H75Z" fill="${colour}"/>`+`<g class="earth-flow" stroke="#79c9ff" stroke-width="3">${Array.from({length:Math.round(2+f*12)},(_,i)=>`<path d="M${70+i*12} 100l-6 18"/>`).join('')}</g>`;
 case 'inventory':case 'coast':return `<path d="M40 45v125h240V45" fill="none" stroke="#9bbddb" stroke-width="4"/><rect x="43" y="${167-f*100}" width="234" height="${f*100}" fill="#3f9ccc"/>`+(k==='coast'?`<path d="M15 165l70-90 45 80 35-45 50 55Z" fill="#93866e"/>`:'');
 case 'partition':return `<rect x="40" y="65" width="240" height="70" fill="#276789"/><rect x="40" y="65" width="${240*portion}" height="70" fill="#a7be8c"/><text x="160" y="180" text-anchor="middle" fill="${colour}">Land + ocean</text>`;
 case 'heat':return planet+`<circle cx="160" cy="100" r="43" fill="#c76a49"/><circle cx="160" cy="100" r="${15+f*22}" fill="hsl(35 90% ${30+f*40}%)"/>`;
 case 'transport':return planet+`<circle cx="160" cy="100" r="38" fill="#bf7955"/>`+arrows;
 case 'plates':return planet+`<g fill="none" stroke="${colour}" stroke-width="4"><path d="M${120+portion*45} 50l15 33-20 30 35 37M${205-portion*35} 50l-15 35 30 25-10 40"/></g>`;
 case 'drift':return `<g class="earth-drift" style="--drift:${3+f*10}px"><path d="M35 145l20-80 70 15 15 65ZM180 145l10-70 65-15 30 85Z" fill="#a7be8c"/></g>`+arrows;
 case 'mountain':return `<path d="M20 170L110 ${150-f*110}l45 90 40-65 105 90Z" fill="#a3917b"/><path d="M${110-f*16} ${160-f*95}L110 ${150-f*110}l20 35Z" fill="#e7e9e6"/>`;
 case 'river':return `<path d="M15 150l60-100 65 90 50-70 100 85Z" fill="#a3917b"/><path class="earth-flow" d="M75 65q-15 35 45 50t0 55h140" fill="none" stroke="#7acfff" stroke-width="${3+f*5}" stroke-dasharray="12 4"/>`;
 case 'soil':return `<rect x="25" y="110" width="270" height="60" fill="#7d7a7c"/><rect x="25" y="${110-f*40}" width="270" height="${f*40}" fill="#967451"/>`;
 case 'green':return `<circle cx="55" cy="45" r="23" fill="#f5cc7e"/>`+plants(Math.round(1+f*7))+dots(Math.round(f*8));
 case 'plants':return plants(Math.round(1+f*10));
 default:return plants(Math.round(1+f*10))+`<path d="M20 180h280" stroke="${colour}" stroke-width="3"/>`;
 }
}
export function earthPayoffMarkup(id:string,graph:PayoffGraph,level:2|3){
 const s=earthPayoffState(id,graph,level),n=s.value===undefined?'Awaiting valid inputs':s.value.toPrecision(5);
 return `<section class="earth-payoff" data-payoff="${id}" data-level="${level}" data-state="${s.state}"><div class="payoff-scene-heading"><strong>${esc(s.animation.title)}</strong><span>${s.state==='success'?'★ Accepted':s.state==='fail'?'Needs adjustment':s.state==='live'?'Live preview':'Not connected'}</span></div><svg viewBox="0 0 320 200" role="img" aria-label="${esc(s.animation.title)}: ${s.state}">${diagram(s)}</svg><p role="status">${esc(s.verdict.reason)}</p><p>${s.preview?'Preview only · ':''}Result: <strong>${esc(n)}</strong> · Target ${s.min}–${s.max}</p><small>Before: ${esc(s.animation.before)}<br>After: ${esc(s.animation.after)}</small><div class="play-actions"><button data-earth-replay ${s.verdict.passed?'':'disabled'}>Replay payoff</button><button data-earth-skip>Skip animation</button></div></section>`;
}
export function setupEarthPayoffs(root:ParentNode=document,reference=false){
 root.querySelectorAll<HTMLElement>('.earth-payoff').forEach(element=>{
  const reduced=preference()||matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.classList.toggle('still',reduced);
  const key=element.dataset.payoff+':'+element.dataset.level;
  let seen:string[]=[];try{const data=JSON.parse(localStorage.getItem('creation-earth-payoffs-v1')||'[]');if(Array.isArray(data))seen=data.filter(x=>typeof x==='string')}catch{}
  let timer:ReturnType<typeof setTimeout>|undefined;
  const play=()=>{element.classList.toggle('still',reduced);element.classList.toggle('celebrating',!reduced);clearTimeout(timer);timer=setTimeout(()=>{element.classList.remove('celebrating');element.classList.add('still')},3000)};
  if(element.dataset.state==='success'&&!reference&&!seen.includes(key)){
   seen.push(key);try{localStorage.setItem('creation-earth-payoffs-v1',JSON.stringify(seen))}catch{}play();
  }
  element.querySelector<HTMLButtonElement>('[data-earth-replay]')!.onclick=play;
  element.querySelector<HTMLButtonElement>('[data-earth-skip]')!.onclick=()=>{clearTimeout(timer);element.classList.remove('celebrating');element.classList.add('still')};
 });
}
export function openEarthPayoffs(options:{day:number;level:2|3;initial:number;graph:(id:string)=>PayoffGraph;openGraph:(index:number)=>void}){
 if(document.querySelector('#earth-payoffs'))return;
 const items=earthAnimations.filter(x=>x.id.startsWith('d'+(options.day+1)+'-'));
 if(!items.length)return;
 const d=document.createElement('dialog');d.id='earth-payoffs';d.className='star-play-dialog';d.setAttribute('aria-labelledby','earth-payoff-heading');
 let index=Math.min(options.initial,items.length-1),reference=false;
 function render(){
  const item=items[index],g=reference?newEarthGraph(item.id,options.level):options.graph(item.id);
  if(reference)g.edges=[{from:'a',to:'calc',slot:0},{from:'b',to:'calc',slot:1},{from:'calc',to:'out',slot:0}];
  d.innerHTML=`<div class="help-heading"><h2 id="earth-payoff-heading">Day ${options.day+1} · Live payoffs</h2><button data-close aria-label="Close live payoffs">✕</button></div><label>Challenge<select id="earth-payoff-focus">${items.map((x,i)=>`<option value="${i}" ${i===index?'selected':''}>${i+1}. ${esc(x.title)}</option>`).join('')}</select></label><div class="play-preferences"><label><input id="earth-reduced" type="checkbox" ${preference()||matchMedia('(prefers-reduced-motion: reduce)').matches?'checked':''}> Reduced motion</label></div><p>${reference?'Reference preview only. Your graph and completion are unchanged.':'Your saved challenge graph. Success requires its actual validator to pass.'}</p>${earthPayoffMarkup(item.id,g,options.level)}<div class="play-actions"><button data-reference>${reference?'Show my graph':'Preview reference (sandbox)'}</button><button data-open>Open challenge graph</button></div><p class="help-note">Educational diagram prototypes. Budget ratios do not prove full-world stability. Animations never award completion. Sound is off.</p>`;
  setupEarthPayoffs(d,reference);
  d.querySelector<HTMLButtonElement>('[data-close]')!.onclick=()=>d.close();
  d.querySelector<HTMLSelectElement>('#earth-payoff-focus')!.onchange=e=>{index=Number((e.target as HTMLSelectElement).value);reference=false;render()};
  d.querySelector<HTMLInputElement>('#earth-reduced')!.onchange=e=>{try{localStorage.setItem('creation-play-motion',(e.target as HTMLInputElement).checked?'reduced':'full')}catch{}render()};
  d.querySelector<HTMLButtonElement>('[data-reference]')!.onclick=()=>{reference=!reference;render()};
  d.querySelector<HTMLButtonElement>('[data-open]')!.onclick=()=>{d.close();options.openGraph(index)};
 }
 d.addEventListener('close',()=>{d.remove();document.querySelector<HTMLButtonElement>('#open-earth-payoffs')?.focus()},{once:true});
 document.body.append(d);render();d.showModal();
}
