import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello, {user.name} 👋</h1>
      <p>Your trips will appear here.</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Dashboard;