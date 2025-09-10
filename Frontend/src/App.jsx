import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserRouter from './routes/UserRouter';
import AdminRouter from './routes/AdminRouter';
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/*" element={<UserRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
