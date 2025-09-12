// utils/checkToken.js
import jwtDecode from "jwt-decode";  // ✅ works with v3.1.2

export const isTokenValid = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (err) {
        return false;
    }
};
