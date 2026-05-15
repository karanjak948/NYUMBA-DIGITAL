import { Link, useNavigate } from "react-router-dom";

import { Home } from "lucide-react";

import "../../styles/navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link to="/" className="logo">

          <Home size={32} />

          <span>Nyumba Digital</span>

        </Link>

        <div className="nav-links">

          <Link to="/properties">
            Properties
          </Link>

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <div className="nav-buttons">

          {!token && (

            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>
            </>

          )}

          {token && (

            <>
              {role === "landlord" && (

                <Link
                  to="/landlord/dashboard"
                  className="login-btn"
                >
                  Dashboard
                </Link>

              )}

              {role === "tenant" && (

                <Link
                  to="/tenant/dashboard"
                  className="login-btn"
                >
                  My Bookings
                </Link>

              )}

              <button
                className="register-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;