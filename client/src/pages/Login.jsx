
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-scene login-scene">
      <div className="auth-background"></div>
      <div className="auth-shade"></div>

      <nav className="auth-navbar">
        <Link to="/" className="auth-logo">
          <span className="logo-symbol">✈</span>
          TRAVORA<span className="logo-dot">.</span>
        </Link>

        <div className="nav-right">
          <span>New to Travora?</span>
          <Link to="/register" className="nav-link">
            Create Account
          </Link>
        </div>
      </nav>

      <main className="auth-layout">
        <section className="auth-intro">
          <span className="eyebrow">
            <span className="eyebrow-line"></span>
            YOUR JOURNEY BEGINS HERE
          </span>

          <h1>
            Collect Moments.
            <br />
            <span>Not Things.</span>
          </h1>

          <p>
            The world is full of beautiful places.
            Let's help you find your next favourite one.
          </p>

          <div className="travel-points">
            <div>
              <span className="point-icon">✦</span>
              <span>Discover new places</span>
            </div>
            <div>
              <span className="point-icon">✦</span>
              <span>Plan unforgettable trips</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="card-top">
            <div className="card-icon">✈</div>
            <span className="card-tag">WELCOME BACK</span>
          </div>

          <h2>Let's get you going.</h2>
          <p className="card-description">
            Your next adventure is just a login away.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <div className="input-wrap">
              <span>✉</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="input-wrap">
              <span>♙</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Let's Explore"}
              <span>→</span>
            </button>
          </form>

          <div className="card-bottom">
            <span>Don't have an account?</span>
            <Link to="/register">Sign up free</Link>
          </div>
        </section>
      </main>

      <footer className="auth-footer">
        <span>MADE FOR THE LOVE OF TRAVEL</span>
        <span>DISCOVER · EXPLORE · REMEMBER</span>
      </footer>

      <div className="floating-star star-one">✦</div>
      <div className="floating-star star-two">✧</div>
    </div>
  );
};

export default Login;
