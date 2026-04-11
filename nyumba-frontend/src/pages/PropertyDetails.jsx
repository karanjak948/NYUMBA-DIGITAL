import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../services/api";
import Navbar from "../components/Navbar";
import { createBooking } from "../services/api";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const handleBooking = async () => {
    try {
        const res = await createBooking(id);
        alert("Booking successful!");
        console.log(res);
    } catch (error) {
        console.error(error);
        alert("Booking failed. Login required.");
    }
  };

  if (!property) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="row">
          
          {/* IMAGE */}
          <div className="col-md-6">
            <img
                src={property.image || "https://via.placeholder.com/300"}
                className="img-fluid rounded"
            />
          </div>

          {/* DETAILS */}
          <div className="col-md-6">
            <h2>{property.title}</h2>

            <p className="text-muted">{property.location}</p>

            <h4 className="text-success">
              KES {property.price}
            </h4>

            <p className="mt-3">
              {property.description}
            </p>

            {/* 🔥 BOOK BUTTON (NEXT STEP) */}
            <button className="btn btn-success mt-2 w-100" onClick={handleBooking}>
              Book Now
            </button>

            {/* 🔥 MAP */}
            <a
              href={property.map_url}
              target="_blank"
              className="btn btn-outline-dark mt-2 w-100"
            >
              View on Map
            </a>
          </div>

        </div>
      </div>
    </>
  );
}

export default PropertyDetails;