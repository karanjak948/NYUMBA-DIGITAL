import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import LocationPicker from "../components/maps/LocationPicker";

import API from "../services/api";

import "../styles/form.css";


function AddPropertyPage() {

  const navigate = useNavigate();

  // =========================================
  // FORM STATE
  // =========================================
  const [formData, setFormData] = useState({

    title: "",
    description: "",
    price: "",
    location: "",
    latitude: "",
    longitude: "",
    property_type: "bedsitter",

  });

  // =========================================
  // IMAGE STATE
  // =========================================
  const [image, setImage] = useState(null);


  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =========================================
  // HANDLE IMAGE
  // =========================================
  const handleImage = (e) => {

    setImage(
      e.target.files[0]
    );
  };


  // =========================================
  // HANDLE SUBMIT
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      // APPEND FORM DATA
      Object.keys(formData).forEach((key) => {

        data.append(
          key,
          formData[key]
        );
      });

      // APPEND IMAGE
      if (image) {

        data.append(
          "image",
          image
        );
      }

      // SEND TO API
      await API.post(

        "properties/",

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Property added successfully"
      );

      navigate(
        "/landlord/dashboard"
      );

    } catch (error) {

      console.error(error);

      console.log(error.response.data);

      alert(
        JSON.stringify(
          error.response.data
        )
      );
    }
  };


  return (

    <div>

      <Navbar />

      <div className="form-page">

        <form
          className="custom-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Add Property
          </h2>

          {/* ========================================= */}
          {/* TITLE */}
          {/* ========================================= */}
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={formData.title}
            onChange={handleChange}
            required
          />


          {/* ========================================= */}
          {/* DESCRIPTION */}
          {/* ========================================= */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />


          {/* ========================================= */}
          {/* PRICE */}
          {/* ========================================= */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />


          {/* ========================================= */}
          {/* LOCATION */}
          {/* ========================================= */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />


          {/* ========================================= */}
          {/* LOCATION PICKER */}
          {/* ========================================= */}
          <LocationPicker
            formData={formData}
            setFormData={setFormData}
          />


          {/* ========================================= */}
          {/* COORDINATES PREVIEW */}
          {/* ========================================= */}
          <div className="coordinates-preview">

            <p>
              Latitude:
              {" "}
              {formData.latitude || "N/A"}
            </p>

            <p>
              Longitude:
              {" "}
              {formData.longitude || "N/A"}
            </p>

          </div>


          {/* ========================================= */}
          {/* PROPERTY TYPE */}
          {/* ========================================= */}
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
          >

            <option value="bedsitter">
              Bedsitter
            </option>

            <option value="1br">
              1 Bedroom
            </option>

            <option value="2br">
              2 Bedroom
            </option>

            <option value="3br">
              3 Bedroom
            </option>

          </select>


          {/* ========================================= */}
          {/* IMAGE */}
          {/* ========================================= */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />


          {/* ========================================= */}
          {/* SUBMIT BUTTON */}
          {/* ========================================= */}
          <button type="submit">

            Add Property

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddPropertyPage;