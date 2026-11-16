import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";
import { formatCurrency, isUpcoming } from "../utils/helpers";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trips")
      .then((res) => setTrips(res.data))
      .catch(() => toast.error("Could not load trips"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      toast.success("Trip deleted");
    } catch {
      toast.error("Could not delete trip");
    }
  };

  const upcomingCount = trips.filter((t) => isUpcoming(t.endDate)).length;
  const totalBudget = trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0);

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="dash-header">
          <div>
            <h1>Hello, {user.name} 👋</h1>
            <p className="muted">Here are all your trips.</p>
          </div>
          <Link to="/trips/new" className="btn btn-accent">
            + Create Trip
          </Link>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-num">{trips.length}</span>
            <span className="stat-label">Total trips</span>
          </div>
          <div className="stat">
            <span className="stat-num">{upcomingCount}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat">
            <span className="stat-num">{formatCurrency(totalBudget)}</span>
            <span className="stat-label">Total budget</span>
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="empty">
            <h2>No trips yet 🧳</h2>
            <p className="muted">Create your first trip to get started.</p>
            <Link to="/trips/new" className="btn btn-accent">
              + Create Trip
            </Link>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;