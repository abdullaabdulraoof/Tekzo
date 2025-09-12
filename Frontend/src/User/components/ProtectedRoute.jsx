
// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../utils/checkToken";

export default function ProtectedRoute({ children }) {
    if (!isTokenValid()) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
