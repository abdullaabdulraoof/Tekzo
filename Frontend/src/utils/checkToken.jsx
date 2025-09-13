import jwtDecode from "jwt-decode";

export const isTokenValid = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token); // `exp` is in seconds
        if (Date.now() >= exp * 1000) {
            localStorage.removeItem("userToken"); // clear expired token
            return false;
        }
        return true;
    } catch (err) {
        return false; // invalid token
    }
};
