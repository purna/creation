import type {Node,Edge} from '../model';
import {STAR_FORMULAS} from './starGraph';
export type GuideStep={id:string;title:string;formula:string;explanation:string;example:string;inputs:{id:string;unit:string}[]};
const units:Record<string,string>={mass:'M☉',radius:'R☉',hydrogen:'fraction',coreMK:'MK',luminosity:'L☉',gravity:'m/s²',pressure:'relative pressure',core:'relative pressure',fusion:'L☉',hydro:'dimensionless',thermal:'dimensionless',stable:'dimensionless'};
const info:Record<string,[string,string,string]>={
 gravity:['Surface gravity','Gravity increases with stellar mass and decreases with the square of radius. The constant 274 m/s² is the Sun’s approximate surface gravity.','At M=1 and R=1, g=274 m/s².'],
 pressure:['Gravitational compression','A solar-normalized proxy for the inward compression of a star: P ∝ M²/R⁴. It is not an absolute pressure in pascals.','At M=1 and R=1, compression proxy = 1.'],
 core:['Core gas pressure','The hot core pushes outward. This solar-calibrated ideal-gas proxy is proportional to mass and core temperature and inversely proportional to radius cubed.','At M=1, T=15.7 MK, R=1, gas-pressure proxy = 1.'],
 fusion:['Nuclear fusion','Hydrogen fusion depends on fuel fraction, density and core temperature. The temperature-to-the-fourth dependence is a simplified classroom approximation, not a complete stellar reaction network.','At M=R=L=1, X=0.70 and T=15.7 MK, fusion proxy = 1 L☉.'],
 hydro:['Hydrostatic equilibrium','Compare inward gravitational compression and outward gas pressure. A small relative difference indicates approximate hydrostatic balance.','At both pressure proxies = 1, residual = 0.'],
 thermal:['Thermal equilibrium','Compare nuclear fusion energy production with radiated luminosity. A small relative difference means the energy budget is approximately balanced.','At fusion=1 L☉ and radiation=1 L☉, residual = 0.'],
 stable:['Stable star','Combine the two residuals. The physics validator also checks bounded behaviour over 240 numerical steps; the graph output alone does not prove long-term stability.','At hydrostatic=0 and thermal=0, graph residual = 0.']
};
export const guideSteps:GuideStep[]=[...STAR_FORMULAS.map(f=>({id:f.id,title:info[f.id][0],formula:f.label,explanation:info[f.id][1],example:info[f.id][2],inputs:f.inputs.map(id=>({id,unit:units[id]||'unknown'}))})),{id:'out',title:'Final stellar output',formula:'Stable residual → output',explanation:'Connect the stability node to the final output to make your star measurable. All seven physics challenges must also pass.',example:'Connect stable OUT to the final output input.',inputs:[{id:'stable',unit:'dimensionless'}]}];
export function unitOf(id:string):string{return units[id]||'unknown'}
export function connectionFeedback(nodes:Node[],edges:Edge[],from:string,to:string,slot:number):{ok:boolean;message:string}{
 const source=nodes.find(n=>n.id===from),target=nodes.find(n=>n.id===to);
 if(!source||!target)return {ok:false,message:'The selected node no longer exists.'};
 if(source.kind==='output')return {ok:false,message:'An output node cannot feed another node.'};
 if(to===from)return {ok:false,message:'A node cannot connect to itself.'};
 const step=guideSteps.find(s=>s.id===to);
 if(step){const expected=step.inputs[slot];if(!expected)return {ok:false,message:'That formula has no input in this position.'};
  if(expected.id!==from)return {ok:false,message:`Incorrect connection. Input ${slot+1} of ${step.title} needs ${expected.id} (${expected.unit}), not ${source.label} (${unitOf(from)}).`};
  const actualUnit=source.unit||unitOf(from);
  if(actualUnit!==expected.unit)return {ok:false,message:`Unit mismatch: ${source.label} uses ${actualUnit}, but this input requires ${expected.unit}. Check the source node units.`};
 }
 const next=edges.filter(e=>!(e.to===to&&e.slot===slot)).concat({from,to,slot});
 const visiting=new Set<string>(),visited=new Set<string>();
 function cycle(id:string):boolean{if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const e of next.filter(e=>e.to===id)){if(cycle(e.from))return true}visiting.delete(id);visited.add(id);return false}
 if(nodes.some(n=>cycle(n.id)))return {ok:false,message:'This wire would create a circular calculation. Connect upstream inputs to downstream formulas.'};
 return {ok:true,message:`Connected ${source.label} → ${target.label} input ${slot+1} (${unitOf(from)}).`};
}
export function nextGuideStep(edges:Edge[]):number{
 for(let i=0;i<guideSteps.length;i++){const step=guideSteps[i];if(step.inputs.some((p,slot)=>!edges.some(e=>e.from===p.id&&e.to===step.id&&e.slot===slot)))return i}
 return guideSteps.length-1;
}
