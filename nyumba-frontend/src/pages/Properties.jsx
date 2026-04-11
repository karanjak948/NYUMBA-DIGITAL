import { useEffect, useState } from "react";
import { getProperties } from "../services/api";
import PropertyCard from "../components/PropertyCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

/* ========================= */
/* 🔥 HEADER COMPONENT */
/* ========================= */
function PropertiesHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2>Available Properties</h2>

      {/* <button
        className="btn btn-outline-danger"
        onClick={handleLogout}
      >
        Logout
      </button> */}
    </div>
  );
}

/* ========================= */
/* 🔥 MAIN PAGE */
/* ========================= */
function Properties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();

      console.log("API DATA:", data); // 🔥 DEBUG
      setProperties(data.results);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        {/* 🔥 USE HEADER HERE */}
        <PropertiesHeader />

        <div className="row">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div className="col-md-4 mb-4" key={property.id}>
                <PropertyCard property={property} />
              </div>
            ))
          ) : (
            <p>Loading properties...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Properties;