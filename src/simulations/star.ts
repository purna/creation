/** Simplified one-zone, solar-calibrated star for classroom exploration.
 * Units: solar mass/radius/luminosity; hydrogen fraction X; Kelvin core temperature.
 * Hydrostatic and radiative checks are dimensionless residuals, not a stellar evolution code.
 */
export type StarInput={mass:number;radius:number;hydrogen:number;coreMK:number;luminosity:number};
export type StarResult={checks:{id:string;passed:boolean;detail:string}[];stable:boolean;gravity:number;pressure:number;fusion:number;thermalResidual:number;hydroResidual:number;trajectory:number[]};
export const defaultStar:StarInput={mass:1,radius:1,hydrogen:.70,coreMK:15.7,luminosity:1};
export const STAR_SOLVER='star-one-zone-1';
export function validateStar(p:StarInput):StarResult{
 const finite=Object.values(p).every(Number.isFinite);
 const m=Math.max(.01,p.mass),r=Math.max(.05,p.radius),x=Math.max(0,p.hydrogen),T=Math.max(.1,p.coreMK),L=Math.max(.00001,p.luminosity);
 const gravity=274*m/(r*r); // m/s² at surface
 const pressure=(m*m)/(r**4); // solar-calibrated central pressure proxy
 const idealPressure=(m*T)/(r**3*15.7); // ideal gas pressure proxy
 const hydroResidual=Math.abs(idealPressure-pressure)/Math.max(pressure,1e-9);
 // PP-chain rate is strongly temperature-sensitive, with fuel and density dependence.
 const fusion=(m*m/(r**3))*((x/.70)**2)*((T/15.7)**4);
 const thermalResidual=Math.abs(fusion-L)/Math.max(fusion,L,1e-9);
 // Bounded feedback model: radius responds to pressure imbalance and temperature to heat imbalance.
 let radius=r,temp=T;const trajectory:number[]=[];let bounded=true;
 for(let i=0;i<240;i++){const hydro=(m*temp/(radius**3*15.7))-(m*m/(radius**4));const heat=(m*m/(radius**3))*((x/.70)**2)*((temp/15.7)**4)-L;
  radius+=Math.max(-.005,Math.min(.005,hydro*.0005));
  temp+=Math.max(-.025,Math.min(.025,heat*.0005));
  if(!Number.isFinite(radius)||!Number.isFinite(temp)||radius<.2||radius>4||temp<2||temp>60){bounded=false;break;}
  if(i%20===0)trajectory.push(radius);
 }
 const check=(id:string,passed:boolean,detail:string)=>({id,passed:finite&&passed,detail});
 const checks=[
 check('d1-1',m>=.08&&m<=3&&x>=.5&&x<=.8,`Mass ${m.toFixed(2)} M☉; hydrogen ${(x*100).toFixed(1)}%`),
 check('d1-2',gravity>30&&gravity<3000,`Surface gravity ${gravity.toFixed(1)} m/s²`),
 check('d1-3',T>=8&&T<=30&&pressure>.02&&pressure<80,`Core ${T.toFixed(2)} million K; pressure proxy ${pressure.toFixed(3)}`),
 check('d1-4',fusion>.03&&fusion<50,`Relative fusion power ${fusion.toFixed(3)} L☉ (solar-calibrated proxy)`),
 check('d1-5',hydroResidual<.08,`Hydrostatic residual ${(hydroResidual*100).toFixed(2)}%`),
 check('d1-6',thermalResidual<.08,`Thermal residual ${(thermalResidual*100).toFixed(2)}%`),
 check('d1-7',bounded&&hydroResidual<.04&&thermalResidual<.04,`240 numerical steps; bounded: ${bounded?'yes':'no'}; hydro ${(hydroResidual*100).toFixed(2)}%, thermal ${(thermalResidual*100).toFixed(2)}%`)
 ];
 return {checks,stable:checks.every(c=>c.passed),gravity,pressure,fusion,thermalResidual,hydroResidual,trajectory};
}
