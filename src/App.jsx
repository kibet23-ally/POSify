import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * POSify Pro Phase 2 - SaaS Ready Structure
 */

const Sidebar = ({ view, setView }) => {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "pos", label: "Point of Sale" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
    { id: "orders", label: "Orders" },
    { id: "branches", label: "Branches" },
    { id: "employees", label: "Employees" },
    { id: "reports", label: "Reports" }, // renamed from Insights Center
    { id: "licensing", label: "Licensing" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div style={{
      width: "240px",
      background: "#161627",
      height: "100vh",
      padding: "20px",
      color: "#fff"
    }}>
      <h2 style={{ marginBottom: "20px" }}>🛍️ POSify Pro</h2>

      {menu.map(item => (
        <div
          key={item.id}
          onClick={() => setView(item.id)}
          style={{
            padding: "10px",
            marginBottom: "8px",
            cursor: "pointer",
            background: view === item.id ? "#6C63FF" : "transparent",
            borderRadius: "8px"
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

const Reports = () => {
  const sales = JSON.parse(localStorage.getItem("sales") || "[]");

  const total = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Sales: KES {total}</p>
      <p>Total Transactions: {sales.length}</p>
    </div>
  );
};

const POS = () => {
  const [cart, setCart] = useState([]);

  const addSale = () => {
    const sale = {
      id: Date.now(),
      total: Math.floor(Math.random() * 5000),
    };

    const existing = JSON.parse(localStorage.getItem("sales") || "[]");
    localStorage.setItem("sales", JSON.stringify([...existing, sale]));

    alert("Sale saved (offline mode supported)");
  };

  return (
    <div>
      <h2>Point of Sale</h2>

      <button onClick={addSale}>Add Dummy Sale</button>

      <p>Cart Items: {cart.length}</p>
    </div>
  );
};

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to POSify Pro SaaS System</p>
  </div>
);

export default function App() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard": return <Dashboard />;
      case "pos": return <POS />;
      case "reports": return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar view={view} setView={setView} />

      <div style={{ flex: 1, padding: "20px" }}>
        {renderView()}
      </div>
    </div>
  );
}