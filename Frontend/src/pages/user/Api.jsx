// pages/user/api.js
import axios from "axios";

export const googleAuth = (code) => {
    return api.get(`/google?code=${code}`);
};
