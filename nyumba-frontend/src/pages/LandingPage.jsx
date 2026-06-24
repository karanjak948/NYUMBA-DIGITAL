import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { Link } from "react-router-dom";

import {
  MapPin,
  ShieldCheck,
  Search,
  Building2,
  Users,
  Home,
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
{/* ABOUT */}
        <section className="about-section" id="about">

          {/* Top Row */}
          <div className="about-content">

            <div className="about-text">

              <h2>About Nyumba Digital</h2>

              <p>
                Nyumba Digital is a modern property management and
                rental marketplace built to transform the way
                landlords and tenants connect across Kenya.
              </p>

              <p>
                Our platform eliminates the challenges associated
                with traditional house hunting by providing
                real-time vacancy information, location-based
                property discovery, direct communication between
                landlords and tenants, and secure booking
                workflows.
              </p>

              <p>
                Whether you are a tenant searching for your next
                home or a landlord looking to manage multiple
                properties efficiently, Nyumba Digital provides
                the tools needed to simplify the entire rental
                experience.
              </p>

              <p>
                Through smart property management, vacancy
                tracking, geospatial search, and digital booking
                capabilities, we are creating a more transparent,
                efficient, and accessible housing ecosystem for
                everyone.
              </p>

            </div>

            <div className="about-image">

              <img
                src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop"
                alt="Nyumba Digital Apartments"
              />

            </div>

          </div>

          {/* Statistics */}
          <div className="about-stats">

            <div className="stat-card">
              <Building2 size={40} />
              <h3>500+</h3>
              <p>Properties Listed</p>
            </div>

            <div className="stat-card">
              <Users size={40} />
              <h3>1000+</h3>
              <p>Happy Tenants</p>
            </div>

            <div className="stat-card">
              <Home size={40} />
              <h3>100+</h3>
              <p>Landlords</p>
            </div>

          </div>

          {/* Mission Vision */}
          <div className="mission-vision">

            <div className="mission-card">

              <h3>Our Mission</h3>

              <p>
                To simplify property rental and management
                through technology while creating direct,
                transparent relationships between landlords
                and tenants.
              </p>

            </div>

            <div className="mission-card">

              <h3>Our Vision</h3>

              <p>
                To become Kenya's leading smart housing
                platform by providing innovative tools that
                improve accessibility, affordability, and
                efficiency in the rental market.
              </p>

            </div>

          </div>

        </section>

      <Footer />

    </div>
  );
}

export default LandingPage;