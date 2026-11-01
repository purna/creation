type Criterion={id:string;required:boolean;levels?:number[];description:string};
type ExampleFile={id:string;day:number;criteria:Criterion[];minimumRequired:{level2:number;level3:number};examples:{name:string;inputs:Record<string,number>}[]};
const files=import.meta.glob('../data/examples/*.json',{eager:true,import:'default'}) as Record<string,ExampleFile>;
const registry=new Map<string,ExampleFile>(Object.values(files).map(file=>[file.id,file]));
export function challengeExample(id:string){return registry.get(id);}
export function challengeCriteria(id:string,level:2|3,results:Record<string,boolean>){
 const spec=registry.get(id);
 if(!spec)return {passed:false,reason:'Challenge criteria JSON missing',passedCount:0,requiredCount:0};
 const required=spec.criteria.filter(c=>c.required&&(!c.levels||c.levels.includes(level)));
 const passedCount=required.filter(c=>results[c.id]===true).length;
 const requiredCount=level===2?spec.minimumRequired.level2:spec.minimumRequired.level3;
 return {passed:required.length===requiredCount&&passedCount===requiredCount,passedCount,requiredCount,reason:passedCount+'/'+requiredCount+' required criteria passed'};
}
