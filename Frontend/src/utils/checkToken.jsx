// utils/checkToken.js
import { jwtDecode } from "jwt-decode";  // ✅ correct for v4+


export const isTokenValid = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token); // ✅
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (err) {
        return false;
    }
};
