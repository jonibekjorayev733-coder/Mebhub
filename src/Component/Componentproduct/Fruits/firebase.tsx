// firebase.tsx
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB-X7IpSzfTVOailtjL9-InXO1m01W74U",
  authDomain: "foodmarket-9d266.firebaseapp.com",
  projectId: "foodmarket-9d266",
  storageBucket: "foodmarket-9d266.appspot.com",
  messagingSenderId: "718243465609",
  appId: "1:718243465609:web:fbc699a7cad8471b8d3958"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
