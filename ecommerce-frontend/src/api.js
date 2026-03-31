import axios from "axios";

// ✅ Create axios instance
const API = axios.create({
  baseURL: "https://ecommerce-web-qkbn.onrender.com", // Render backend URL
});

// ✅ Automatically attach token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;