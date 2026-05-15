import { Link } from "react-router-dom";

import "../../styles/property.css";

function PropertyCard({ property }) {
  return (
    <div className="property-card">

      <img
        src={property.image}
        alt={property.title}
      />

      <div className="property-content">

        <h3>{property.title}</h3>

        <p className="location">
          {property.location}
        </p>

        <div className="property-details">

          <span>{property.bedrooms} Bedrooms</span>

          <span>{property.bathrooms} Bathrooms</span>

        </div>

        <h2>KES {property.price.toLocaleString()}</h2>

        <Link
          to={`/property/${property.id}`}
          className="view-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default PropertyCard;