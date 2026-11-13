import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [status, setStatus] = useState("Checking server...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus(res.data.message))
      .catch(() => setStatus("Cannot reach server"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Travora</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;