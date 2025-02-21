import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  //   baseURL: "https://workflow-earning-platform-server.vercel.app",
  baseURL: "http://localhost:5000",

  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
