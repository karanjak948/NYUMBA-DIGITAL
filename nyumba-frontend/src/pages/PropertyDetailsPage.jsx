import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { createInquiry } from "../services/api";

import { getProperty, createBooking, } from "../services/api";

import "../styles/property.css";

function PropertyDetailsPage() {

  const { id } = useParams();

  const [message, setMessage] = useState("");

  const [property, setProperty] = useState(null);

  // =========================================
  // FETCH PROPERTY
  // =========================================
  useEffect(() => {

    fetchProperty();

  }, [id]);

  const fetchProperty = async () => {

    try {

      const data = await getProperty(id);

      setProperty(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // BOOK PROPERTY
  // =========================================
  const handleBooking = async () => {

    try {

      await createBooking({
        property: property.id,
        booking_fee: 1000,
      });

      alert("Booking submitted successfully");

      fetchProperty();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Booking failed"
      );
    }
  };

  // Handle Inquiry
  const handleInquiry =
    async () => {

      try {

        await createInquiry({
          property: property.id,
          message,
        });

        alert(
          "Inquiry sent successfully"
        );

        setMessage("");

      } catch (error) {

        console.error(error);

        alert(
          "Failed to send inquiry"
        );
      }
  };

  // =========================================
  // LOADING STATE
  // =========================================
  if (!property) {

    return (
      <div>

        <Navbar />

        <div className="loading-state">
          <h1>Loading property...</h1>
        </div>

      </div>
    );
  }

  return (
    <div>

      <Navbar />

      <section className="property-details-page">

        {/* ========================================= */}
        {/* IMAGE GALLERY */}
        {/* ========================================= */}
        <div className="property-gallery">

          <img
            src={property.image}
            alt={property.title}
          />

        </div>

        {/* ========================================= */}
        {/* PROPERTY INFORMATION */}
        {/* ========================================= */}
        <div className="property-info">

          <h1>
            {property.title}
          </h1>

          <p className="location">
            {property.location}
          </p>

          <h2 className="price">
            KES {property.price}
          </h2>

          <div className="property-details">

            <span>
              {property.property_type}
            </span>

            <span>
              {property.status}
            </span>

          </div>

          <p className="description">
            {property.description}
          </p>

          {/* ========================================= */}
          {/* BOOKING BUTTON */}
          {/* ========================================= */}

          <div className="property-actions">

            {property.status === "available" ? (

              <button
                className="book-btn"
                onClick={handleBooking}
              >
                Book Property
              </button>

            ) : (

              <button
                className="book-btn disabled-btn"
              >
                Not Available
              </button>

            )}

            <div className="inquiry-box">

              <h3>
                Contact Landlord
              </h3>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Ask the landlord a question..."
              />

              <button
                onClick={handleInquiry}
              >
                Send Inquiry
              </button>

            </div>

          </div>
        </div>
        {/* ========================================= */}
        {/* GOOGLE MAP */}
        {/* ========================================= */}
        <div className="property-map">

          <iframe
            title="Property Location"
            width="100%"
            height="350"
            style={{
              border: 0,
              borderRadius: "20px",
            }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
          />

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default PropertyDetailsPage;