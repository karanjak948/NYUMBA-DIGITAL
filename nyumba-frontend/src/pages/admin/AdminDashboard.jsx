import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { getAdminDashboard, getUsers, getProperties, getBookings } from "../../services/api";
import API from "../../services/api";

import "../../styles/dashboard.css";
import "../../styles/profile.css";
import "../../styles/admin.css";

function AdminDashboard() {

  // OVERVIEW DATA
  const [data, setData] = useState(null);

  // TABS STATE
  const [tab, setTab] = useState("overview");

  // DATA STORES
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // FETCH DATA
  useEffect(() => {
    fetchData();
    fetchAll();
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [dash, u, p, b] = await Promise.all([
        getAdminDashboard(),
        getUsers(),
        getProperties(),
        getBookings(),
      ]);

      setData(dash);
      setUsers(u);
      setProperties(p);
      setBookings(b);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAll = async () => {
    try {
      const u = await API.get("auth/admin/users/");
      const p = await API.get("auth/admin/properties/");
      const b = await API.get("auth/admin/bookings/");

      setUsers(u.data);
      setProperties(p.data);
      setBookings(b.data);

    } catch (error) {
      console.error(error);
    }
  };

  // SECTIONS (NO FUNCTIONAL CHANGE)
  const OverviewSection = () => (
    <div className="analytics-grid">

      <div className="analytics-card">
        <h2>{data?.total_users || 0}</h2>
        <p>Total Users</p>
      </div>

      <div className="analytics-card">
        <h2>{data?.total_landlords || 0}</h2>
        <p>Landlords</p>
      </div>

      <div className="analytics-card">
        <h2>{data?.total_tenants || 0}</h2>
        <p>Tenants</p>
      </div>

      <div className="analytics-card">
        <h2>{data?.total_properties || 0}</h2>
        <p>Properties</p>
      </div>

      <div className="analytics-card">
        <h2>{data?.total_bookings || 0}</h2>
        <p>Bookings</p>
      </div>

      <div className="analytics-card">
        <h2>KES {data?.total_revenue || 0}</h2>
        <p>Revenue</p>
      </div>

    </div>
  );

  const UsersSection = () => (
    <>
      {users.map((u) => (
        <div className="admin-card" key={u.id}>
          <h3>{u.username}</h3>
          <p>{u.email}</p>
          <p>{u.role}</p>
        </div>
      ))}
    </>
  );

  const PropertiesSection = () => (
    <>
      {properties.map((p) => (
        <div className="admin-card" key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.location}</p>
          <p>{p.price}</p>
          <p>{p.status}</p>
          <p>Owner: {p.landlord}</p>
        </div>
      ))}
    </>
  );

  const BookingsSection = () => (
    <>
      {bookings.map((b) => (
        <div className="admin-card" key={b.id}>
          <h3>{b.property}</h3>
          <p>{b.tenant}</p>
          <p>{b.status}</p>
          <p>KES {b.booking_fee}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="admin-container">
      <Navbar />

      <section className="dashboard">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* =========================================
            TABS SECTION (UPDATED)
        ========================================= */}
        <div className="admin-tabs">

          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>

          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            Users
          </button>

          <button
            className={tab === "properties" ? "active" : ""}
            onClick={() => setTab("properties")}
          >
            Properties
          </button>

          <button
            className={tab === "bookings" ? "active" : ""}
            onClick={() => setTab("bookings")}
          >
            Bookings
          </button>

        </div>

        {/* =========================================
            OVERVIEW
        ========================================= */}
        {tab === "overview" && (
          <div className="analytics-grid">

            <div className="analytics-card">
              <h2>{data?.total_users || 0}</h2>
              <p>Total Users</p>
            </div>

            <div className="analytics-card">
              <h2>{data?.total_landlords || 0}</h2>
              <p>Landlords</p>
            </div>

            <div className="analytics-card">
              <h2>{data?.total_tenants || 0}</h2>
              <p>Tenants</p>
            </div>

            <div className="analytics-card">
              <h2>{data?.total_properties || 0}</h2>
              <p>Properties</p>
            </div>

            <div className="analytics-card">
              <h2>{data?.total_bookings || 0}</h2>
              <p>Bookings</p>
            </div>

            <div className="analytics-card">
              <h2>KES {data?.total_revenue || 0}</h2>
              <p>Revenue</p>
            </div>

          </div>
        )}

        {/* =========================================
            USERS (CLICKABLE + MODAL)
        ========================================= */}
        {tab === "users" && (
          <div className="admin-grid">
            {users.map((user) => (
              <div
                key={user.id}
                className="admin-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(user)}
              >
                <h3>{user.username}</h3>
                <p>{user.email}</p>
                <span>{user.role}</span>
              </div>
            ))}
          </div>
        )}
        

        {selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedUser.username}</h2>
              <p>{selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>

             <button
                onClick={() => suspendUser(selectedUser.id)}
                 style={{ background: "red", color: "white" }}
             >
                Suspend User
              </button>

              <button onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            PROPERTIES (CLICKABLE + MODAL)
        ========================================= */}
        {tab === "properties" && (
          <div className="admin-grid">
            {properties.map((property) => (
              <div
                key={property.id}
                className="admin-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedProperty(property)}
              >
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p>{property.price}</p>
                <p>{property.status}</p>
              </div>
            ))}
          </div>
        )}

        {selectedProperty && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedProperty.title}</h2>
              <p>{selectedProperty.location}</p>
              <p>Price: {selectedProperty.price}</p>
              <p>Status: {selectedProperty.status}</p>
              <p>Owner: {selectedProperty.landlord}</p>

              <button
                  onClick={() => deleteProperty(selectedProperty.id)}
                  style={{ background: "red", color: "white" }}
                >
                  Delete Property
              </button>

              <button onClick={() => setSelectedProperty(null)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            BOOKINGS (CLICKABLE + MODAL)
        ========================================= */}
        {tab === "bookings" && (
          <div className="admin-grid">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="admin-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedBooking(booking)}
              >
                <p>Tenant: {booking.tenant}</p>
                <p>Status: {booking.status}</p>
                <p>Fee: KES {booking.booking_fee}</p>
              </div>
            ))}
          </div>
        )}

        {selectedBooking && (
          <div className="modal">
            <div className="modal-content">
              <h2>Booking Details</h2>

              <p>Status: {selectedBooking.status}</p>
              <p>Fee: KES {selectedBooking.booking_fee}</p>
              <p>Tenant: {selectedBooking.tenant}</p>
              <p>Property: {selectedBooking.property}</p>

              <button
                    onClick={() => adminApproveBooking(selectedBooking.id)}
                >
                    Approve Booking
                </button>

              <button onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default AdminDashboard;