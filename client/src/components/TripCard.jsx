
import { Link } from "react-router-dom";
import { formatDate, getTripDays, formatCurrency } from "../utils/helpers";
import "./TripCard.css";

const tripImages = [
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
];

const TripCard = ({ trip, onDelete }) => {
  const days = getTripDays(trip.startDate, trip.endDate);
  const title = trip.title || trip.destination || "Untitled trip";

  // Give each trip a consistent image based on its title.
  const imageIndex = [...title].reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  ) % tripImages.length;

  return (
    <article className="trip-card">
      <div
        className="trip-card-banner"
        style={{ backgroundImage: `url("${tripImages[imageIndex]}")` }}
      >
        <div className="trip-banner-overlay"></div>

        <span className="trip-card-label">
          <span className="trip-label-dot"></span>
          YOUR JOURNEY
        </span>

        <div className="trip-banner-title">
          <span>DESTINATION</span>
          <h3>{title}</h3>
        </div>

        <span className="trip-banner-arrow">↗</span>
      </div>

      <div className="trip-card-body">
        <div className="trip-card-date">
          <span className="trip-date-icon">✦</span>
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </div>

        <div className="trip-meta">
          <div className="trip-meta-item">
            <span className="meta-icon meta-turquoise">◷</span>
            <div>
              <strong>{days} {days === 1 ? "Day" : "Days"}</strong>
              <small>Duration</small>
            </div>
          </div>

          <div className="trip-meta-item">
            <span className="meta-icon meta-orange">₹</span>
            <div>
              <strong>{formatCurrency(trip.totalBudget)}</strong>
              <small>Trip budget</small>
            </div>
          </div>
        </div>

        <div className="trip-actions">
          <Link
            to={`/trips/${trip._id}`}
            className="trip-action-view"
          >
            Explore trip <span>↗</span>
          </Link>

          <Link
            to={`/trips/${trip._id}/edit`}
            className="trip-action-edit"
          >
            Edit
          </Link>

          <button
            type="button"
            className="trip-action-delete"
            onClick={() => onDelete(trip._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TripCard;
