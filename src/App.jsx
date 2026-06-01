
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

/* =========================
   SUPABASE CLIENT
========================= */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gdthbnguukmppdcschbm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdGhibmd1dWttcHBkY3NjaGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTg2NjUsImV4cCI6MjA5NTgzNDY2NX0.hbJ8taIU8f55XkgW4mrf-0g6fCKvz6kSFm063BKpEH8"
);

/* =========================
   SIDEBAR (SAAS READY)
========================= */
const Sidebar = ({ view, setView, user }) => {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "pos", label: "Point of Sale" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
    { id: "orders", label: "Orders" },
    { id: "branches", label: "Branches" },
    { id: "employees", label: "Employees" },
    { id: "reports", label: "Reports" }, // ✅ replaced Insights Center
    { id: "licensing", label: "Licensing" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "#161627",
      color: "#fff",
      padding: "20px"
    }}>
      <h2>🛍️ POSify Pro</h2>

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        {user?.role} • SaaS Mode
      </p>

      {menu.map(item => (
        <div
          key={item.id}
          onClick={() => setView(item.id)}
          style={{
            padding: "10px",
            margin: "6px 0",
            cursor: "pointer",
            borderRadius: "8px",
            background: view === item.id ? "#6C63FF" : "transparent"
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

/* =========================
   REPORTS MODULE (SAAS CORE)
========================= */
const Reports = ({ user }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("organization_id", user.organization_id);

      setSales(data || []);
    };

    fetchSales();
  }, [user]);

  const total = sales.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Sales: KES {total}</p>
      <p>Total Transactions: {sales.length}</p>
    </div>
  );
};

/* =========================
   POS MODULE (CLEAN VERSION)
========================= */
const POS = ({ user }) => {
  const createSale = async () => {
    await supabase.from("sales").insert([
      {
        organization_id: user.organization_id,
        branch_id: user.branch_id || null,
        total: Math.floor(Math.random() * 5000)
      }
    ]);

    alert("Sale recorded successfully");
  };

  return (
    <div>
      <h2>Point of Sale</h2>
      <button onClick={createSale}>
        Create Sale
      </button>
    </div>
  );
};

/* =========================
   DASHBOARD
========================= */
const Dashboard = ({ user }) => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to POSify Pro SaaS</p>
    <p>User Role: {user.role}</p>
  </div>
);

/* =========================
   LOGIN
========================= */
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return alert(error.message);

    const user = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    /* =========================
       LICENSE CHECK (ONE-TIME PAYMENT SYSTEM)
    ========================= */
    const { data: license } = await supabase
      .from("licenses")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .single();

    if (!license || license.status !== "active") {
      alert("License inactive. Please activate POSify Pro.");
      return;
    }

    setUser(profile);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0D0D1A",
      color: "#fff"
    }}>
      <div style={{
        padding: "40px",
        background: "#161627",
        borderRadius: "16px",
        width: "350px"
      }}>
        <h2>POSify Pro Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <button onClick={handleLogin} style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </div>
    </div>
  );
};

/* =========================
   MAIN APP (SAAS CORE)
========================= */
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "pos":
        return <POS user={user} />;
      case "reports":
        return <Reports user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar view={view} setView={setView} user={user} />

      <div style={{ padding: "20px", flex: 1 }}>
        {renderView()}
      </div>
    </div>
  );
}