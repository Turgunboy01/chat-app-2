import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjo428ZGI53zrlGsM9bRwxABUO_LJ19hA",
  authDomain: "new-chat-e6315.firebaseapp.com",
  projectId: "new-chat-e6315",
  storageBucket: "new-chat-e6315.appspot.com",
  messagingSenderId: "514938138361",
  appId: "1:514938138361:web:d7394b09dd4d3e280b7c28",
  measurementId: "G-0WPXD0F5RV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
