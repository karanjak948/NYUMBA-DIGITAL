import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";

import { getBookings } from "../services/api";

import "../styles/dashboard.css";

function TenantDashboard() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    fetchBookings();

  }, []);

  const fetchBookings = async () => {

    try {

      const data = await getBookings();

      setBookings(data);

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div>

      <Navbar />

      <section className="dashboard">

        <h1>My Bookings</h1>

        <div className="dashboard-grid">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="dashboard-card"
            >

              <h3>
                {booking.property_title}
              </h3>

              <p>
                {booking.property_location}
              </p>

              <span className="status">
                {booking.status}
              </span>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default TenantDashboard;