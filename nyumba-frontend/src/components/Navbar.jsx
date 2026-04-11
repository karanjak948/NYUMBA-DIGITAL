import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // 🔥 AUTH STATE
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear(); // removes token + role

    // 🔥 redirect to dashboard/home
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white px-4 py-3 shadow-sm">
      
      {/* 🔥 LOGO */}
      <Link className="navbar-brand fw-bold text-success fs-4" to="/">
        🏡 Nyumba Digital
      </Link>

      <div className="ms-auto d-flex gap-2 align-items-center">

        {/* ========================= */}
        {/* 🔴 NOT LOGGED IN */}
        {/* ========================= */}
        {!token && (
          <>
            <Link className="btn btn-light border" to="/login">
              Login
            </Link>

            <Link className="btn btn-success" to="/register">
              Register
            </Link>
          </>
        )}

        {/* ========================= */}
        {/* 🟢 LOGGED IN */}
        {/* ========================= */}
        {token && (
          <>
            {/* 🔥 COMMON */}
            <Link className="btn btn-outline-success" to="/properties">
              Properties
            </Link>

            {/* 🔥 ROLE: LANDLORD */}
            {role === "landlord" && (
              <Link className="btn btn-warning" to="/landlord-dashboard">
                Dashboard
              </Link>
            )}

            {/* 🔥 ROLE: TENANT */}
            {role === "tenant" && (
              <Link className="btn btn-outline-primary" to="/my-bookings">
                My Bookings
              </Link>
            )}

            {/* 🔥 LOGOUT */}
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;