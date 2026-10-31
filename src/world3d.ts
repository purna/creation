import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export class World3D {
 private renderer:THREE.WebGLRenderer;
 private scene=new THREE.Scene();
 private camera=new THREE.PerspectiveCamera(55,1,.1,1000);
 private controls:OrbitControls;
 private body:THREE.Mesh;
 private glow:THREE.PointLight;
 private resizeObserver:ResizeObserver;
 private day=-1;
 constructor(private canvas:HTMLCanvasElement){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  this.scene.background=new THREE.Color('#060e20');
  this.camera.position.set(0,3,11);
  this.controls=new OrbitControls(this.camera,canvas);
  this.controls.enableDamping=true;
  this.controls.enablePan=true;
  this.controls.minDistance=2;
  this.controls.maxDistance=100;
  this.scene.add(new THREE.AmbientLight('#b5cfff',.55));
  this.glow=new THREE.PointLight('#ffd38c',35,100);this.glow.position.set(5,5,8);this.scene.add(this.glow);
  this.body=new THREE.Mesh(new THREE.SphereGeometry(2,64,40),new THREE.MeshStandardMaterial({color:'#ffcc74',roughness:.7}));
  this.scene.add(this.body);
  const stars=new Float32Array(900);
  for(let i=0;i<300;i++){const a=i*2.39996,z=1-2*(i+.5)/300,r=Math.sqrt(1-z*z);stars[3*i]=r*Math.cos(a)*300;stars[3*i+1]=z*300;stars[3*i+2]=r*Math.sin(a)*300}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(stars,3));
  this.scene.add(new THREE.Points(geometry,new THREE.PointsMaterial({color:'#bdcce9',size:2,sizeAttenuation:false})));
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize();
 }
 update(day:number,time:number,radius:number,temperature:number,stable:boolean){
  if(day!==this.day){this.day=day;const material=this.body.material as THREE.MeshStandardMaterial;material.color.set(day===0?'#ffbc6e':day===1?'#3e87ce':day===2?'#4a9c75':day===3?'#dcad7e':day===4?'#2886b4':'#6bb584');material.emissive.set(day===0?'#ff7b21':'#000000');material.emissiveIntensity=day===0?1.2:0;this.glow.intensity=day===0?50:20;}
  this.body.scale.setScalar(day===0?Math.max(.2,Math.min(3,radius))*(1+.012*Math.sin(time*.08)):1);
  if(day===0){const mat=this.body.material as THREE.MeshStandardMaterial;mat.color.setHSL(.04+Math.max(0,Math.min(.1,(25-temperature)*.004)),.9,stable?.7:.5);}
  this.body.rotation.y+=.002;
  this.controls.update();this.renderer.render(this.scene,this.camera);
 }
 reset(){this.controls.target.set(0,0,0);this.camera.position.set(0,3,11);this.controls.update()}
 resize(){const w=Math.max(1,this.canvas.clientWidth),h=Math.max(1,this.canvas.clientHeight);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false)}
 dispose(){this.resizeObserver.disconnect();this.controls.dispose();this.body.geometry.dispose();(this.body.material as THREE.Material).dispose();this.scene.traverse(o=>{if(o instanceof THREE.Points){o.geometry.dispose();(o.material as THREE.Material).dispose()}});this.renderer.dispose()}
}
