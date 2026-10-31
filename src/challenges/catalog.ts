export type Level=2|3;
export async function loadChallenge(day:number,level:Level,id:string){if(!/^d[1-6]-[0-9]+$/.test(id)||day<1||day>6||![2,3].includes(level))throw Error('Invalid challenge');const r=await fetch(import.meta.env.BASE_URL+'challenges/day-'+day+'/level-'+level+'/'+id+'.json');if(!r.ok)throw Error('Missing challenge '+id);const data=await r.json();if(data.day!==day||data.level!==level||data.id!==id)throw Error('Mismatched challenge');return data}
export async function loadManifest(){const r=await fetch(import.meta.env.BASE_URL+'challenges/manifest.json');if(!r.ok)throw Error('Missing manifest');return r.json()}
export async function loadEnglish(){const r=await fetch(import.meta.env.BASE_URL+'i18n/en.json');if(!r.ok)throw Error('Missing language pack');return r.json()}
export type ScoreParts={feasibility:number;stability:number;efficiency:number;resilience:number};
export function scoreAttempt(x:ScoreParts){const c=(n:number)=>Number.isFinite(n)?Math.min(100,Math.max(0,n)):0;return Math.round(.35*c(x.feasibility)+.30*c(x.stability)+.20*c(x.efficiency)+.15*c(x.resilience))}
export function bestValidAttempt<T extends {score:number;valid:boolean}>(attempts:T[]):T|null{return attempts.filter(a=>a.valid).sort((a,b)=>b.score-a.score)[0]??null}
