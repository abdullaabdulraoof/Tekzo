// pages/user/api.js
import axios from "axios";
import { API_URL } from "../../config/apiConfig";

export const googleAuth = (code) => {
    return axios.get(`${API_URL}/api/google?code=${code}`);
};
