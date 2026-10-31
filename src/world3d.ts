import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {worldEffectState} from './simulations/worldEffects';
export class World3D {
 private renderer:THREE.WebGLRenderer;
 private scene=new THREE.Scene();
 private camera=new THREE.PerspectiveCamera(55,1,.1,1000);
 private controls:OrbitControls;
 private body:THREE.Mesh;
 private glow:THREE.PointLight;
 private resizeObserver:ResizeObserver;
 private day=-1;
 private surfaceCanvas=document.createElement('canvas');
 private surfaceTexture:THREE.CanvasTexture;
 private corona:THREE.Sprite;
 private flares:THREE.Group=new THREE.Group();
 private clouds=new THREE.Group();
 private cloudShell:THREE.Mesh;
 private cloudTexture:THREE.CanvasTexture;
 private landCanvas=document.createElement('canvas');
 private landTexture:THREE.CanvasTexture;
 private landProgress=0;
 private frame=0;
 private effectsEnabled=true;
 private surfaceMaterial:THREE.MeshStandardMaterial;
 constructor(private canvas:HTMLCanvasElement){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  this.scene.background=new THREE.Color('#060e20');
  this.camera.position.set(0,3,11);
  this.controls=new OrbitControls(this.camera,canvas);
  this.controls.enableDamping=true;
  this.controls.enablePan=true;
  this.controls.minDistance=2;
  this.controls.maxDistance=100;
  this.scene.add(new THREE.AmbientLight('#b5cfff',.55));
  this.glow=new THREE.PointLight('#ffd38c',35,100);this.glow.position.set(5,5,8);this.scene.add(this.glow);
  this.surfaceCanvas.width=256;this.surfaceCanvas.height=128;
  this.surfaceTexture=new THREE.CanvasTexture(this.surfaceCanvas);
  this.surfaceTexture.colorSpace=THREE.SRGBColorSpace;
  this.surfaceTexture.wrapS=THREE.RepeatWrapping;
  this.surfaceMaterial=new THREE.MeshStandardMaterial({color:'#ffcc74',map:this.surfaceTexture,roughness:.95,emissive:'#ff6b16',emissiveMap:this.surfaceTexture,emissiveIntensity:1.2});
  this.body=new THREE.Mesh(new THREE.SphereGeometry(2,64,40),this.surfaceMaterial);
  this.drawSurface(0,false);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=128;glowCanvas.height=128;
  const glowCtx=glowCanvas.getContext('2d')!;const grad=glowCtx.createRadialGradient(64,64,10,64,64,64);
  grad.addColorStop(0,'rgba(255,180,65,.36)');grad.addColorStop(.52,'rgba(255,105,25,.19)');grad.addColorStop(1,'rgba(255,90,15,0)');
  glowCtx.fillStyle=grad;glowCtx.fillRect(0,0,128,128);
  this.corona=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  this.corona.scale.set(7,7,1);this.scene.add(this.corona);
  this.scene.add(this.flares);
  for(let i=0;i<4;i++){const curve=new THREE.EllipseCurve(0,0,.32+i*.07,.6+i*.08,0,Math.PI, false,0);
    const pts=curve.getPoints(36).map(p=>new THREE.Vector3(p.x,p.y,0));
    const flare=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#ffb44e',transparent:true,opacity:.5,blending:THREE.AdditiveBlending}));
    flare.position.set(Math.cos(i*1.57)*1.9,Math.sin(i*1.57)*1.9,0);
    flare.rotation.z=i*1.57;this.flares.add(flare);
  }
  this.scene.add(this.body);
  // Day 2: lightweight transparent cloud layer, independent of the stellar surface.
  const cloudCanvas=document.createElement('canvas');cloudCanvas.width=512;cloudCanvas.height=256;
  const cloudContext=cloudCanvas.getContext('2d')!;
  cloudContext.clearRect(0,0,512,256);
  // Deterministic overlapping wisps, avoiding expensive volumetric rendering on phones.
  for(let i=0;i<110;i++){
   const x=(i*137.508)%512,y=30+(i*71.33)%196;
   const rx=16+(i%7)*7,ry=4+(i%5)*3;
   const gradient=cloudContext.createRadialGradient(x,y,0,x,y,rx);
   gradient.addColorStop(0,'rgba(255,255,255,0.38)');
   gradient.addColorStop(.55,'rgba(245,250,255,0.16)');
   gradient.addColorStop(1,'rgba(255,255,255,0)');
   cloudContext.save();cloudContext.translate(x,y);cloudContext.scale(1,ry/rx);
   cloudContext.fillStyle=gradient;cloudContext.fillRect(-rx,-rx,rx*2,rx*2);cloudContext.restore();
  }
  this.cloudTexture=new THREE.CanvasTexture(cloudCanvas);
  this.cloudTexture.colorSpace=THREE.SRGBColorSpace;
  this.cloudTexture.wrapS=THREE.RepeatWrapping;
  this.cloudShell=new THREE.Mesh(new THREE.SphereGeometry(2.045,48,32),new THREE.MeshBasicMaterial({map:this.cloudTexture,transparent:true,opacity:.9,depthWrite:false,side:THREE.FrontSide}));
  this.landCanvas.width=256;this.landCanvas.height=128;
  this.landTexture=new THREE.CanvasTexture(this.landCanvas);
  this.landTexture.colorSpace=THREE.SRGBColorSpace;
  this.landTexture.wrapS=THREE.RepeatWrapping;
  this.drawLand(0);
  this.clouds.add(this.cloudShell);this.clouds.visible=false;this.scene.add(this.clouds);

  const stars=new Float32Array(900);
  for(let i=0;i<300;i++){const a=i*2.39996,z=1-2*(i+.5)/300,r=Math.sqrt(1-z*z);stars[3*i]=r*Math.cos(a)*300;stars[3*i+1]=z*300;stars[3*i+2]=r*Math.sin(a)*300}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(stars,3));
  this.scene.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:'#bdcce9',size:2,sizeAttenuation:false})));
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize();
 }
 update(day:number,time:number,radius:number,temperature:number,stable:boolean){
  if(day!==this.day){this.day=day;this.corona.visible=day===0&&this.effectsEnabled;this.flares.visible=day===0&&this.effectsEnabled;this.surfaceMaterial.map=day===0?this.surfaceTexture:day===2?this.landTexture:null;this.surfaceMaterial.emissiveMap=day===0?this.surfaceTexture:null;this.surfaceMaterial.needsUpdate=true;const material=this.body.material as THREE.MeshStandardMaterial;material.color.set(day===0?'#ffbc6e':day===1?'#3e87ce':day===2?'#4a9c75':day===3?'#dcad7e':day===4?'#2886b4':'#6bb584');material.emissive.set(day===0?'#ff7b21':'#000000');material.emissiveIntensity=day===0?1.2:0;this.glow.intensity=day===0?50:20;}
  this.body.scale.setScalar(day===0?Math.max(.2,Math.min(3,radius))*(1+.012*Math.sin(time*.08)):1);
  if(day===0){const mat=this.body.material as THREE.MeshStandardMaterial;mat.color.setHSL(.04+Math.max(0,Math.min(.1,(25-temperature)*.004)),.9,stable?.7:.5);}
  if(day===0){this.frame++;if(this.effectsEnabled&&this.frame%5===0)this.drawSurface(time,stable);const scale=this.body.scale.x;this.corona.scale.setScalar(7*scale);this.flares.scale.setScalar(scale);this.flares.rotation.z=time*.001;this.flares.children.forEach((f,i)=>{const material=(f as THREE.Line).material;if(material instanceof THREE.LineBasicMaterial){material.opacity=.22+.35*(.5+.5*Math.sin(time*.045+i*2));}});}
  this.clouds.visible=worldEffectState(day,stable,this.effectsEnabled).clouds;
  if(this.clouds.visible){this.cloudShell.rotation.y+=.0009;this.cloudShell.rotation.z=.04*Math.sin(time*.003);}
  // Day 3: continents emerge and vegetation spreads; retain Day 2 clouds.
  if(day===2){
   const target=worldEffectState(day,stable,this.effectsEnabled).land?1:0;
   this.landProgress=Math.max(0,Math.min(1,this.landProgress+(target>this.landProgress?.007:-.007)));
   if(this.frame++%8===0)this.drawLand(this.landProgress);
  }
  this.body.rotation.y+=.002;
  this.controls.update();this.renderer.render(this.scene,this.camera);
 }
 private drawLand(progress:number){
  const ctx=this.landCanvas.getContext('2d');if(!ctx)return;
  const w=256,h=128,img=ctx.createImageData(w,h),pixels=img.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const u=x/w*Math.PI*2,v=y/h*Math.PI;
   const shape=.43*Math.sin(u*2.2+Math.sin(v*3.1)*1.4)+.3*Math.sin(u*4.8-v*2.4)+.17*Math.cos(u*9.1+v*6.7)+.12*Math.sin(u*15.3-v*11.7);
   const latitude=Math.abs(y/h-.5)*2;
   const elevation=shape-.18*latitude;
   const emerged=elevation> .55-progress*.85;
   const green=emerged&&progress>.55&&latitude<.78&&elevation<.6;
   const i=(y*w+x)*4;
   const coast=emerged?Math.min(1,Math.max(0,(elevation+.2)*1.2)):0;
   pixels[i]=emerged?(green?35:Math.round(104+coast*65)):23;
   pixels[i+1]=emerged?(green?Math.round(88+progress*40):Math.round(89+coast*46)):Math.round(73+25*Math.cos(v));
   pixels[i+2]=emerged?(green?47:70):Math.round(143+45*Math.sin(v));
   pixels[i+3]=255;
  }
  ctx.putImageData(img,0,0);this.landTexture.needsUpdate=true;
 }
 private drawSurface(time:number,stable:boolean){
  const ctx=this.surfaceCanvas.getContext('2d');if(!ctx)return;
  const w=256,h=128,img=ctx.createImageData(w,h),d=img.data;
  const tick=time*.018;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const a=x/w*Math.PI*2,b=y/h*Math.PI;
    const swirl=Math.sin(a*13+Math.sin(b*8+tick)*2+tick)*Math.cos(b*17-tick*.7);
    const grains=Math.sin(a*47+b*39+tick*1.7)*Math.cos(a*35-b*29-tick);
    let spot=0;
    for(let k=0;k<5;k++){const sx=(.14+k*.173+tick*.0003)%1,sy=.3+.28*Math.sin(k*2.6);
      const dx=Math.min(Math.abs(x/w-sx),1-Math.abs(x/w-sx)),dy=y/h-sy;
      const rr=(dx*dx+dy*dy)/(.00035+(k%3)*.00013);
      spot+=Math.exp(-rr*1.7);
    }
    const heat=Math.max(0,Math.min(1,.58+.2*swirl+.14*grains-.67*spot));
    const p=(y*w+x)*4;d[p]=Math.round(165+90*heat);d[p+1]=Math.round(40+142*heat);d[p+2]=Math.round(10+72*heat);d[p+3]=255;
  }
  ctx.putImageData(img,0,0);this.surfaceTexture.needsUpdate=true;
  this.glow.intensity=stable?42:24;
 }
 setEffects(enabled:boolean){this.effectsEnabled=enabled;this.corona.visible=this.day===0&&enabled;this.flares.visible=this.day===0&&enabled;this.clouds.visible=(this.day===1||this.day===2)&&enabled&&this.clouds.visible;if(this.day===0&&!enabled)this.drawSurface(0,true)}
 reset(){this.controls.target.set(0,0,0);this.camera.position.set(0,3,11);this.controls.update()}
 resize(){const w=Math.max(1,this.canvas.clientWidth),h=Math.max(1,this.canvas.clientHeight);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false)}
 dispose(){this.cloudShell.geometry.dispose();(this.cloudShell.material as THREE.Material).dispose();this.cloudTexture.dispose();this.landTexture.dispose();this.resizeObserver.disconnect();this.controls.dispose();this.body.geometry.dispose();(this.body.material as THREE.Material).dispose();this.surfaceTexture.dispose();(this.corona.material as THREE.SpriteMaterial).map?.dispose();(this.corona.material as THREE.Material).dispose();this.flares.children.forEach(f=>{(f as THREE.Line).geometry.dispose();((f as THREE.Line).material as THREE.Material).dispose()});this.scene.traverse(o=>{if(o instanceof THREE.Points){o.geometry.dispose();(o.material as THREE.Material).dispose()}});this.renderer.dispose()}
}
