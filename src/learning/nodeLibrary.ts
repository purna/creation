import type {Node} from '../model';
export type NodeExample={name:string;value:string;explanation:string};
export type NodeLesson={title:string;meaning:string;unit:string;examples:NodeExample[];experiment:string;modelLimitations:string};
export type NodeLibrary={schemaVersion:number;locale:string;lookup:Record<string,Record<string,string>>;nodes:Record<string,NodeLesson>;ui?:Record<string,string>};
export function resolveNodeLesson(library:NodeLibrary|null,dayIndex:number,node:Pick<Node,'id'|'op'>):NodeLesson|null{
 if(!library)return null;
 const mapped=library.lookup['day-'+(dayIndex+1)]?.[node.id];
 return library.nodes[mapped||node.id]||library.nodes[node.op]||null;
}
export async function loadNodeLibrary():Promise<NodeLibrary>{
 const response=await fetch(import.meta.env.BASE_URL+'i18n/nodes.en.json');
 if(!response.ok)throw Error('Node learning library HTTP '+response.status);
 const data:unknown=await response.json();
 if(!data||typeof data!=='object')throw Error('Invalid node learning library');
 const value=data as Partial<NodeLibrary>;
 if(value.schemaVersion!==1||value.locale!=='en'||!value.nodes||!value.lookup)throw Error('Unsupported node learning library schema');
 return value as NodeLibrary;
}
