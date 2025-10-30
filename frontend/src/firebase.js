import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHv11PNZ-6FuZrEqSKNYyAydmM-7ckQOg",
  authDomain: "dinrauth.firebaseapp.com",
  projectId: "dinrauth",
  storageBucket: "dinrauth.firebasestorage.app",
  messagingSenderId: "591568977575",
  appId: "1:591568977575:web:2ee1833d42ceaa7182e582"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
