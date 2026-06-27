import { useState, useEffect } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Home,
  Bell,
} from "lucide-react";

import {
  getProfile,
  getNotifications,
  markNotificationsRead,
} from "../../services/api";

import "../../styles/navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const token =
    localStorage.getItem("access");

  const role =
    localStorage.getItem("role");

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.is_read
    );

  // =========================================
  // FETCH USER + NOTIFICATIONS
  // =========================================
  useEffect(() => {

    const fetchUser = async () => {

      try {

        const data =
          await getProfile();

        setUser(data);

      } catch (error) {

        console.error(error);
      }
    };

    const fetchNotifications =
      async () => {

          try {

            const data =
              await getNotifications();

            console.log(
              "NOTIFICATIONS:",
              data
            );

            setNotifications(

              Array.isArray(data)
                ? data
                : data.results || []

            );

          } catch (error) {

            console.error(error);

            setNotifications([]);
          }
        };

    if (token) {

      fetchUser();

      fetchNotifications();
    }

  }, [token]);

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  return (

    <nav className="navbar">

      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
        >

          <Home size={32} />

          <span>
            Nyumba Digital
          </span>

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

          {role === "admin" && (
            <Link to="/admin/dashboard">Admin</Link>
          )}

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

              {localStorage.getItem("role") === "landlord" && (
                <Link 
                  to="/reports"
                  className="login-btn"
                >
                  Reports
                </Link>
              )}

              <Link
                to="/landlord/inquiries"
                className="inquiries-btn"
              >
                Inquiries
              </Link>

              {role === "tenant" && (

                <Link
                  to="/tenant/dashboard"
                  className="login-btn"
                >
                  My Bookings
                </Link>

              )}

              {/* =========================================
                  NOTIFICATION BELL
              ========================================= */}
              <div className="notification-wrapper">

                <Link
                  to="/notifications"
                  className="notification-btn"
                  onClick={async () => {

                    try {

                      await markNotificationsRead();

                      setNotifications(
                        notifications.map(
                          (notification) => ({
                            ...notification,
                            is_read: true,
                          })
                        )
                      );

                    } catch (error) {

                      console.error(error);

                    }

                  }}
                >

                  🔔●

                  {unreadNotifications.length > 0 && (

                    <span className="notification-count">

                      {unreadNotifications.length}

                    </span>

                  )}

                </Link>

              </div>

              {/* =========================================
                  PROFILE DROPDOWN
              ========================================= */}
              <div className="profile-dropdown">

                <button
                  className="profile-trigger"
                  onClick={() =>
                    setShowDropdown(
                      !showDropdown
                    )
                  }
                >

                  <div className="profile-avatar">

                    {user?.username
                      ? user.username
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>

                  <span>

                    {user?.username ||
                      "Profile"}

                  </span>

                  <span className="arrow">
                    ▼
                  </span>

                </button>

                {showDropdown && (

                  <div className="dropdown-menu">

                    <Link
                      to="/profile"
                      className="dropdown-item"
                    >
                      👤 Profile
                    </Link>

                    <Link
                      to="/change-password"
                      className="dropdown-item"
                    >
                      🔒 Change Password
                    </Link>

                    <button
                      className="dropdown-item logout-item"
                      onClick={
                        handleLogout
                      }
                    >
                      🚪 Logout
                    </button>

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </div>

    </nav>

  );
}

export default Navbar;