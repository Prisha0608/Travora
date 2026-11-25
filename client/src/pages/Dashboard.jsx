
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";
import Spinner from "../components/Spinner";
import { formatCurrency, isUpcoming } from "../utils/helpers";
import "./Dashboard.css";

const destinations = [
  {
    name: "Cappadocia",
    country: "Turkey",
    label: "ABOVE THE CLOUDS",
    image:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1000&q=90",
    className: "destination-large",
  },
  {
    name: "Kyoto",
    country: "Japan",
    label: "CULTURE & CALM",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=90",
    className: "",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    label: "MOUNTAIN ESCAPE",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=90",
    className: "",
  },
  {
    name: "Marrakech",
    country: "Morocco",
    label: "COLOURS OF CULTURE",
    image:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=90",
    className: "",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Explorer";

  // Load trips
  const loadTrips = async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await api.get("/trips");

      setTrips(
        Array.isArray(data) ? data : data.trips || []
      );
    } catch (error) {
      setError(true);
      toast.error("Could not load your trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Delete a trip
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/trips/${id}`);

      setTrips((currentTrips) =>
        currentTrips.filter((trip) => trip._id !== id)
      );

      toast.success("Trip deleted");
    } catch (error) {
      toast.error("Could not delete this trip");
    }
  };

  // Dashboard statistics
  const upcomingCount = trips.filter((trip) =>
    isUpcoming(trip.endDate)
  ).length;

  const totalBudget = trips.reduce(
    (total, trip) =>
      total + Number(trip.totalBudget ?? trip.budget ?? 0),
    0
  );

  return (
    <div className="travel-dashboard">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="travel-hero">
          <div className="hero-image"></div>
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="hero-kicker">
              <span className="hero-kicker-line"></span>
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1>
              The world is yours
              <br />
              <span>to wander.</span>
            </h1>

            <p>
              Hey {firstName}, your next unforgettable adventure
              is waiting. Let's make it happen.
            </p>

            <div className="hero-actions">
              <Link to="/trips/new" className="hero-primary-btn">
                Plan a trip <span>↗</span>
              </Link>

              <a href="#inspiration" className="hero-secondary-btn">
                Explore destinations <span>↓</span>
              </a>
            </div>
          </div>

          <div className="hero-stamp">
            <span className="stamp-top">TRAVEL MORE</span>
            <span className="stamp-icon">✳</span>
            <span className="stamp-bottom">WORRY LESS</span>
          </div>

          <div className="hero-caption">
            <span>01 / 04</span>
            <span>FIND YOUR EVERYWHERE</span>
          </div>
        </section>

        {/* QUICK OVERVIEW */}
        <section className="overview-strip">
          <div className="overview-heading">
            <span className="section-eyebrow">YOUR TRAVEL JOURNAL</span>
            <h2>A little snapshot.</h2>
          </div>

          <div className="overview-items">
            <div className="overview-item overview-coral">
              <span className="overview-icon">✈</span>
              <div>
                <strong>{trips.length}</strong>
                <span>Trips planned</span>
              </div>
            </div>

            <div className="overview-item overview-yellow">
              <span className="overview-icon">◎</span>
              <div>
                <strong>{formatCurrency(totalBudget)}</strong>
                <span>Total trip budget</span>
              </div>
            </div>

            <div className="overview-item overview-purple">
              <span className="overview-icon">✦</span>
              <div>
                <strong>{upcomingCount}</strong>
                <span>Upcoming trips</span>
              </div>
            </div>
          </div>
        </section>

        {/* DESTINATION INSPIRATION */}
        <section className="inspiration-section" id="inspiration">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">
                A WORLD OF POSSIBILITIES
              </span>

              <h2>
                Where to <span>next?</span>
              </h2>

              <p>Some places just have a way of staying with you.</p>
            </div>

            <span className="handwritten-note">
              Your next story awaits ✳
            </span>
          </div>

          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <Link
                to="/trips/new"
                className={`destination-card ${destination.className}`}
                key={destination.name}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                />

                <div className="destination-shade"></div>

                <span className="destination-number">
                  0{index + 1}
                </span>

                <div className="destination-info">
                  <span>{destination.label}</span>
                  <h3>{destination.name}</h3>
                  <p>{destination.country}</p>
                </div>

                <span className="destination-arrow">↗</span>
              </Link>
            ))}
          </div>
        </section>

        {/* MY TRIPS */}
        <section className="my-trips-section" id="my-trips">
          <div className="section-heading-row trips-heading">
            <div>
              <span className="section-eyebrow">MADE OF MOMENTS</span>

              <h2>
                Your <span>adventures.</span>
              </h2>

              <p>
                All your plans, dreams and getaways in one place.
              </p>
            </div>

            <Link to="/trips/new" className="outline-create-btn">
              + Create a trip
            </Link>
          </div>

          {loading ? (
            <Spinner text="Gathering your adventures..." />
          ) : error ? (
            <div className="error-box">
              <h2>Couldn't load your trips</h2>
              <p>Check your connection and try again.</p>

              <button
                className="btn btn-primary"
                onClick={loadTrips}
              >
                Try again
              </button>
            </div>
          ) : trips.length > 0 ? (
            <div className="trips-grid">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-trips">
              <div className="empty-illustration">🌴</div>

              <div>
                <span className="section-eyebrow">
                  THE WORLD IS WAITING
                </span>

                <h3>Your story starts with a trip.</h3>

                <p>
                  You haven't planned an adventure yet. Pick a place,
                  set a date and give yourself something exciting to
                  look forward to.
                </p>

                <Link to="/trips/new" className="empty-create-btn">
                  Plan your first trip <span>↗</span>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* BOTTOM BANNER */}
        <section className="dream-banner">
          <div className="dream-banner-text">
            <span>LESS SCROLLING. MORE EXPLORING.</span>

            <h2>
              Collect moments.
              <br />
              <i>Not things.</i>
            </h2>
          </div>

          <div className="dream-banner-right">
            <span className="dream-sun">☀</span>

            <Link to="/trips/new">
              Make it a trip <span>↗</span>
            </Link>
          </div>

          <span className="banner-decoration">✳</span>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
