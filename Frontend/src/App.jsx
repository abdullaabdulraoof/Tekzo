import './App.css'
import { Routes,Route } from 'react-router-dom'
import UserRouter from './routes/UserRouter'
import AdminRouter  from './routes/AdminRouter'
import axios from "axios";
import { useEffect } from "react";


function App() {
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401) {
          await refreshToken();
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return (
    <>
    <Routes>
        <Route path='/*' element={<UserRouter />}/> 
        <Route path='/admin/*' element={<AdminRouter />} />    
    </Routes>
    </>
  )
}

export default App
