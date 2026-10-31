import type {Graph} from './engine';
import {graphStarInput} from '../simulations/starGraph';
export type WorldMetrics={stellarLuminosity:number;stellarMass:number;orbitalAU:number;stellarFlux:number;equilibriumC:number;surfaceC:number;liquidWaterSuitability:number;surfaceGravity:number;photosynthesisPotential:number;carryingCapacityFactor:number;warnings:string[]};
const positive=(v:number|undefined,f:number)=>typeof v==='number'&&Number.isFinite(v)&&v>0?v:f;
const val=(g:Graph|undefined,id:string,f:number)=>positive(g?.nodes.find(n=>n.id===id&&n.kind==='number')?.value,f);
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export function deriveWorld(graphs:Partial<Record<number,Graph>>):WorldMetrics{
 const star=graphs[1]?graphStarInput(graphs[1]!.nodes):null;
 const stellarMass=positive(star?.mass,1),stellarLuminosity=positive(star?.luminosity,1),orbitalAU=val(graphs[4],'distance',1);
 const stellarFlux=1361*stellarLuminosity/(orbitalAU**2);
 // Grey-body equilibrium, fixed Earth-like albedo 0.3, with a simplified +33 C greenhouse offset.
 const equilibriumC=Math.pow(stellarFlux*.7/(4*5.670374419e-8),.25)-273.15,surfaceC=equilibriumC+33;
 const waterTemp=graphs[2]?.nodes.find(n=>n.id==='temp'&&n.kind==='number')?.value??surfaceC,pressure=val(graphs[2],'pressure',1);
 const liquidWaterSuitability=clamp((waterTemp+5)/15)*clamp((105-waterTemp)/15)*clamp(pressure/.5)*Math.exp(-Math.abs(waterTemp-surfaceC)/18);
 const surfaceGravity=9.81*val(graphs[3],'mass',1)/val(graphs[3],'radius',1)**2;
 const gravitySuitability=Math.exp(-Math.abs(Math.log(Math.max(.01,surfaceGravity/9.81)))*1.5);
 const photosynthesisPotential=clamp(stellarFlux/1361)*liquidWaterSuitability,carryingCapacityFactor=clamp(photosynthesisPotential*gravitySuitability);
 const warnings:string[]=[];
 if(!graphs[1])warnings.push('Day 1 missing: solar reference used');
 if(!graphs[4])warnings.push('Day 4 missing: 1 AU reference used');
 if(Math.abs(waterTemp-surfaceC)>12)warnings.push('Day 2 water temperature differs from radiative climate');
 if(stellarFlux<500||stellarFlux>2400)warnings.push('Stellar flux outside simplified habitable range');
 if(carryingCapacityFactor<.5)warnings.push('Downstream biological carrying capacity is constrained');
 return {stellarLuminosity,stellarMass,orbitalAU,stellarFlux,equilibriumC,surfaceC,liquidWaterSuitability,surfaceGravity,photosynthesisPotential,carryingCapacityFactor,warnings};
}
export function worldScore(m:WorldMetrics){const c=(v:number)=>Math.max(0,Math.min(100,v));return {feasibility:c(m.liquidWaterSuitability*100),stability:c(Math.exp(-Math.abs(m.surfaceC-15)/25)*100),efficiency:c(m.photosynthesisPotential*100),resilience:c(m.carryingCapacityFactor*100)}}
export function effectivePopulationCapacity(raw:number,m:WorldMetrics){return Math.max(0,raw)*m.carryingCapacityFactor}
