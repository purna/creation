import {PLANETS,makeSolarSystem,advance,energy,type Body,type PlanetConfig} from './orbits';
export type Challenge={id:string;title:string;description:string;duration:number;maxRadialDrift:number;maxEnergyDrift:number;target?:string};
export const challenges:Challenge[]=[
 {id:'inner',title:'Keep Earth in orbit',description:'Run for 0.5 years with Earth remaining within 15% of its initial orbital distance.',duration:.5,maxRadialDrift:.15,maxEnergyDrift:.005,target:'Earth'},
 {id:'eight',title:'Eight-planet system',description:'Keep all eight planets bound and within 20% of their initial solar distance for 2 simulated years.',duration:2,maxRadialDrift:.2,maxEnergyDrift:.005},
 {id:'precision',title:'Precision universe',description:'Keep all eight planets within 10% of their initial distances for 5 years with less than 0.1% numerical energy drift.',duration:5,maxRadialDrift:.1,maxEnergyDrift:.001}
];
const storageKey='before-adam-orbits-v08';
export class OrbitalLab{
 config:PlanetConfig[]=PLANETS.map(p=>({...p}));starMass=1;moon=true;bodies:Body[]=[];years=0;initialEnergy=0;maxRadialDrift=0;maxEnergyDrift=0;collisions=false;speed=2;trails:Record<string,{x:number;y:number}[]>={};best:Record<string,boolean>={};
 constructor(){try{const s=JSON.parse(localStorage.getItem(storageKey)||'{}');if(Array.isArray(s.config)&&s.config.length===8&&s.config.every((p:PlanetConfig)=>PLANETS.some(q=>q.name===p.name))){this.config=s.config.map((p:PlanetConfig)=>({...p,mass:Number(p.mass),radiusAU:Number(p.radiusAU),phaseDeg:Number(p.phaseDeg),speedFactor:Number(p.speedFactor)}));}if(Number.isFinite(s.starMass))this.starMass=s.starMass;if(typeof s.moon==='boolean')this.moon=s.moon;if(s.best&&typeof s.best==='object')this.best=s.best;}catch{}this.reset();}
 save(){localStorage.setItem(storageKey,JSON.stringify({config:this.config,starMass:this.starMass,moon:this.moon,best:this.best}));}
 reset(){this.bodies=makeSolarSystem(this.config,this.starMass,this.moon);this.years=0;this.initialEnergy=energy(this.bodies);this.maxRadialDrift=0;this.maxEnergyDrift=0;this.collisions=false;this.trails={};this.save();}
 step(){// Fixed one-hour-ish leapfrog steps; simulation speed only changes the number of steps.
  const dt=1/365.25/24;for(let k=0;k<this.speed*32;k++){
   advance(this.bodies,dt);this.years+=dt;
   const sun=this.bodies[0];for(const p of this.config){const b=this.bodies.find(b=>b.name===p.name)!;const r=Math.hypot(b.x-sun.x,b.y-sun.y),relative=Math.abs(r-p.radiusAU)/p.radiusAU;this.maxRadialDrift=Math.max(this.maxRadialDrift,relative);if(r<.005||r>100)this.collisions=true;}
   const e=Math.abs((energy(this.bodies)-this.initialEnergy)/(this.initialEnergy||1));this.maxEnergyDrift=Math.max(this.maxEnergyDrift,e);
  }
  for(const b of this.bodies){if(b.name==='Moon')continue;const t=this.trails[b.name]??=[];t.push({x:b.x,y:b.y});if(t.length>350)t.shift();}
  for(const c of challenges){if(this.status(c)==='passed')this.best[c.id]=true;}
 }
 status(c:Challenge):'running'|'passed'|'failed'{const drift=c.target?this.radialDrift(c.target):this.maxRadialDrift;if(this.collisions||drift>c.maxRadialDrift||this.maxEnergyDrift>c.maxEnergyDrift)return 'failed';return this.years>=c.duration?'passed':'running';}
 radialDrift(name:string){const b=this.bodies.find(b=>b.name===name),p=this.config.find(p=>p.name===name),s=this.bodies[0];return b&&p?Math.abs(Math.hypot(b.x-s.x,b.y-s.y)-p.radiusAU)/p.radiusAU:1;}
 update(name:string,key:keyof Pick<PlanetConfig,'mass'|'radiusAU'|'phaseDeg'|'speedFactor'>,value:number){const p=this.config.find(p=>p.name===name);if(!p||!Number.isFinite(value))return;const bounds={mass:[1e-9,.02],radiusAU:[.1,60],phaseDeg:[0,360],speedFactor:[.2,2]};const [lo,hi]=bounds[key];p[key]=Math.max(lo,Math.min(hi,value));this.reset();}
 restore(){this.config=PLANETS.map(p=>({...p}));this.starMass=1;this.moon=true;this.reset();}
}