import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="hero">

        {/* HERO TEXT */}
        <div className="container text-center">
          <h1 className="hero-title">
            Find Your Perfect Home in{" "}
            <span className="hero-highlight">Nairobi</span>
          </h1>

          <p className="hero-sub mt-3">
            A geo-based rental management system connecting landlords and tenants
            directly. No agents. No viewing fees. Real-time vacancy updates.
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-green"
              onClick={() => navigate("/properties")}
            >
              🔍 Search Properties
            </button>

            <button
              className="btn btn-outline-custom"
              onClick={() => navigate("/register")}
            >
              List Your Property
            </button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="container mt-5">
          <div className="row g-4 text-center">

            <div className="col-md-4">
              <div className="stat-card">
                <h2>🏠 500+</h2>
                <p>Properties Listed</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <h2>👥 1,200+</h2>
                <p>Active Users</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-card">
                <h2>📈 95%</h2>
                <p>Success Rate</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default LandingPage;