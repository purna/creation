import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {startAutomaticUpdates} from './pwaUpdates';
describe('automatic release updates',()=>{
 let workers:EventTarget&{controller:object|null;register:ReturnType<typeof vi.fn>};
 let registration:EventTarget&{waiting:{postMessage:ReturnType<typeof vi.fn>}|null;installing:null;update:ReturnType<typeof vi.fn>};
 let beforeReload:ReturnType<typeof vi.fn>,reload:ReturnType<typeof vi.fn>,canReload:boolean;
 beforeEach(()=>{
  vi.useFakeTimers();
  registration=Object.assign(new EventTarget(),{waiting:{postMessage:vi.fn()},installing:null,update:vi.fn().mockResolvedValue(undefined)});
  workers=Object.assign(new EventTarget(),{controller:{},register:vi.fn().mockResolvedValue(registration)});
  vi.stubGlobal('navigator',{serviceWorker:workers,onLine:true});
  vi.stubGlobal('window',Object.assign(new EventTarget(),{setInterval}));
  vi.stubGlobal('document',Object.assign(new EventTarget(),{visibilityState:'visible'}));
  reload=vi.fn();vi.stubGlobal('location',{reload});
  beforeReload=vi.fn().mockResolvedValue(undefined);canReload=true;
 });
 afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks()});
 const start=()=>startAutomaticUpdates({base:'/creation/',beforeReload,canReload:()=>canReload});
 it('saves before activating and reloads only once',async()=>{
  await start();await Promise.resolve();
  expect(workers.register).toHaveBeenCalledWith('/creation/sw.js',{scope:'/creation/',updateViaCache:'none'});
  expect(beforeReload).toHaveBeenCalled();expect(registration.waiting!.postMessage).toHaveBeenCalledWith({type:'SKIP_WAITING'});
  workers.dispatchEvent(new Event('controllerchange'));workers.dispatchEvent(new Event('controllerchange'));await Promise.resolve();
  expect(reload).toHaveBeenCalledTimes(1);
 });
 it('waits for editing to finish',async()=>{
  canReload=false;await start();expect(beforeReload).not.toHaveBeenCalled();
  canReload=true;await vi.advanceTimersByTimeAsync(2000);
  expect(registration.waiting!.postMessage).toHaveBeenCalledTimes(1);
 });
 it('does not activate before asynchronous saving finishes',async()=>{
  let finish:()=>void=()=>{};beforeReload.mockImplementation(()=>new Promise<void>(resolve=>{finish=resolve}));
  await start();expect(registration.waiting!.postMessage).not.toHaveBeenCalled();
  finish();await Promise.resolve();expect(registration.waiting!.postMessage).toHaveBeenCalled();
 });
 it('does not reload on first installation',async()=>{
  workers.controller=null;registration.waiting=null;await start();workers.controller={};workers.dispatchEvent(new Event('controllerchange'));await Promise.resolve();expect(reload).not.toHaveBeenCalled();
 });
 it('checks periodically and when the connection returns',async()=>{
  registration.waiting=null;await start();await vi.advanceTimersByTimeAsync(5*60*1000);expect(registration.update.mock.calls.length).toBeGreaterThanOrEqual(2);
  const count=registration.update.mock.calls.length;window.dispatchEvent(new Event('online'));await Promise.resolve();expect(registration.update.mock.calls.length).toBe(count+1);
 });
 it('leaves the current app running if saving fails',async()=>{
  vi.spyOn(console,'warn').mockImplementation(()=>{});beforeReload.mockRejectedValue(new Error('Storage unavailable'));await start();await Promise.resolve();expect(registration.waiting!.postMessage).not.toHaveBeenCalled();expect(reload).not.toHaveBeenCalled();
 });
});
