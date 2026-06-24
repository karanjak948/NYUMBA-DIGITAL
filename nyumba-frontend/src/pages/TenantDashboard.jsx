import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";

import { getBookings } from "../services/api";

import "../styles/dashboard.css";

function TenantDashboard() {
  const [bookings, setBookings] =
    useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

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
  // CURRENT USER
  // =========================================
  const username =
    localStorage.getItem(
      "username"
    );

  return (
    <div>
      <Navbar />

      <section className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1>
            Welcome,
            {" "}
            {username}
            👋
          </h1>

          <p>
            You currently have
            {" "}
            {bookings.length}
            {" "}
            booking
            {bookings.length !== 1
              ? "s"
              : ""}
            {" "}
            in the system.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="tenant-summary">
          <div className="summary-card">
            <h2>
              {bookings.length}
            </h2>

            <p>
              Total Bookings
            </p>
          </div>

          <div className="summary-card">
            <h2>
              {
                bookings.filter(
                  (b) =>
                    b.status ===
                    "approved"
                ).length
              }
            </h2>

            <p>
              Approved
            </p>
          </div>

          <div className="summary-card">
            <h2>
              {
                bookings.filter(
                  (b) =>
                    b.status ===
                    "pending"
                ).length
              }
            </h2>

            <p>
              Pending
            </p>
          </div>
        </div>

        {/* BOOKINGS GRID */}
        <div className="dashboard-grid">
          {bookings.length === 0 ? (
            <p>
              You have no bookings
              yet.
            </p>
          ) : (
            bookings.map(
              (booking) => (
                <div
                  key={booking.id}
                  className="dashboard-card booking-card"
                >
                  <h3>
                    {
                      booking.property_title
                    }
                  </h3>

                  <p>
                    {
                      booking.property_location
                    }
                  </p>

                  <div className="booking-meta">
                    <span
                      className={`status-badge ${booking.status}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {booking.booking_fee && (
                    <p>
                      Booking Fee:
                      {" "}
                      KES{" "}
                      {
                        booking.booking_fee
                      }
                    </p>
                  )}

                  {booking.created_at && (
                    <p>
                      Date:
                      {" "}
                      {new Date(
                        booking.created_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default TenantDashboard;