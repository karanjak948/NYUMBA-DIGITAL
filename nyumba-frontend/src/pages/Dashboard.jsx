import Navbar from "../components/Navbar";

function UserMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <span className="fw-semibold">Welcome</span>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3>My Dashboard</h3>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-3">
              <h5>Bookings</h5>
              <p>2 Active</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h5>Payments</h5>
              <p>KES 50,000</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;