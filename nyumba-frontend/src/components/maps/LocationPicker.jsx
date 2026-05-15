import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// =========================================
// LOCATION MARKER
// =========================================
function LocationMarker({
  position,
  setPosition,
  setLatitude,
  setLongitude,
  setLocation,
}) {

  useMapEvents({

    async click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      setLatitude(lat);
      setLongitude(lng);

      // REVERSE GEOCODING
      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await response.json();

        setLocation(
          data.display_name || ""
        );

      } catch (error) {

        console.error(error);
      }
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}


// =========================================
// MAP CONTROLLER
// =========================================
function ChangeMapView({ center }) {

  const map = useMap();

  map.setView(center, 15);

  return null;
}


// =========================================
// MAIN COMPONENT
// =========================================
function LocationPicker({
  formData,
  setFormData,
}) {

  const [search, setSearch] = useState("");

  const [position, setPosition] = useState(

    formData.latitude &&
    formData.longitude

      ? [
          formData.latitude,
          formData.longitude,
        ]

      : [-1.286389, 36.817223]
  );

  // =========================================
  // SEARCH LOCATION
  // =========================================
  const handleSearch = async () => {

    if (!search) return;

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );

      const data = await response.json();

      if (data.length > 0) {

        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setPosition([lat, lng]);

        setFormData({
          ...formData,
          latitude: lat,
          longitude: lng,
          location: data[0].display_name,
        });
      }

    } catch (error) {

      console.error(error);
    }
  };

  // =========================================
  // USE CURRENT LOCATION
  // =========================================
  const useCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(

      async (positionData) => {

        const lat = positionData.coords.latitude;
        const lng = positionData.coords.longitude;

        setPosition([lat, lng]);

        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data = await response.json();

          setFormData({
            ...formData,
            latitude: lat,
            longitude: lng,
            location: data.display_name,
          });

        } catch (error) {

          console.error(error);
        }
      }
    );
  };

  return (

    <div>

      {/* SEARCH BAR */}
      <div className="map-search">

        <input
          type="text"
          placeholder="Search location e.g Roysambu"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>

        <button
          type="button"
          onClick={useCurrentLocation}
        >
          Use My Location
        </button>

      </div>

      {/* MAP */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "20px",
          marginTop: "20px",
        }}
      >

        <ChangeMapView center={position} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          setLatitude={(value) =>
            setFormData({
              ...formData,
              latitude: value,
            })
          }
          setLongitude={(value) =>
            setFormData({
              ...formData,
              longitude: value,
            })
          }
          setLocation={(value) =>
            setFormData({
              ...formData,
              location: value,
            })
          }
        />

      </MapContainer>

    </div>
  );
}

export default LocationPicker;