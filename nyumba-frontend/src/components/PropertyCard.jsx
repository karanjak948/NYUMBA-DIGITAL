import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div
      className="property-card shadow-sm"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div style={{ position: "relative" }}>
        <img
          src={property.image || "https://via.placeholder.com/300"}
          className="property-img"
        />
        <span className="badge-available">Available</span>
      </div>

      <div className="property-info">
        <h5>{property.title}</h5>

        <p className="text-muted">
          <FaMapMarkerAlt /> {property.location}
        </p>

        <h4 className="property-price mt-2">
          KES {property.price}
        </h4>
      </div>
    </div>
  );
}

export default PropertyCard;