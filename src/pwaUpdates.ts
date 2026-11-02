/** Detect deployed releases and activate them after the current edit is finished. */
export async function startAutomaticUpdates(options:{base:string;beforeReload:()=>void|Promise<void>;canReload:()=>boolean}){
 if(!('serviceWorker' in navigator))return;
 const workers=navigator.serviceWorker;
 let controlled=!!workers.controller,reloading=false,applying=false;
 const reload=async()=>{if(reloading)return;reloading=true;try{await options.beforeReload()}catch(error){console.warn('Update postponed: progress could not be saved',error);reloading=false;return}location.reload()};
 workers.addEventListener('controllerchange',()=>{
  if(!controlled){controlled=true;return;}
  if(options.canReload())reload();else pendingReload=true;
 });
 let pendingReload=false;
 try{
  const registration=await workers.register(options.base+'sw.js',{scope:options.base,updateViaCache:'none'});
  const apply=async()=>{
   if(document.visibilityState!=='visible'||!options.canReload())return;
   if(pendingReload){reload();return;}
   if(!registration.waiting||!workers.controller||applying)return;
   applying=true;
   try{await options.beforeReload()}catch(error){console.warn('Update postponed: progress could not be saved',error);applying=false;return}
   registration.waiting?.postMessage({type:'SKIP_WAITING'});
  };
  const watch=()=>{const worker=registration.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')apply()})};
  registration.addEventListener('updatefound',watch);watch();apply();
  let checking=false;
  const check=async()=>{
   if(document.visibilityState!=='visible'||!navigator.onLine||checking)return;
   checking=true;
   try{await registration.update();apply()}catch(error){console.debug('Update check deferred',error)}finally{checking=false}
  };
  window.setInterval(check,5*60*1000);
  window.setInterval(apply,2000);
  window.addEventListener('online',check);
  window.addEventListener('focus',check);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void check()});
  void check();
 }catch(error){console.warn('Offline installation unavailable',error)}
}
