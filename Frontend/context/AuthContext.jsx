import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

    const refreshToken = async () => {
        try {
            const res = await api.post("/refresh", {}, { withCredentials: true });
            setAccessToken(res.data.accessToken);
            localStorage.setItem("accessToken", res.data.accessToken); // keep in sync
        } catch {
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem("accessToken");
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

