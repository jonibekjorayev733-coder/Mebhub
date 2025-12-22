import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey:"AIzaSyBB-X7IpSzfTVOailtjL9-InXO1m01W74U",
    authDomain: "foodmarket-9d266.firebaseapp.com",
    projectId: "foodmarket-9d266",
    storageBucket: "foodmarket-9d266.firebasestorage.app",
    messagingSenderId: "718243465609",
    appId: "1:718243465609:web:fbc699a7cad8471b8d3958"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;