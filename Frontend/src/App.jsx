import './App.css'
import { Routes,Route } from 'react-router-dom'
import UserRouter from './routes/UserRouter'
import AdminRouter  from './routes/AdminRouter'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://tekzo.onrender.com/api/ping");
    }, 300000); // every 5 minutes
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
