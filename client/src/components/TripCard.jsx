
import { Link } from "react-router-dom";
import {
  formatDate,
  getTripDays,
  formatCurrency,
} from "../utils/helpers";
import { getDestinationImage } from "../utils/destinationImages";
import "./TripCard.css";

function TripCard({ trip, onDelete }) {
  const days = getTripDays(trip.startDate, trip.endDate);

  const title = trip.title || trip.destination || "Untitled trip";

  // Get destination-specific photograph
  const coverImage = getDestinationImage(
    trip.destination || trip.title
  );

  return (
    <article className="trip-card">

      {/* Trip Image Banner */}
      <div
        className="trip-card-banner"
        style={{
          backgroundImage: `url("${coverImage}")`,
        }}
      >
        <div className="trip-banner-overlay"></div>

        {/* Journey Label */}
        <div className="trip-card-label">
          <span className="trip-label-dot"></span>
          YOUR JOURNEY
        </div>

        {/* Destination Title */}
        <div className="trip-banner-title">
          <span>EXPLORE THE WORLD</span>
          <h3>{title}</h3>
        </div>

        {/* Arrow */}
        <span className="trip-banner-arrow">
          ↗
        </span>
      </div>

      {/* Trip Information */}
      <div className="trip-card-body">

        {/* Travel Dates */}
        <div className="trip-card-date">
          <span className="trip-date-icon">📅</span>

          <span>
            {formatDate(trip.startDate)} –{" "}
            {formatDate(trip.endDate)}
          </span>
        </div>

        {/* Duration and Budget */}
        <div className="trip-meta">

          <div className="trip-meta-item">
            <span className="meta-icon meta-turquoise">
              ⏳
            </span>

            <div>
              <small>DURATION</small>
              <strong>
                {days} {days === 1 ? "day" : "days"}
              </strong>
            </div>
          </div>

          <div className="trip-meta-item">
            <span className="meta-icon meta-orange">
              ₹
            </span>

            <div>
              <small>BUDGET</small>
              <strong>
                {formatCurrency(trip.totalBudget)}
              </strong>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="trip-actions">

          <Link
            to={`/trips/${trip._id}`}
            className="trip-action-view"
          >
            Explore trip <span>→</span>
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
}

export default TripCard;
