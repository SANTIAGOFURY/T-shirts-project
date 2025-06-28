import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import "../Css/AdminSettings.css"; // Optional styling

export default function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch and live-sync admins collection
  useEffect(() => {
    const q = collection(db, "admins");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAdmins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Deduplicate admins by email for clean UI
      const uniqueAdminsMap = new Map();
      fetchedAdmins.forEach((admin) => {
        if (!uniqueAdminsMap.has(admin.email)) {
          uniqueAdminsMap.set(admin.email, admin);
        }
      });

      setAdmins([...uniqueAdminsMap.values()]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!newEmail.trim()) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      // Check if the email already exists
      const q = query(collection(db, "admins"), where("email", "==", newEmail));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setError("This email is already an admin.");
        return;
      }

      await addDoc(collection(db, "admins"), { email: newEmail.trim() });
      setNewEmail("");
    } catch (err) {
      console.error(err);
      setError("Error adding admin.");
    }
  };

  const handleRemoveAdmin = async (id) => {
    setError("");
    try {
      await deleteDoc(doc(db, "admins", id));
    } catch (err) {
      console.error(err);
      setError("Error removing admin.");
    }
  };

  return (
    <div className="admin-settings">
      <h2>Admin Management</h2>

      <form onSubmit={handleAddAdmin} className="admin-add-form">
        <input
          type="email"
          placeholder="Enter new admin email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button type="submit">Add Admin</button>
      </form>

      {error && <div className="admin-error">{error}</div>}

      <h3>Current Admins</h3>
      {loading ? (
        <p>Loading admins...</p>
      ) : admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <ul className="admin-list">
          {admins.map((admin) => (
            <li key={admin.id}>
              {admin.email}
              <button
                className="admin-remove-btn"
                onClick={() => handleRemoveAdmin(admin.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
