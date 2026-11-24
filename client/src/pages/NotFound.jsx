import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "6rem 1rem" }}>
    <h1 style={{ fontSize: "4rem", margin: 0, color: "#0d9488" }}>404</h1>
    <p className="muted" style={{ margin: "0.5rem 0 1.5rem" }}>
      Looks like this destination doesn't exist 🧭
    </p>
    <Link to="/" className="btn btn-primary">Take me home</Link>
  </div>
);

export default NotFound;