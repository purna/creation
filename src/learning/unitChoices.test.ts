import {describe,it,expect} from 'vitest';import {UNIT_CHOICES,canonicalNodeUnit,nodeUnitOptions,toCanonical,fromCanonical} from './unitChoices';
describe('unit selector',()=>{it('converts solar mass to kilograms and back',()=>{const kg=UNIT_CHOICES['M☉'][1];expect(fromCanonical(1,kg)).toBeCloseTo(1.98847e30,0);expect(toCanonical(1.98847e30,kg)).toBeCloseTo(1)});it('converts temperatures without changing physics input',()=>{const k=UNIT_CHOICES['°C'][1];expect(fromCanonical(20,k)).toBeCloseTo(293.15);expect(toCanonical(293.15,k)).toBeCloseTo(20);const f=UNIT_CHOICES['°C'][2];expect(fromCanonical(0,f)).toBeCloseTo(32);expect(toCanonical(32,f)).toBeCloseTo(0)});it('converts fractions to percent',()=>expect(fromCanonical(.7,UNIT_CHOICES.fraction[1])).toBe(70))});

describe('node unit choices',()=>{
 it('offers fraction and percent for a legacy transmitted fraction',()=>{
  const n={label:'Fraction transmitted'};
  expect(canonicalNodeUnit(n)).toBe('fraction');
  const options=nodeUnitOptions(n);
  expect(options.map(x=>x.unit)).toEqual(['fraction','%']);
  expect(fromCanonical(.2,options[1])).toBe(20);
  expect(toCanonical(20,options[1])).toBe(.2);
 });
 it('keeps explicitly declared units ahead of label inference',()=>{
  expect(canonicalNodeUnit({label:'Efficiency proxy',unit:'W'})).toBe('W');
 });
 it('shows a unitless choice instead of an empty text field',()=>{
  expect(nodeUnitOptions({label:'Input A'})).toEqual([{unit:'dimensionless',label:'Unitless (dimensionless)',factor:1}]);
 });
 it('retains a declared unit without inventing incompatible alternatives',()=>{
  expect(nodeUnitOptions({label:'Energy',unit:'kJ'}).map(x=>x.unit)).toEqual(['kJ','J','MJ']);
 });
});

describe('unit catalogue audit',()=>{
 for(const [canonical,choices] of Object.entries(UNIT_CHOICES)){
  it(canonical+' has a canonical first choice and reversible conversions',()=>{
   expect(choices[0].unit).toBe(canonical);
   expect(choices[0].factor).toBe(1);
   expect(new Set(choices.map(x=>x.unit)).size).toBe(choices.length);
   for(const option of choices){
    expect(option.label.trim()).not.toBe('');
    expect(option.factor).toBeGreaterThan(0);
    expect(toCanonical(fromCanonical(12.5,option),option)).toBeCloseTo(12.5,8);
   }
  });
 }
 it.each([
  ['Surface light (W/m²)','W/m²'],['Orbit radius (AU)','AU'],
  ['Planet mass (Earth masses)','M⊕'],['Planet radius (Earth radii)','R⊕'],
  ['Year length (days)','days'],['Planet year (days)','days'],
  ['Axial tilt (degrees)','degrees'],['Water volume (litres)','litres'],
  ['Freshwater demand (m³/day)','m³/day'],['Treatment capacity (tonnes/day)','tonnes/day']
 ])('recognises the physical unit in %s',(label,unit)=>expect(canonicalNodeUnit({label})).toBe(unit));
 it('converts area and volume correctly',()=>{
  expect(fromCanonical(1,UNIT_CHOICES['km²'][1])).toBe(1e6);
  expect(toCanonical(1000,UNIT_CHOICES.litres[1])).toBe(1);
 });
});
