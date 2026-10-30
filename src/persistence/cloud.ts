import {initializeApp,getApps} from 'firebase/app';
import {getAuth,GoogleAuthProvider,GithubAuthProvider,onAuthStateChanged,signInWithPopup,signInWithRedirect,getRedirectResult,signOut,type User} from 'firebase/auth';
import {getFirestore,doc,getDoc,setDoc} from 'firebase/firestore';
import type {SavedWorld} from './local';
const vars=import.meta.env;
export const cloudConfigured=Boolean(vars.VITE_FIREBASE_API_KEY&&vars.VITE_FIREBASE_AUTH_DOMAIN&&vars.VITE_FIREBASE_PROJECT_ID&&vars.VITE_FIREBASE_APP_ID);
const app=cloudConfigured?(getApps()[0]??initializeApp({apiKey:vars.VITE_FIREBASE_API_KEY,authDomain:vars.VITE_FIREBASE_AUTH_DOMAIN,projectId:vars.VITE_FIREBASE_PROJECT_ID,appId:vars.VITE_FIREBASE_APP_ID})):null;
const auth=app?getAuth(app):null,db=app?getFirestore(app):null;
export function observeUser(callback:(user:User|null)=>void){if(!auth){callback(null);return()=>{}}return onAuthStateChanged(auth,callback)}
export async function login(provider:'google'|'github'){if(!auth)throw Error('Firebase is not configured. See FIREBASE_SETUP.md.');const p=provider==='google'?new GoogleAuthProvider():new GithubAuthProvider();try{await signInWithPopup(auth,p)}catch(e){const code=(e as {code?:string}).code;if(code==='auth/popup-blocked'||code==='auth/operation-not-supported-in-this-environment')await signInWithRedirect(auth,p);else throw e}}
export async function finishRedirect(){if(auth)await getRedirectResult(auth)}
export async function logout(){if(auth)await signOut(auth)}
export async function readCloud(uid:string):Promise<SavedWorld|null>{if(!db||!auth?.currentUser||auth.currentUser.uid!==uid)return null;const snap=await getDoc(doc(db,'users',uid,'saves','main'));return snap.exists()?snap.data() as SavedWorld:null}
export async function writeCloud(uid:string,world:SavedWorld){if(!db||!auth?.currentUser||auth.currentUser.uid!==uid)throw Error('Not signed in');await setDoc(doc(db,'users',uid,'saves','main'),world)}
