// pages/user/api.js
import axios from "axios";

export const googleAuth = (code) => {
    return axios.get(
        `https://tekzo.onrender.com/api/googleLogin?code=${code}`,
        { withCredentials: true }
    );
};
