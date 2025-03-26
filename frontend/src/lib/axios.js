import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // ✅ Ensures cookies are sent & received
  headers: {
    "Content-Type": "application/json",
  },
});