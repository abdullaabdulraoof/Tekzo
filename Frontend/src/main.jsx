import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- import this
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> {/* <-- wrap your app */}
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
