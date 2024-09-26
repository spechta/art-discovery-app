// Import the functions you need from the SDKs you need
import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkwhX4VpN9GzXkp798zFh8MqBNItb3ni0",
  authDomain: "art-discovery-app.firebaseapp.com",
  projectId: "art-discovery-app",
  storageBucket: "art-discovery-app.appspot.com",
  messagingSenderId: "732994254118",
  appId: "1:732994254118:web:11c52bf8bd84bc943e3de7"
};

// Initialize Firebase
let app, auth, storage;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    storage = getStorage(app); // Initialize Firebase Storage
  } catch (error) {
    console.error("Error initializing Firebase: ", error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
  storage = getStorage(app); // Initialize Firebase Storage
}

const provider = new EmailAuthProvider();
const db = getFirestore();
const timestamp = serverTimestamp();

export { app, auth, provider, db, storage, timestamp }; // Export storage