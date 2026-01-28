import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7-ODDPc4cwo7xC5iGsDMVUK53KLHsQP0",
  authDomain: "frigram-10731.firebaseapp.com",
  projectId: "frigram-10731",
  storageBucket: "frigram-10731.firebasestorage.app",
  messagingSenderId: "827341494479",
  appId: "1:827341494479:web:a6f6b1fb9e99c507a6bfba"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
