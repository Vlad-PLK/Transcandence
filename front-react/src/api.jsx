import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// baseURL: "https://localhost:1443/"
// baseURL: "http://localhost:8000/"
const api = axios.create({
  baseURL: "https://"+window.location.host+"/"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;