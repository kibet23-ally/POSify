import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

/* =========================
   SIDEBAR
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
    { id: "reports", label: "Reports" }, // SaaS analytics module
    { id: "licensing", label: "Licensing" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div style={styles.sidebar}>
      <h2>🛍️ POSify Pro</h2>

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        {user?.role} • SaaS Mode
      </p>

      {menu.map(item => (
        <div
          key={item.id}
          onClick={() => setView(item.id)}
          style={{
            ...styles.menuItem,
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
   DASHBOARD
========================= */
const Dashboard = ({ user }) => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to POSify Pro SaaS System</p>
    <p>User Role: {user?.role}</p>
  </div>
);

/* =========================
   POS
========================= */
const POS = ({ user }) => {
  const createSale = async () => {
    const amount = Math.floor(Math.random() * 5000);

    const { error } = await supabase.from("sales").insert([
      {
        organization_id: user.organization_id,
        branch_id: user.branch_id || null,
        total: amount
      }
    ]);

    if (error) alert(error.message);
    else alert("Sale recorded successfully");
  };

  return (
    <div>
      <h2>Point of Sale</h2>
      <button onClick={createSale}>Create Sale</button>
    </div>
  );
};

/* =========================
   REPORTS (REPLACES INSIGHTS CENTER)
========================= */
const Reports = ({ user }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("sales")
        .select("*")
        .eq("organization_id", user.organization_id);

      setSales(data || []);
    };

    load();
  }, [user]);

  const total = sales.reduce((a, b) => a + (b.total || 0), 0);

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Sales: KES {total}</p>
      <p>Total Transactions: {sales.length}</p>
    </div>
  );
};

/* =========================
   LOGIN + LICENSE CHECK
========================= */
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return alert(error.message);

    const authUser = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (!profile) return alert("Profile not found");

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
    <div style={styles.login}>
      <div style={styles.loginBox}>
        <h2>POSify Pro Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

/* =========================
   MAIN APP
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
    <div style={styles.app}>
      <Sidebar view={view} setView={setView} user={user} />
      <div style={styles.content}>{renderView()}</div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  app: { display: "flex", height: "100vh" },

  sidebar: {
    width: "240px",
    background: "#161627",
    color: "#fff",
    padding: "20px"
  },

  menuItem: {
    padding: "10px",
    margin: "6px 0",
    cursor: "pointer",
    borderRadius: "8px"
  },

  content: {
    flex: 1,
    padding: "20px"
  },

  login: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0D0D1A"
  },

  loginBox: {
    background: "#161627",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    color: "#fff"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0"
  },

  button: {
    width: "100%",
    padding: "10px",
    cursor: "pointer"
  }
};