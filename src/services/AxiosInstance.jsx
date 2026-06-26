import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://workforce-server.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // get token from localStorage
    const token = localStorage.getItem("token");

    // send token in header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;