import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import { registerUser } from "../services/auth";

import "../styles/landing.css";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "tenant",
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

      await registerUser(formData);

      alert(
        "Registration successful"
      );

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(
        JSON.stringify(
          error.response?.data
        )
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

          <h2>Create Account</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <select
            name="role"
            onChange={handleChange}
          >

            <option value="tenant">
              Tenant
            </option>

            <option value="landlord">
              Landlord
            </option>

          </select>

          <button type="submit">
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default RegisterPage;