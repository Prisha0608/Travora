import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        ✈️ Travora
      </Link>
      <div className="navbar-right">
        <span className="navbar-user">Hi, {user?.name}</span>
        <button className="btn btn-outline" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;