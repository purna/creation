// Planar Newtonian N-body gravity. Units: AU, years, solar masses.
export type Body={name:string,mass:number,x:number,y:number,vx:number,vy:number,color:string,radius:number};
export type PlanetConfig={name:string;mass:number;radiusAU:number;phaseDeg:number;speedFactor:number;color:string};
export const G=4*Math.PI*Math.PI;
export const PLANETS:PlanetConfig[]=[
 {name:'Mercury',mass:1.660e-7,radiusAU:.3871,phaseDeg:35,speedFactor:1,color:'#b7aaa0'},
 {name:'Venus',mass:2.447e-6,radiusAU:.7233,phaseDeg:120,speedFactor:1,color:'#e6c28c'},
 {name:'Earth',mass:3.003e-6,radiusAU:1,phaseDeg:210,speedFactor:1,color:'#65b7ff'},
 {name:'Mars',mass:3.227e-7,radiusAU:1.5237,phaseDeg:280,speedFactor:1,color:'#ed8b6a'},
 {name:'Jupiter',mass:.0009543,radiusAU:5.2044,phaseDeg:75,speedFactor:1,color:'#e5b48e'},
 {name:'Saturn',mass:.0002857,radiusAU:9.5826,phaseDeg:165,speedFactor:1,color:'#d9c68b'},
 {name:'Uranus',mass:.00004365,radiusAU:19.2184,phaseDeg:250,speedFactor:1,color:'#8fdde0'},
 {name:'Neptune',mass:.00005149,radiusAU:30.11,phaseDeg:325,speedFactor:1,color:'#658dff'}
];
export function initialSystem(starMass=1,earthAU=1,moon=true):Body[]{return makeSolarSystem(PLANETS.filter(p=>p.name==='Earth').map(p=>({...p,radiusAU:earthAU,phaseDeg:0})),starMass,moon);}
export function makeSolarSystem(config:PlanetConfig[],starMass=1,moon=true):Body[]{
 const s=Math.max(.05,starMass);const bodies:Body[]=[{name:'Sun',mass:s,x:0,y:0,vx:0,vy:0,color:'#ffc76e',radius:13}];
 for(const p of config){const r=Math.max(.05,p.radiusAU),a=p.phaseDeg*Math.PI/180,v=Math.sqrt(G*s/r)*p.speedFactor;
  bodies.push({name:p.name,mass:Math.max(1e-12,p.mass),x:r*Math.cos(a),y:r*Math.sin(a),vx:-v*Math.sin(a),vy:v*Math.cos(a),color:p.color,radius:p.name==='Jupiter'?7:5});}
 const earth=bodies.find(b=>b.name==='Earth');if(moon&&earth){const a=.00257,v=Math.sqrt(G*earth.mass/a),len=Math.hypot(earth.x,earth.y),ux=earth.x/len,uy=earth.y/len;
  bodies.push({name:'Moon',mass:3.694e-8,x:earth.x+a*ux,y:earth.y+a*uy,vx:earth.vx-v*uy,vy:earth.vy+v*ux,color:'#d8dce5',radius:3});}
 const total=bodies.reduce((a,b)=>a+b.mass,0),px=bodies.reduce((a,b)=>a+b.mass*b.vx,0),py=bodies.reduce((a,b)=>a+b.mass*b.vy,0);
 for(const b of bodies){b.vx-=px/total;b.vy-=py/total;}return bodies;
}
function acceleration(bodies:Body[]){const acc=bodies.map(()=>({x:0,y:0}));for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const dx=bodies[j].x-bodies[i].x,dy=bodies[j].y-bodies[i].y,d2=dx*dx+dy*dy,dist=Math.sqrt(d2),factor=G/(d2*dist+1e-15);acc[i].x+=factor*bodies[j].mass*dx;acc[i].y+=factor*bodies[j].mass*dy;acc[j].x-=factor*bodies[i].mass*dx;acc[j].y-=factor*bodies[i].mass*dy;}return acc;}
export function advance(bodies:Body[],dt:number){const a=acceleration(bodies);for(let i=0;i<bodies.length;i++){const b=bodies[i];b.x+=b.vx*dt+.5*a[i].x*dt*dt;b.y+=b.vy*dt+.5*a[i].y*dt*dt;}const a2=acceleration(bodies);for(let i=0;i<bodies.length;i++){bodies[i].vx+=(a[i].x+a2[i].x)*dt*.5;bodies[i].vy+=(a[i].y+a2[i].y)*dt*.5;}}
export function energy(bodies:Body[]){let e=0;for(const b of bodies)e+=.5*b.mass*(b.vx*b.vx+b.vy*b.vy);for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){e-=G*bodies[i].mass*bodies[j].mass/Math.hypot(bodies[i].x-bodies[j].x,bodies[i].y-bodies[j].y);}return e;}