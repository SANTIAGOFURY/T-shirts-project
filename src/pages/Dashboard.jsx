import React, { useState } from "react";
import ProductManager from "../components/ProductManager";
import CommandTracker from "../components/CommandTracker";
import AdminSettings from "../components/AdminSettings";
import "../Css/Dashboard.css";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("products");

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li
              className={activeSection === "products" ? "active" : ""}
              onClick={() => setActiveSection("products")}
            >
              🛍️ Products
            </li>
            <li
              className={activeSection === "commands" ? "active" : ""}
              onClick={() => setActiveSection("commands")}
            >
              📦 Commands
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              ⚙️ Admin Settings
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        {activeSection === "products" && <ProductManager />}
        {activeSection === "commands" && <CommandTracker />}
        {activeSection === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}
