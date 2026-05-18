import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("Error API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);