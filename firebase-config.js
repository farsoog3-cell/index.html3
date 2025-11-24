import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVYoWats4bhKLbO8cu9hQ73WBjty-e5mA",
  authDomain: "aljj-28d36.firebaseapp.com",
  databaseURL: "https://aljj-28d36-default-rtdb.firebaseio.com",
  projectId: "aljj-28d36",
  storageBucket: "aljj-28d36.firebasestorage.app",
  messagingSenderId: "256012982420",
  appId: "1:256012982420:web:3a1541af04b99d658e7c81",
  measurementId: "G-43WH1GKJFC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
