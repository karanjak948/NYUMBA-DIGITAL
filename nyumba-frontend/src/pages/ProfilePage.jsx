import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";

import {
  getProfile,
  updateProfile,
} from "../services/api";

import "../styles/profile.css";

function ProfilePage() {

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    date_joined: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================
  // FETCH PROFILE
  // =========================================
  const fetchProfile = async () => {

    try {

      const data = await getProfile();

      setProfile(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // HANDLE SUBMIT
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const updatedProfile =
        await updateProfile({
          email: profile.email,
          phone: profile.phone,
        });

      setProfile(updatedProfile);

      localStorage.setItem(
        "email",
        updatedProfile.email
      );

      alert(
        "Profile updated successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update profile"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-container">

          {/* =========================================
              LEFT SIDEBAR
          ========================================= */}
          <div className="profile-sidebar">

            {/* PROFILE AVATAR */}
            {profile.avatar ? (

              <img
                src={profile.avatar}
                alt="Avatar"
                className="profile-image"
              />

            ) : (

              <div className="avatar-circle">

                {profile?.username
                  ?.charAt(0)
                  ?.toUpperCase()}

              </div>

            )}

            <h2>
              {profile?.username}
            </h2>

            <span className="role-badge">
              {profile?.role}
            </span>

            <div className="profile-info">

              <div className="info-item">
                <strong>Email</strong>
                <p>{profile?.email}</p>
              </div>

              <div className="info-item">
                <strong>Phone</strong>
                <p>
                  {profile?.phone ||
                    "Not provided"}
                </p>
              </div>

              <div className="info-item">
                <strong>Account Type</strong>
                <p>{profile?.role}</p>
              </div>

              <div className="info-item">
                <strong>Member Since</strong>

                <p>
                  {profile?.date_joined
                    ? new Date(
                        profile.date_joined
                      ).toLocaleDateString()
                    : "Loading..."}
                </p>
              </div>

            </div>

          </div>

          {/* =========================================
              RIGHT CONTENT
          ========================================= */}
          <div className="profile-main">

            <div className="profile-header">

              <h1>
                Welcome
                {" "}
                {profile?.username}
              </h1>

              <p>
                Manage your account
                information and keep
                your profile updated.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <label>
                Username
              </label>

              <input
                type="text"
                value={profile.username}
                disabled
              />

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />

              <label>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="save-btn"
              >
                Save Changes
              </button>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}

export default ProfilePage;