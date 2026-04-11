import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // ✅ moved here (correct place)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
        try {
            setLoading(true);

            const res = await loginUser(form);

            // 🔥 CRITICAL FIX (JWT)
            localStorage.setItem("token", res.access);
            localStorage.setItem("refresh", res.refresh);

            // 🔥 OPTIONAL ROLE (if backend sends it)
            if (res.role) {
            localStorage.setItem("role", res.role);
            }

            alert("Login successful");

            navigate("/properties");

        } catch (err) {
            console.error(err);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Login</h2>

      <input
        className="form-control mb-3"
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {/* ✅ original button kept */}
      {/* <button className="btn btn-success w-100" onClick={handleLogin}>
        Login
      </button> */}

      {/* ✅ improved button (disabled + loading) */}
      <button
        className="btn btn-success w-100 mt-2"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </div>
  );
}

export default Login;