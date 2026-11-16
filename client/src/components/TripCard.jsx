import { Link } from "react-router-dom";
import { formatDate, getTripDays, formatCurrency } from "../utils/helpers";
import "./TripCard.css";

const TripCard = ({ trip, onDelete }) => {
  const days = getTripDays(trip.startDate, trip.endDate);

  return (
    <div className="trip-card">
      <div className="trip-card-banner">
        <span>{trip.title.charAt(0).toUpperCase()}</span>
      </div>

      <div className="trip-card-body">
        <h3>{trip.title}</h3>
        <p className="trip-dates">
          📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>
        <div className="trip-meta">
          <span>🗓 {days} {days === 1 ? "day" : "days"}</span>
          <span>💰 {formatCurrency(trip.totalBudget)}</span>
        </div>

        <div className="trip-actions">
          <Link to={`/trips/${trip._id}`} className="btn btn-primary">
            View
          </Link>
          <Link to={`/trips/${trip._id}/edit`} className="btn btn-outline">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={() => onDelete(trip._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;