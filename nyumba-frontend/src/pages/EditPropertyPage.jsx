import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import API, {
  getProperty,
} from "../services/api";

import "../styles/form.css";

function EditPropertyPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "",
    status: "",
  });

  // 🔥 KEEP NULL
  const [image, setImage] =
    useState(null);

  useEffect(() => {

    fetchProperty();

  }, []);

  // =========================================
  // FETCH PROPERTY
  // =========================================
  const fetchProperty = async () => {

    try {

      const data =
        await getProperty(id);

      setFormData(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
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

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {

          data.append(
            key,
            formData[key]
          );
        }
      );

      // 🔥 ONLY APPEND IF REAL FILE
      if (image instanceof File) {

        data.append(
          "image",
          image
        );
      }

      // 🔥 PATCH REQUEST
      await API.patch(
        `properties/${id}/`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Property updated successfully"
      );

      navigate(
        "/landlord/dashboard"
      );

    } catch (error) {

      console.log(
        error.response?.data
      );

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

      <div className="form-page">

        <form
          className="custom-form"
          onSubmit={handleSubmit}
        >

          <h2>
            Edit Property
          </h2>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            value={
              formData.location
            }
            onChange={handleChange}
          />

          <select
            name="property_type"
            value={
              formData.property_type
            }
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

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >

            <option value="available">
              Available
            </option>

            <option value="booked">
              Booked
            </option>

            <option value="occupied">
              Occupied
            </option>

          </select>

          <input
            type="file"
            onChange={handleImage}
          />

          <button type="submit">
            Update Property
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditPropertyPage;