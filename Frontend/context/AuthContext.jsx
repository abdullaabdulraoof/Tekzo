import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    // Auto-refresh access token
    const refreshToken = async () => {
        try {
            const res = await axios.post("/api/refresh", {}, { withCredentials: true });
            setAccessToken(res.data.accessToken);
        } catch {
            setUser(null);
            setAccessToken(null);
        }
    };

    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};
