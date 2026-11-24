import { Link } from "react-router-dom";
import "./Landing.css";

const FEATURES = [
  { icon: "📍", title: "Multiple destinations", text: "Keep every place you want to visit in one list, with your own notes." },
  { icon: "🗓", title: "Day-wise itinerary", text: "Days are created from your dates. Add activities with time, place and cost." },
  { icon: "💰", title: "Budget tracking", text: "Log expenses by category and see planned vs. actual spending." },
  { icon: "📊", title: "Clear insights", text: "A chart and progress bars show exactly where your money goes." },
];

const STEPS = [
  { n: 1, title: "Create a trip", text: "Pick a name, dates and a budget." },
  { n: 2, title: "Plan your days", text: "Add destinations and activities." },
  { n: 3, title: "Track spending", text: "Log expenses and stay on budget." },
];

const Landing = () => (
  <div className="landing">
    <header className="landing-nav">
      <span className="landing-logo">✈️ Travora</span>
      <div className="landing-nav-actions">
        <Link to="/login" className="btn btn-outline">Log in</Link>
        <Link to="/register" className="btn btn-accent">Sign up</Link>
      </div>
    </header>

    <section className="hero">
      <h1>Plan every trip in one place</h1>
      <p>
        Destinations, day-wise itineraries and budgets, organised in a single
        simple planner. No more scattered notes and spreadsheets.
      </p>
      <div className="hero-actions">
        <Link to="/register" className="btn btn-accent btn-lg">Start planning free</Link>
        <Link to="/login" className="btn btn-light btn-lg">I have an account</Link>
      </div>
    </section>

    <section className="landing-section">
      <h2>Everything your trip needs</h2>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <div className="feature" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="landing-section landing-alt">
      <h2>How it works</h2>
      <div className="steps-row">
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <span className="step-num">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="cta">
      <h2>Ready for your next adventure?</h2>
      <Link to="/register" className="btn btn-accent btn-lg">Create your first trip</Link>
    </section>

    <footer className="landing-footer">
      © {new Date().getFullYear()} Travora – Smart Travel Planner
    </footer>
  </div>
);

export default Landing;