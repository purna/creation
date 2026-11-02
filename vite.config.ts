import {defineConfig,type Plugin} from 'vite';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
function offlineRelease():Plugin{return {
 name:'offline-release',
 generateBundle(_,bundle){
  const assets=Object.keys(bundle).filter(name=>name.startsWith('assets/')).sort();
  const hash=createHash('sha256');
  for(const name of Object.keys(bundle).sort()){
   const entry=bundle[name];hash.update(name);hash.update(entry.type==='chunk'?entry.code:entry.source);
  }
  for(const name of readdirSync(new URL('./public/',import.meta.url),{recursive:true}).map(String).sort()){if(name.includes('.')){try{hash.update(name);hash.update(readFileSync(new URL('./public/'+name,import.meta.url)))}catch{}}}
  const template=readFileSync(new URL('./public/sw.js',import.meta.url),'utf8');
  hash.update(template);
  const version=hash.digest('hex').slice(0,16);
  const source=template.replace("const CACHE='creation-2.0.0'",`const CACHE='creation-${version}'`).replace('const CORE=[','const CORE='+JSON.stringify(assets.map(name=>'/creation/'+name))+'.concat([').replace("ROOT+'icons/maskable-512.png'];", "ROOT+'icons/maskable-512.png']);");
  this.emitFile({type:'asset',fileName:'sw.js',source});
 }
}}
export default defineConfig({base:'/creation/',plugins:[offlineRelease()]});
