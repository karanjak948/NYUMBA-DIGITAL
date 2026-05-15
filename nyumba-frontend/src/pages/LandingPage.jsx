import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { Link } from "react-router-dom";

import {
  MapPin,
  ShieldCheck,
  Search,
  Building2,
} from "lucide-react";

import "../styles/landing.css";

function LandingPage() {
  return (
    <div>

      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <h1>
            Find Your Perfect Home in Nairobi
          </h1>

          <p>
            A smart rental platform connecting landlords and tenants directly.
            No agents. No viewing fees. Real-time vacancy updates.
          </p>

          {/* HERO BUTTONS */}
          <div className="hero-buttons">

            <Link to="/properties">
              <button className="primary-btn">
                Search Properties
              </button>
            </Link>

            <Link to="/register">
              <button className="secondary-btn">
                List Your Property
              </button>
            </Link>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features" id="features">

        <div className="section-title">
          <h2>Why Choose Nyumba Digital?</h2>

          <p>
            Smart features built for both landlords and tenants
          </p>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <MapPin size={40} />

            <h3>Location Based Search</h3>

            <p>
              Find houses near your preferred location easily.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={40} />

            <h3>No Agents</h3>

            <p>
              Connect directly with landlords without extra fees.
            </p>
          </div>

          <div className="feature-card">
            <Search size={40} />

            <h3>Advanced Filtering</h3>

            <p>
              Filter by rent, bedrooms, amenities and more.
            </p>
          </div>

          <div className="feature-card">
            <Building2 size={40} />

            <h3>Property Management</h3>

            <p>
              Landlords can manage vacancies in real-time.
            </p>
          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">

        <div className="about-content">

          <div className="about-text">

            <h2>About Nyumba Digital</h2>

            <p>
              Nyumba Digital is a modern housing platform
              designed to simplify rental management in Kenya.
            </p>

            <p>
              We help landlords advertise vacant houses
              while enabling tenants to search and book
              properties quickly and efficiently.
            </p>

          </div>

          <div className="about-image">

            <img
              src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop"
              alt="House"
            />

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default LandingPage;