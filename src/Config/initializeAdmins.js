import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { adminEmails } from "./admin";

// Call this function once in App to initialize admin collection
export const initializeAdminsCollection = async () => {
  try {
    const adminsCollection = collection(db, "admins");

    for (const email of adminEmails) {
      // Check if the email already exists
      const q = query(adminsCollection, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Add email if not exists
        await addDoc(adminsCollection, { email });
        console.log(`Admin ${email} added to Firestore.`);
      } else {
        console.log(`Admin ${email} already exists in Firestore.`);
      }
    }
  } catch (error) {
    console.error("Error initializing admins collection:", error);
  }
};
