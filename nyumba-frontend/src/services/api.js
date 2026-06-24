import axios from "axios";


// =========================================
// API INSTANCE
// =========================================
const API = axios.create({

  baseURL: "http://127.0.0.1:8000/api/",
});


// =========================================
// REQUEST INTERCEPTOR
// =========================================
API.interceptors.request.use(

  (req) => {

    const token =
      localStorage.getItem("access");

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  }
);


// =========================================
// RESPONSE INTERCEPTOR
// AUTO REFRESH TOKEN
// =========================================
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // TOKEN EXPIRED
    if (

      error.response?.status === 401 &&

      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refresh =
          localStorage.getItem("refresh");

        // REQUEST NEW TOKEN
        const response = await axios.post(

          "http://127.0.0.1:8000/api/auth/login/refresh/",

          {
            refresh,
          }
        );

        const newAccess =
          response.data.access;

        // SAVE NEW TOKEN
        localStorage.setItem(
          "access",
          newAccess
        );

        // UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        // RETRY REQUEST
        return API(originalRequest);

      } catch (refreshError) {

        console.error(refreshError);

        // FORCE LOGOUT
        localStorage.clear();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default API;


// =========================================
// GET PROPERTIES
// =========================================
export const getProperties = async () => {

  const response =
    await API.get("properties/");

  return response.data;
};


// =========================================
// GET SINGLE PROPERTY
// =========================================
export const getProperty = async (id) => {

  const response =
    await API.get(
      `properties/${id}/`
    );

  return response.data;
};


// =========================================
// CREATE BOOKING
// =========================================
export const createBooking = async (
  bookingData
) => {

  const response = await API.post(

    "bookings/",

    bookingData
  );

  return response.data;
};


// =========================================
// GET BOOKINGS
// =========================================
export const getBookings = async () => {

  const response =
    await API.get("bookings/");

  return (
    response.data.results ||
    response.data
  );
};


// =========================================
// APPROVE BOOKING
// =========================================
export const approveBooking = async (
  bookingId
) => {

  const response = await API.post(

    "bookings/approve-booking/",

    {
      booking: bookingId,
    }
  );

  return response.data;
};


// =========================================
// CANCEL BOOKING
// =========================================
export const cancelBooking = async (
  bookingId
) => {

  const response = await API.post(

    "bookings/cancel-booking/",

    {
      booking: bookingId,
    }
  );

  return response.data;
};

// DELETE PROPERTY
export const deleteProperty = async (id) => {

  const response = await API.delete(
    `properties/${id}/`
  );

  return response.data;
};

// MARK VACANT
export const markVacant = async (id) => {

  const response = await API.post(
    `properties/${id}/mark_vacant/`
  );

  return response.data;
};


// MARK OCCUPIED
export const markOccupied = async (id) => {

  const response = await API.post(
    `properties/${id}/mark_occupied/`
  );

  return response.data;
};

// LANDLORD ANALYTICS
export const getLandlordAnalytics =
  async () => {

    const response = await API.get(
      "analytics/landlord/"
    );

    return response.data;
};


// TENANT ANALYTICS
export const getTenantAnalytics =
  async () => {

    const response = await API.get(
      "analytics/tenant/"
    );

    return response.data;
};

// Get report data
export const getReport = async () => {

  const response =
    await API.get(
      "reports/"
    );

  return response.data;
};

// GET PROFILE
export const getProfile =
  async () => {

    const response =
      await API.get(
        "auth/profile/"
      );

    return response.data;
};

// UPDATE PROFILE
export const updateProfile =
  async (profileData) => {

    const response =
      await API.patch(
        "auth/profile/",
        profileData
      );

    return response.data;
};

// =========================================
// NOTIFICATIONS
// =========================================
export const getNotifications = async () => {

  const response = await API.get(
    "notifications/"
  );

  console.log(
    "Notifications API:",
    response.data
  );

  return response.data;
};

export const markNotificationsRead =
  async () => {

    const response =
      await API.post(
        "notifications/mark-read/"
      );

    return response.data;
  };


// =========================================
// INQUIRIES
// =========================================

export const getInquiries = async () => {

  const response = await API.get(
    "inquiries/"
  );

  return (
    response.data.results ||
    response.data
  );
};

export const createInquiry = async (
  inquiryData
) => {

  const response = await API.post(
    "inquiries/",
    inquiryData
  );

  return response.data;
};

export const replyInquiry = async (
  inquiry,
  reply
) => {

  const response = await API.post(
    "inquiries/reply/",
    {
      inquiry,
      reply,
    }
  );

  return response.data;
};