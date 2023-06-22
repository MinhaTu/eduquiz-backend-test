import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsDozDKo4h65QCnqjiGEKuBfm6sUbzkYA",
  authDomain: "edu-test-cc7ab.firebaseapp.com",
  projectId: "edu-test-cc7ab",
  storageBucket: "edu-test-cc7ab.appspot.com",
  messagingSenderId: "738901308969",
  appId: "1:738901308969:web:4d056ce5dc113987dace38",
  databaseURL: "https://edu-test-cc7ab-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

const dbRtdb = getDatabase(app);
const dbFirestore = getFirestore();

export { dbFirestore, dbRtdb };
