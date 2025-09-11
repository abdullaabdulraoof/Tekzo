import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "../context/CartContext.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";   // ✅ import
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="462576015706-r4o1bb51h6luatb39goilu921jbj3uvl.apps.googleusercontent.com">
      <AuthProvider>   {/* ✅ wrap here */}
        <CartProvider>
          <Router>
            <App />
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
