import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import PropertyCard from "../components/property/PropertyCard";

import { getProperties } from "../services/api";

import "../styles/property.css";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();

      setProperties(data.results || data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter properties by location
  const filteredProperties = properties.filter(
    (property) =>
      property.location
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <section className="properties-page">
        <div className="page-title">
          <h1>Available Properties</h1>

          <p>
            Browse houses available across Nairobi
          </p>
        </div>

        {/* Search Filter */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PropertiesPage;