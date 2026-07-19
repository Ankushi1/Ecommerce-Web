import axios from "axios";

// ✅ BASE URL (Render backend)
const BASE_URL = "https://ecommerce-web-1-25wp.onrender.com";

// ✅ Create axios instance
const API = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global errors (optional but powerful)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - Please login again");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;