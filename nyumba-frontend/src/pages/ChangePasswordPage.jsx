import { useState } from "react";

import Navbar from "../components/layout/Navbar";

import API from "../services/api";

import "../styles/form.css";

function ChangePasswordPage() {

  const [formData, setFormData] =
    useState({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      alert(
        "Passwords do not match"
      );

      return;
    }

    try {

      await API.post(
        "auth/change-password/",
        {
          old_password:
            formData.old_password,

          new_password:
            formData.new_password,
        }
      );

      alert(
        "Password changed successfully"
      );

      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Password change failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-page">

        <form
          className="custom-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Change Password
          </h2>

          <input
            type="password"
            name="old_password"
            placeholder="Current Password"
            value={
              formData.old_password
            }
            onChange={handleChange}
          />

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={
              formData.new_password
            }
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={
              formData.confirm_password
            }
            onChange={handleChange}
          />

          <button type="submit">
            Change Password
          </button>

        </form>

      </div>
    </>
  );
}

export default ChangePasswordPage;