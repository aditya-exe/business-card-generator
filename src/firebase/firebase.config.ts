import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEgDsiLnQuf_QSt1xkUNXFu4emjOmSnt4",
  authDomain: "business-card-e636d.firebaseapp.com",
  projectId: "business-card-e636d",
  storageBucket: "business-card-e636d.appspot.com",
  messagingSenderId: "379996166135",
  appId: "1:379996166135:web:47f9c05a7fa5b62ac5c0f2"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };