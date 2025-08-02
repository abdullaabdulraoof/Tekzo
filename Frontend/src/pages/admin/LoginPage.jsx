import React from 'react'
import { Login } from '../../Admin/fetures/auth/Login'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'

export const LoginPage = () => {
  return (
    <>
      <Navbar />
      <Login />
      <Footer />
    </>
  )
}
