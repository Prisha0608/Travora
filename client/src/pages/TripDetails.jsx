import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { formatDate, getTripDays, formatCurrency } from "../utils/helpers";
import "./TripDetails.css";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    api
      .get(`/trips/${id}`)
      .then((res) => setTrip(res.data))
      .catch(() => {
        toast.error("Trip not found");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  if (!trip) return <p style={{ padding: "2rem" }}>Loading...</p>;

  const days = getTripDays(trip.startDate, trip.endDate);

  return (
    <>
      <Navbar />
      <main className="page">
        <Link to="/dashboard" className="back-link">← Back to dashboard</Link>

        <div className="details-hero">
          <h1>{trip.title}</h1>
          <p>
            📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
            {days} {days === 1 ? "day" : "days"}
          </p>
          <Link to={`/trips/${trip._id}/edit`} className="btn btn-light">
            Edit trip
          </Link>
        </div>

        <div className="details-grid">
          <div className="details-box">
            <span className="muted">Total budget</span>
            <strong>{formatCurrency(trip.totalBudget)}</strong>
          </div>
          <div className="details-box">
            <span className="muted">Destinations</span>
            <strong>{trip.destinations.length}</strong>
          </div>
          <div className="details-box">
            <span className="muted">Expenses logged</span>
            <strong>{trip.expenses.length}</strong>
          </div>
        </div>

        {trip.description && (
          <div className="details-desc">
            <h3>About this trip</h3>
            <p>{trip.description}</p>
          </div>
        )}

        <div className="details-desc">
          <p className="muted">
            Destinations, itinerary, and budget tabs are coming in the next steps.
          </p>
        </div>
      </main>
    </>
  );
};

export default TripDetails;