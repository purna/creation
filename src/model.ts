export type Kind='number'|'formula'|'output'|'group'|'group-input';
export type Node={id:string;kind:Kind;op:string;label:string;x:number;y:number;value?:number;unit?:string;group?:{nodes:Node[];edges:Edge[]}};
export type Edge={from:string;to:string;slot:number};
export type Stage={title:string;verse:string;mission:string;nodes:Node[];edges:Edge[];goal:string};
const n=(id:string,kind:Kind,op:string,label:string,x:number,y:number,value?:number,unit?:string):Node=>({id,kind,op,label,x,y,value,unit});
const make=(title:string,verse:string,mission:string,inputs:[string,string,number,string][],op:string,formula:string,goal:string):Stage=>{
 const nodes=[...inputs.map(([id,label,value,unit],i)=>n(id,'number','constant',label,30,35+i*128,value,unit)),n('calc','formula',op,formula,310,120),n('out','output','display','Universe output',605,135)];
 return {title,verse,mission,nodes,edges:[],goal};
};
export const stages:Stage[]=[
 make('Day 1 · Light','Genesis 1:3 — And God said, “Let there be light,” and there was light.','Mission: build a stable, self-sustaining star. The existing wavelength calculation is a starter exercise; fusion and stellar equilibrium are planned.',[['wavelength','Wavelength (nm)',550,'nm']],'frequency','Frequency = c / λ','Connect both formula and output to create light.'),
 make('Day 2 · Sky & Water','Genesis 1:6 — Let there be a vault between the waters to separate water from water.','Mission: establish a stable atmosphere and water cycle. The current water-phase calculation is a starter exercise; climate and hydrology models are planned.',[['temp','Temperature (°C)',20,'°C'],['pressure','Pressure (atm)',1,'atm']],'phase','Water phase model','Build a water phase predictor.'),
 make('Day 3 · Land','Genesis 1:9 — Let the water under the sky be gathered to one place, and let dry ground appear.','Mission: manage interior heat, tectonic plates, continents, rivers, soil and vegetation. The current gravity calculation is a starter exercise; coupled geology and ecology are planned.',[['mass','Mass (Earth masses)',1,'M⊕'],['radius','Radius (Earth radii)',1,'R⊕']],'gravity','g = GM / R²','Match Earth-like surface gravity.'),
 make('Day 4 · Heavenly bodies','Lights in the expanse','Build a Sun–Earth orbital speed calculator, then experiment with stellar mass and orbital distance.',[['star','Star mass (solar)',1,'M☉'],['distance','Orbit radius (AU)',1,'AU']],'orbit','v = √(GM/r)','Find an approximately 29.8 km/s Earth orbit.'),
 make('Day 5 · Life in sea & sky','Let living creatures fill the waters','Connect stellar luminosity and orbital distance to estimate received stellar flux.',[['luminosity','Luminosity (solar)',1,'L☉'],['distance','Distance (AU)',1,'AU']],'flux','F = 1361 L / r²','Aim for Earth-like stellar flux.'),
 make('Day 6 · Living world','Let the earth bring forth living creatures','Build a logistic population model using carrying capacity and growth rate.',[['capacity','Carrying capacity',1000,'organisms'],['rate','Growth rate',0.2,'1/step']],'population','ΔN = rN(1−N/K)','Build a population that grows without exceeding its capacity.')
];
export const arity:Record<string,number>={ 'star-gravity':2,'star-pressure':2,'star-core':3,'star-fusion':4,'star-hydro':2,'star-thermal':2,'star-stable':2,frequency:1,phase:2,gravity:2,orbit:2,flux:2,population:2,add:2,multiply:2,divide:2,sqrt:1,group:2};
export const symbols:Record<string,string>={ 'star-gravity':'g=274M/R²','star-pressure':'P=M²/R⁴','star-core':'Pgas=MT/(15.7R³)','star-fusion':'Lfusion=(M²/R³)(X/.7)²(T/15.7)⁴','star-hydro':'|Pgas-Pgrav|/Pgrav','star-thermal':'|Lfusion-L|/max(Lfusion,L)','star-stable':'max(hydro,thermal) < 0.04',frequency:'f = c / λ',phase:'phase(T, P)',gravity:'g = GM/R²',orbit:'v = √(GM/r)',flux:'F = 1361L/r²',population:'Nₜ₊₁ = Nₜ + rNₜ(1 − Nₜ/K)',add:'a + b',multiply:'a × b',divide:'a / b',sqrt:'√a',group:'Editable nested formula'};
export type Evaluation={values:Record<string,number>;errors:string[];result?:number};
export function evaluate(nodes:Node[],edges:Edge[]):Evaluation{
 const values:Record<string,number>={},errors:string[]=[],active=new Set<string>();
 const lookup=(id:string):number|undefined=>{
  if(id in values)return values[id];const node=nodes.find(n=>n.id===id);if(!node){errors.push('Missing node '+id);return undefined;}
  if(active.has(id)){errors.push('Cycle detected at '+node.label);return undefined;}active.add(id);
  if(node.kind==='number'){values[id]=Number(node.value)||0;active.delete(id);return values[id];}
  if(node.kind==='group-input'){errors.push('Group input only valid inside a group');active.delete(id);return undefined;}
  const required=node.kind==='output'?1:arity[node.op]??1;const args:number[]=[];
  for(let i=0;i<required;i++){const e=edges.find(e=>e.to===id&&e.slot===i);if(!e){errors.push(node.label+': connect input '+(i+1));active.delete(id);return undefined;}const v=lookup(e.from);if(v===undefined){active.delete(id);return undefined;}args.push(v);}
  let v=NaN;const [a,b]=args;
  if(node.kind==='group' && node.group){const internal=node.group;const innerValues:Record<string,number>={};const innerActive=new Set<string>();const inner=(id:string):number|undefined=>{if(id in innerValues)return innerValues[id];if(innerActive.has(id))throw Error('Cycle in group');innerActive.add(id);const n=internal.nodes.find(q=>q.id===id);if(!n)throw Error('Missing internal node');if(n.kind==='group-input'){const index=Number(n.op.replace('input',''));innerActive.delete(id);return args[index];}const count=n.kind==='output'?1:arity[n.op]??2;const ins:number[]=[];for(let k=0;k<count;k++){const e=internal.edges.find(e=>e.to===id&&e.slot===k);if(!e)throw Error('Unconnected internal input '+(k+1));const val=inner(e.from);if(val===undefined)throw Error('Missing internal value');ins.push(val);}const [x,y]=ins;let z=NaN;switch(n.op){case 'add':z=x+y;break;case 'multiply':z=x*y;break;case 'divide':z=x/y;break;case 'sqrt':z=Math.sqrt(x);break;case 'display':z=x;break;default:throw Error('Unsupported internal operation '+n.op);}if(!Number.isFinite(z))throw Error('Invalid group calculation');innerActive.delete(id);innerValues[id]=z;return z;};try{v=inner(internal.nodes.find(n=>n.kind==='output')?.id||'out')??NaN;}catch(e){errors.push(node.label+': '+String(e));active.delete(id);return undefined;}}else switch(node.op){case 'star-gravity':v=274*a/(b*b);break;case 'star-pressure':v=a*a/(b**4);break;case 'star-core':v=a*b/(args[2]**3*15.7);break;case 'star-fusion':v=a*a/(b**3)*(args[2]/.7)**2*(args[3]/15.7)**4;break;case 'star-hydro':v=Math.abs(b-a)/Math.max(Math.abs(a),1e-9);break;case 'star-thermal':v=Math.abs(a-b)/Math.max(Math.abs(a),Math.abs(b),1e-9);break;case 'star-stable':v=Math.max(a,b);break;case 'frequency':v=299792458/(a*1e-9)/1e12;break;case 'phase':v=a<0?0:a>100?2:1;break;case 'gravity':v=9.80665*a/(b*b);break;case 'orbit':v=29.7847*Math.sqrt(a/b);break;case 'flux':v=1361*a/(b*b);break;case 'population':{let p=30;for(let i=0;i<80;i++)p+=b*p*(1-p/a);v=p;break;}case 'add':v=a+b;break;case 'multiply':v=a*b;break;case 'divide':v=a/b;break;case 'sqrt':v=Math.sqrt(a);break;case 'display':v=a;break;}
  if(!Number.isFinite(v)){errors.push(node.label+': invalid inputs or division by zero');active.delete(id);return undefined;}
  values[id]=v;active.delete(id);return v;
 };
 const out=nodes.find(n=>n.kind==='output');const result=out?lookup(out.id):undefined;return {values,errors:[...new Set(errors)],result};
}
// Roadmap challenges are deliberately not auto-completed by the legacy single-formula output.
// A task becomes complete only when its own physical validator is implemented.
export const creationChallenges = [
  {
    "day": 0,
    "title": "Day 1 · Stable Star",
    "items": [
      {
        "id": "d1-1",
        "name": "Gather hydrogen fuel",
        "dependsOn": [],
        "status": "planned"
      },
      {
        "id": "d1-2",
        "name": "Calculate gravitational compression",
        "dependsOn": [
          "d1-1"
        ],
        "status": "planned"
      },
      {
        "id": "d1-3",
        "name": "Establish core pressure and temperature",
        "dependsOn": [
          "d1-2"
        ],
        "status": "planned"
      },
      {
        "id": "d1-4",
        "name": "Calculate fusion energy",
        "dependsOn": [
          "d1-3"
        ],
        "status": "planned"
      },
      {
        "id": "d1-5",
        "name": "Balance gravity and pressure",
        "dependsOn": [
          "d1-4"
        ],
        "status": "planned"
      },
      {
        "id": "d1-6",
        "name": "Balance energy generation and radiation",
        "dependsOn": [
          "d1-5"
        ],
        "status": "planned"
      },
      {
        "id": "d1-7",
        "name": "Pass a sustained stellar stability test",
        "dependsOn": [
          "d1-6"
        ],
        "status": "planned"
      }
    ]
  },
  {
    "day": 1,
    "title": "Day 2 · Sky and Water",
    "items": [
      {
        "id": "d2-1",
        "name": "Calculate planetary gravity",
        "dependsOn": [],
        "status": "planned"
      },
      {
        "id": "d2-2",
        "name": "Build an atmosphere",
        "dependsOn": [
          "d2-1"
        ],
        "status": "planned"
      },
      {
        "id": "d2-3",
        "name": "Calculate incoming stellar flux",
        "dependsOn": [
          "d2-2"
        ],
        "status": "planned"
      },
      {
        "id": "d2-4",
        "name": "Balance planetary temperature",
        "dependsOn": [
          "d2-3"
        ],
        "status": "planned"
      },
      {
        "id": "d2-5",
        "name": "Establish liquid water",
        "dependsOn": [
          "d2-4"
        ],
        "status": "planned"
      },
      {
        "id": "d2-6",
        "name": "Calculate evaporation",
        "dependsOn": [
          "d2-5"
        ],
        "status": "planned"
      },
      {
        "id": "d2-7",
        "name": "Form clouds and rainfall",
        "dependsOn": [
          "d2-6"
        ],
        "status": "planned"
      },
      {
        "id": "d2-8",
        "name": "Stabilise the water cycle",
        "dependsOn": [
          "d2-7"
        ],
        "status": "planned"
      }
    ]
  },
  {
    "day": 2,
    "title": "Day 3 · Tectonics, Land and Life",
    "items": [
      {
        "id": "d3-1",
        "name": "Calculate interior layers and masses",
        "dependsOn": [],
        "status": "planned"
      },
      {
        "id": "d3-2",
        "name": "Model internal heat production",
        "dependsOn": [
          "d3-1"
        ],
        "status": "planned"
      },
      {
        "id": "d3-3",
        "name": "Balance interior heat transport",
        "dependsOn": [
          "d3-2"
        ],
        "status": "planned"
      },
      {
        "id": "d3-4",
        "name": "Create tectonic plates",
        "dependsOn": [
          "d3-3"
        ],
        "status": "planned"
      },
      {
        "id": "d3-5",
        "name": "Calculate plate motion",
        "dependsOn": [
          "d3-4"
        ],
        "status": "planned"
      },
      {
        "id": "d3-6",
        "name": "Form continents and mountains",
        "dependsOn": [
          "d3-5"
        ],
        "status": "planned"
      },
      {
        "id": "d3-7",
        "name": "Conserve ocean water and sea level",
        "dependsOn": [
          "d3-6"
        ],
        "status": "planned"
      },
      {
        "id": "d3-8",
        "name": "Model rivers and drainage",
        "dependsOn": [
          "d3-7"
        ],
        "status": "planned"
      },
      {
        "id": "d3-9",
        "name": "Balance soil formation and erosion",
        "dependsOn": [
          "d3-8"
        ],
        "status": "planned"
      },
      {
        "id": "d3-10",
        "name": "Calculate photosynthesis",
        "dependsOn": [
          "d3-9"
        ],
        "status": "planned"
      },
      {
        "id": "d3-11",
        "name": "Grow sustainable vegetation",
        "dependsOn": [
          "d3-10"
        ],
        "status": "planned"
      },
      {
        "id": "d3-12",
        "name": "Pass geological and ecological stability tests",
        "dependsOn": [
          "d3-11"
        ],
        "status": "planned"
      }
    ]
  }
] as const;
