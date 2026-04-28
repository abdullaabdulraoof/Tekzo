import './App.css'
import { Routes,Route } from 'react-router-dom'
import UserRouter from './routes/UserRouter'
import AdminRouter  from './routes/AdminRouter'
import { useEffect } from 'react'
import { API_URL } from './config/apiConfig'

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/api/ping`);
    }, 300000); 
    return () => clearInterval(interval);
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
