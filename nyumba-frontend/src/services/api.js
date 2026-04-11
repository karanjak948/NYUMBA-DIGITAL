import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// 🔥 FETCH ALL PROPERTIES
export const getProperties = async () => {
  const response = await API.get("properties/");
  return response.data;
};

// 🔥 FETCH SINGLE PROPERTY
export const getPropertyById = async (id) => {
  const response = await API.get(`properties/${id}/`);
  return response.data;
};

export const createBooking = async (propertyId) => {
  const response = await API.post("bookings/", {
    property: propertyId,
  });
  return response.data;
};

export const approveBooking = async (bookingId) => {
  const res = await API.post("approve-booking/", {
    booking: bookingId,
  });
  return res.data;
};

export const registerUser = async (data) => {
  const response = await API.post("users/register/", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("users/login/", data);
  return response.data;
};



