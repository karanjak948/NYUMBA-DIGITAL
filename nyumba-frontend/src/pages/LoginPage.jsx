import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import { loginUser } from "../services/auth";

import "../styles/landing.css";

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "username",
        formData.username
      );

      localStorage.setItem(
        "username",
        data.username
      );

      alert("Login successful");

      // ROLE REDIRECT
      if (data.role === "landlord") {

        navigate("/landlord/dashboard");

      } else {

        navigate("/tenant/dashboard");
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Invalid credentials"
      );
    }
  };

  return (
    <div>

      <Navbar />

      <div className="auth-page">

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <h2>Login</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;