// utils/checkToken.js
import jwtDecode from "jwt-decode";

export const isTokenValid = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem("userToken");
            return false;
        }
        return true;
    } catch {
        return false;
    }
};
