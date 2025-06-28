// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- Added storage import

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCFae3qhoZrqwan2XWwcVyKrRQI9Qms0-4",
  authDomain: "t-shirts-store-957e4.firebaseapp.com",
  projectId: "t-shirts-store-957e4",
  storageBucket: "t-shirts-store-957e4.appspot.com",
  messagingSenderId: "463071932048",
  appId: "1:463071932048:web:deaa9ac28152e105707215",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// 🛠️ Set persistence to LOCAL (survives refreshes and tabs)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence setup error:", error);
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app); // <-- Initialize Storage

// Export Firebase services
export { auth, db, storage };
