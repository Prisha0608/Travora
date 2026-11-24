
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setSubmitting(true);

    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-scene register-scene">
      <div className="auth-background"></div>
      <div className="auth-shade"></div>

      <nav className="auth-navbar">
        <Link to="/" className="auth-logo">
          <span className="logo-symbol">✈</span>
          TRAVORA<span className="logo-dot">.</span>
        </Link>

        <div className="nav-right">
          <span>Already a member?</span>
          <Link to="/login" className="nav-link">
            Log In
          </Link>
        </div>
      </nav>

      <main className="auth-layout register-layout">
        <section className="auth-intro">
          <span className="eyebrow">
            <span className="eyebrow-line"></span>
            THE WORLD IS WAITING
          </span>

          <h1>
            Your Story.
            <br />
            <span>Your Adventure.</span>
          </h1>

          <p>
            New destinations, beautiful memories and
            countless stories are waiting to be made.
          </p>

          <div className="travel-points">
            <div>
              <span className="point-icon">✦</span>
              <span>Make every trip special</span>
            </div>
            <div>
              <span className="point-icon">✦</span>
              <span>Turn plans into memories</span>
            </div>
          </div>
        </section>

        <section className="auth-card register-card">
          <div className="card-top">
            <div className="card-icon">🌍</div>
            <span className="card-tag">JOIN THE JOURNEY</span>
          </div>

          <h2>Create your account.</h2>
          <p className="card-description">
            A whole world of adventures awaits you.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <div className="input-wrap">
              <span>♙</span>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Start Exploring"}
              <span>→</span>
            </button>
          </form>

          <div className="card-bottom">
            <span>Already have an account?</span>
            <Link to="/login">Log in</Link>
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

export default Register;
