import axios from "axios";

export const refreshToken = async () => {
    const res = await axios.post(
        "https://tekzo.onrender.com/api/refresh",
        {},
        { withCredentials: true }
    );
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data.accessToken;
};
