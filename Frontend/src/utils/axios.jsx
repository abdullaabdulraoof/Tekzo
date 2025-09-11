// src/utils/axios.js
import axios from "axios";
import { refreshToken } from "./auth"; // implement refresh logic

const api = axios.create({
    baseURL: "https://tekzo.onrender.com/api",
    withCredentials: true,
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor → handle 401
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            try {
                await refreshToken(); // get new accessToken from backend
            } catch (refreshErr) {
                console.error("Token refresh failed:", refreshErr);
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export default api;
