import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import AnalyticsCards from "../components/dashboard/AnalyticsCards";

import {
  getBookings,
  approveBooking,
  deleteProperty,
  markVacant,
  markOccupied,
  getLandlordAnalytics,
  getProfile,
} from "../services/api";

import "../styles/dashboard.css";

function LandlordDashboard() {
  const [bookings, setBookings] =
    useState([]);

  const [analytics, setAnalytics] =
    useState(null);

  const [user, setUser] =
    useState(null);


  const navigate = useNavigate();

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchBookings();
    fetchAnalytics();
    fetchProfile();
  }, []);

  // =========================================
  // FETCH BOOKINGS
  // =========================================
  const fetchBookings = async () => {
    try {
      const data =
        await getBookings();

      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================
  // FETCH ANALYTICS
  // =========================================
  const fetchAnalytics = async () => {
    try {
      const data =
        await getLandlordAnalytics();

      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {

    try {

      const data =
        await getProfile();

      setUser(data);

    } catch (error) {

      console.error(error);

    }

  };

  // =========================================
  // APPROVE BOOKING
  // =========================================
  const handleApprove = async (id) => {
    try {
      await approveBooking(id);

      alert("Booking approved");

      fetchBookings();
      fetchAnalytics();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        "Approval failed"
      );
    }
  };

  // =========================================
  // DELETE PROPERTY
  // =========================================
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this property?"
      );

    if (!confirmDelete) return;

    try {
      await deleteProperty(id);

      alert("Property deleted");

      fetchBookings();
      fetchAnalytics();
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    }
  };

  // =========================================
  // MARK VACANT
  // =========================================
  const handleVacant = async (id) => {
    try {
      await markVacant(id);

      alert("Property marked vacant");

      fetchBookings();
      fetchAnalytics();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================
  // MARK OCCUPIED
  // =========================================
  const handleOccupied = async (id) => {
    try {
      await markOccupied(id);

      alert("Property marked occupied");

      fetchBookings();
      fetchAnalytics();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <section className="dashboard">
        {/* WELCOME HEADER */}
        <div className="dashboard-header">
          <h1>
            Welcome,
              {" "}
              {user?.username || "Landlord"}
              👋
          </h1>

          <p>
            Track property availability, manage
            tenant requests, and monitor your
            rental portfolio performance in
            real time.
          </p><br></br>

          <div className="dashboard-actions">
            <Link
              to="/add-property"
              className="add-property-btn"
            >
              + Add Property
            </Link>
          </div>
        </div>

        {/* SUMMARY BANNER */}
        <div className="dashboard-summary">
          <p>
            You currently manage
            {" "}
            <strong>
              {
                analytics?.total_properties || 0
              }
            </strong>
            {" "}
            properties with
            {" "}
            <strong>
              {
                analytics?.pending_bookings || 0
              }
            </strong>
            {" "}
            pending booking requests.
          </p>
        </div>

        {/* ANALYTICS */}
        <div className="analytics-grid">
          <AnalyticsCards
            title="Properties"
            value={
              analytics?.total_properties || 0
            }
          />

          <AnalyticsCards
            title="Vacant Houses"
            value={
              analytics?.available_properties || 0
            }
          />

          <AnalyticsCards
            title="Occupied Houses"
            value={
              analytics?.occupied_properties || 0
            }
          />

          <AnalyticsCards
            title="Pending Requests"
            value={
              analytics?.pending_bookings || 0
            }
          />

          <AnalyticsCards
            title="Approved Tenants"
            value={
              analytics?.approved_bookings || 0
            }
          />
        </div>

        {/* BOOKINGS GRID */}
        <div className="dashboard-grid">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="dashboard-card"
              >
                {/* CARD HEADER */}
                <div className="dashboard-card-header">
                  <div>
                    <h3>
                      {booking.property_title}
                    </h3>

                    <p className="property-meta">
                      {booking.location}
                      {" • "}
                      KES {booking.price}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${booking.status}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* TENANT INFO */}
                <div className="tenant-info">
                  <p>
                    Tenant:{" "}
                    <strong>
                      {booking.tenant_username}
                    </strong>
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="dashboard-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(
                        `/edit-property/${booking.property}`
                      )
                    }
                  >
                    Edit
                  </button>

                  {booking.property_status ===
                  "available" ? (
                    <button
                      className="vacant-btn"
                      onClick={() =>
                        handleOccupied(
                          booking.property
                        )
                      }
                    >
                      Mark Occupied
                    </button>
                  ) : (
                    <button
                      className="vacant-btn"
                      onClick={() =>
                        handleVacant(
                          booking.property
                        )
                      }
                    >
                      Mark Vacant
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        booking.property
                      )
                    }
                  >
                    Delete
                  </button>
                </div>

                {/* APPROVE BUTTON */}
                {booking.status ===
                  "pending" && (
                  <button
                    className="approve-btn"
                    onClick={() =>
                      handleApprove(
                        booking.id
                      )
                    }
                  >
                    Approve Booking
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>
              No booking requests available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandlordDashboard;