export type UnitOption={unit:string;label:string;factor:number;offset?:number};
export const UNIT_CHOICES:Record<string,UnitOption[]>={
'M☉':[{unit:'M☉',label:'Solar masses (M☉)',factor:1},{unit:'kg',label:'Kilograms (kg)',factor:1/1.98847e30},{unit:'M⊕',label:'Earth masses (M⊕)',factor:5.9722e24/1.98847e30}],
'R☉':[{unit:'R☉',label:'Solar radii (R☉)',factor:1},{unit:'km',label:'Kilometres (km)',factor:1/695700},{unit:'R⊕',label:'Earth radii (R⊕)',factor:6371/695700}],
'M⊕':[{unit:'M⊕',label:'Earth masses (M⊕)',factor:1},{unit:'kg',label:'Kilograms (kg)',factor:1/5.9722e24}],
'R⊕':[{unit:'R⊕',label:'Earth radii (R⊕)',factor:1},{unit:'km',label:'Kilometres (km)',factor:1/6371}],
'L☉':[{unit:'L☉',label:'Solar luminosities (L☉)',factor:1},{unit:'W',label:'Watts (W)',factor:1/3.828e26}],
'MK':[{unit:'MK',label:'Million kelvin (MK)',factor:1},{unit:'K',label:'Kelvin (K)',factor:1e-6}],
'°C':[{unit:'°C',label:'Celsius (°C)',factor:1},{unit:'K',label:'Kelvin (K)',factor:1,offset:-273.15},{unit:'°F',label:'Fahrenheit (°F)',factor:5/9,offset:-160/9}],
'atm':[{unit:'atm',label:'Atmospheres (atm)',factor:1},{unit:'Pa',label:'Pascals (Pa)',factor:1/101325},{unit:'kPa',label:'Kilopascals (kPa)',factor:1/101.325}],
'AU':[{unit:'AU',label:'Astronomical units (AU)',factor:1},{unit:'km',label:'Kilometres (km)',factor:1/149597870.7}],
'nm':[{unit:'nm',label:'Nanometres (nm)',factor:1},{unit:'m',label:'Metres (m)',factor:1e9}],
'fraction':[{unit:'fraction',label:'Fraction (0–1)',factor:1},{unit:'%',label:'Percent (%)',factor:0.01}],
'1/step':[{unit:'1/step',label:'Per step',factor:1}],
'organisms':[{unit:'organisms',label:'Organisms',factor:1}]
};
export function toCanonical(value:number,option:UnitOption){return value*option.factor+(option.offset||0)}
export function fromCanonical(value:number,option:UnitOption){return (value-(option.offset||0))/option.factor}
export function formatUnitValue(value:number){return Number(value.toPrecision(9)).toString()}
