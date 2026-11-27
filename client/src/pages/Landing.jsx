
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const heroImages = [
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2000&q=90",
    location: "SWITZERLAND",
    number: "01",
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&q=90",
    location: "THE DOLOMITES",
    number: "02",
  },
  {
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2000&q=90",
    location: "TROPICAL ESCAPES",
    number: "03",
  },
  {
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=2000&q=90",
    location: "ITALY",
    number: "04",
  },
];

const destinations = [
  {
    name: "Mountain Escapes",
    description: "Find peace in the mountains",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85",
  },
  {
    name: "Beach Getaways",
    description: "Chase the waves and sunshine",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
  },
  {
    name: "City Adventures",
    description: "Explore places full of life",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=85",
  },
];

const features = [
  {
    icon: "✦",
    title: "Plan every destination",
    description:
      "Keep all your destinations, travel dates and trip details organized in one place.",
  },
  {
    icon: "◷",
    title: "Build your itinerary",
    description:
      "Organize your activities day by day and make the most of every journey.",
  },
  {
    icon: "↗",
    title: "Track your expenses",
    description:
      "Manage your travel budget and keep an eye on your spending.",
  },
  {
    icon: "◎",
    title: "Travel with clarity",
    description:
      "See your plans clearly and enjoy a more organized travel experience.",
  },
];

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">✈</span>
          Travora
        </Link>

        <div className="landing-nav-links">
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/register" className="nav-signup">
            Get Started <span>↗</span>
          </Link>
        </div>
      </nav>

      <main>

        {/* HERO CAROUSEL */}
        <section className="landing-hero">

          <div className="hero-slides">
            {heroImages.map((slide, index) => (
              <div
                key={slide.number}
                className={`hero-slide ${
                  currentSlide === index ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}
          </div>

          <div className="hero-overlay"></div>

          <div className="hero-inner">

            <div className="hero-copy">

              <div className="hero-eyebrow">
                <span></span>
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <h1>
                The world is
                <br />
                yours
                <br />
                <em>to wander.</em>
              </h1>

              <div className="hero-actions">
                <Link to="/register" className="hero-primary-btn">
                  Plan a trip <span>↗</span>
                </Link>

                <a href="#destinations" className="hero-secondary-btn">
                  Explore destinations <span>↓</span>
                </a>
              </div>

            </div>

            <div className="travel-stamp">
              <span className="stamp-top">TRAVEL MORE</span>
              <span className="stamp-symbol">✳</span>
              <span className="stamp-bottom">WORRY LESS</span>
            </div>

            {/* CAROUSEL CONTROLS */}
            <div className="hero-carousel-controls">

              <div className="hero-counter">
                {heroImages[currentSlide].number} / 04
              </div>

              <div className="hero-location">
                {heroImages[currentSlide].location}
              </div>

              <div className="hero-arrows">
                <button onClick={prevSlide} aria-label="Previous slide">
                  ←
                </button>
                <button onClick={nextSlide} aria-label="Next slide">
                  →
                </button>
              </div>

              <div className="hero-dots">
                {heroImages.map((slide, index) => (
                  <button
                    key={slide.number}
                    className={currentSlide === index ? "active" : ""}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>

            <div className="hero-caption">
              FIND YOUR EVERYWHERE
            </div>

          </div>
        </section>

        {/* DESTINATIONS */}
        <section className="landing-destinations" id="destinations">

          <div className="landing-section-heading">
            <span className="section-eyebrow">A WORLD TO DISCOVER</span>
            <h2>Where will you go next?</h2>
            <p>
              Find inspiration for your next unforgettable journey.
            </p>
          </div>

          <div className="landing-destination-grid">

            {destinations.map((destination) => (
              <article
                className="landing-destination-card"
                key={destination.name}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                />

                <div className="destination-shade"></div>

                <div className="landing-destination-text">
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                </div>
              </article>
            ))}

          </div>
        </section>

        {/* FEATURES */}
        <section className="landing-features">

          <div className="landing-section-heading">
            <span className="section-eyebrow">MADE FOR YOUR JOURNEY</span>
            <h2>Travel planning, reimagined.</h2>
            <p>
              Everything you need to organize your next adventure.
            </p>
          </div>

          <div className="landing-feature-grid">

            {features.map((feature) => (
              <article
                className="landing-feature-card"
                key={feature.title}
              >
                <div className="landing-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}

          </div>
        </section>

        {/* FINAL CTA */}
<section className="landing-cta">

  <span className="section-eyebrow landing-cta-eyebrow">
    YOUR NEXT ADVENTURE AWAITS
  </span>

  <h2>Don't just dream about it. Go.</h2>

  <p>Start planning a journey worth remembering.</p>

  <Link to="/register" className="hero-primary-btn">
    Start your journey <span>↗</span>
  </Link>

</section>

      </main>

      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="footer-main">

          <div className="footer-brand">
            <Link to="/" className="landing-logo footer-logo">
              <span className="logo-icon">✈</span>
              Travora
            </Link>

            <p>
              Every journey begins with a dream.
              Let us help you turn yours into a plan.
            </p>

            <div className="footer-socials">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest ↗</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <a href="#destinations">Destinations</a>
            <a href="#destinations">Travel inspiration</a>
            <Link to="/register">Plan a trip</Link>
          </div>

          <div className="footer-links">
            <h4>Your Account</h4>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
          </div>

          <div className="footer-note">
            <span>READY TO EXPLORE?</span>
            <h3>Your next adventure is just a plan away.</h3>
            <Link to="/register" className="footer-cta-link">
              Get started ↗
            </Link>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Travora. All rights reserved.</p>
          <p>MADE FOR THE LOVE OF TRAVEL ✳</p>
        </div>

      </footer>

    </div>
  );
}

export default Landing;
