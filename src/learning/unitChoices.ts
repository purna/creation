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
// Each factor converts the displayed unit into the model's canonical unit.
const families: [string, [string,string,number][]][]=[
 ['kg',[['kg','Kilograms (kg)',1],['g','Grams (g)',.001],['tonnes','Tonnes',1000]]],
 ['mg',[['mg','Milligrams (mg)',1],['g','Grams (g)',1000]]],
 ['litres',[['litres','Litres (L)',1],['mL','Millilitres (mL)',.001],['m³','Cubic metres (m³)',1000]]],
 ['W/m²',[['W/m²','Watts per square metre (W/m²)',1],['kW/m²','Kilowatts per square metre (kW/m²)',1000]]],
 ['kJ',[['kJ','Kilojoules (kJ)',1],['J','Joules (J)',.001],['MJ','Megajoules (MJ)',1000]]],
 ['J',[['J','Joules (J)',1],['kJ','Kilojoules (kJ)',1000]]],
 ['N',[['N','Newtons (N)',1],['kN','Kilonewtons (kN)',1000]]],
 ['km²',[['km²','Square kilometres (km²)',1],['m²','Square metres (m²)',.000001],['ha','Hectares (ha)',.01]]],
 ['days',[['days','Days',1],['hours','Hours',1/24],['years','Years (365.25 days)',365.25]]],
 ['years',[['years','Years (365.25 days)',1],['days','Days',1/365.25]]],
 ['degrees',[['degrees','Degrees (°)',1],['rad','Radians',180/Math.PI]]],
 ['kg/day',[['kg/day','Kilograms per day',1],['tonnes/day','Tonnes per day',1000]]],
 ['MJ/day',[['MJ/day','Megajoules per day',1],['kJ/day','Kilojoules per day',.001]]],
 ['m³/day',[['m³/day','Cubic metres per day',1],['L/day','Litres per day',.001]]],
 ['MWh/day',[['MWh/day','Megawatt-hours per day',1],['kWh/day','Kilowatt-hours per day',.001]]],
 ['tonnes/day',[['tonnes/day','Tonnes per day',1],['kg/day','Kilograms per day',.001]]],
 ['tonnes/year',[['tonnes/year','Tonnes per year',1],['kg/year','Kilograms per year',.001]]],
 ['W',[['W','Watts (W)',1],['kW','Kilowatts (kW)',1000]]],
 ['km',[['km','Kilometres (km)',1],['m','Metres (m)',.001]]],
 ['m/s²',[['m/s²','Metres per second squared (m/s²)',1]]],
 ['km/s',[['km/s','Kilometres per second (km/s)',1],['m/s','Metres per second (m/s)',.001]]],
 ['TW',[['TW','Terawatts (TW)',1],['W','Watts (W)',1e-12]]],
 ['cm/year',[['cm/year','Centimetres per year',1],['mm/year','Millimetres per year',.1]]],
 ['km³',[['km³','Cubic kilometres (km³)',1],['m³','Cubic metres (m³)',1e-9]]],
 ['mm/year',[['mm/year','Millimetres per year',1],['cm/year','Centimetres per year',10]]],
 ['cm',[['cm','Centimetres (cm)',1],['m','Metres (m)',100]]],
 ['hours',[['hours','Hours',1],['days','Days',24]]],
 ['mg/L',[['mg/L','Milligrams per litre (mg/L)',1]]],
 ['dimensionless',[['dimensionless','Unitless (dimensionless)',1]]],
 ['count',[['count','Count',1]]],
 ['ratio',[['ratio','Ratio',1],['%','Percent (%)',.01]]]
];
for(const [unit,options] of families)UNIT_CHOICES[unit]=options.map(([unit,label,factor])=>({unit,label,factor}));
export function toCanonical(value:number,option:UnitOption){return value*option.factor+(option.offset||0)}
export function fromCanonical(value:number,option:UnitOption){return (value-(option.offset||0))/option.factor}
export function formatUnitValue(value:number){return Number(value.toPrecision(9)).toString()}

/** Older challenge inputs may describe their fraction in the label without unit metadata. */
export function canonicalNodeUnit(node:{unit?:string;label:string}){
 if(node.unit)return node.unit;
 const embedded=node.label.match(/\(([^)]+)\)\s*$/)?.[1];
 const aliases:Record<string,string>={'Earth masses':'M⊕','Earth radii':'R⊕','solar masses':'M☉','Earth days':'days','relative to current':'dimensionless'};
 if(embedded&&(UNIT_CHOICES[embedded]||aliases[embedded]))return aliases[embedded]||embedded;
 if(/fraction|transmitted|efficiency/i.test(node.label))return 'fraction';
 if(/population|carrying capacity|sustainable capacity/i.test(node.label))return 'organisms';
 if(/planets|checks|species|recruits|losses/i.test(node.label))return 'count';
 return 'dimensionless';
}
export function nodeUnitOptions(node:{unit?:string;label:string}):UnitOption[]{
 const unit=canonicalNodeUnit(node);
 return UNIT_CHOICES[unit]||[{unit,label:unit==='dimensionless'?'Unitless (dimensionless)':unit,factor:1}];
}
