import React from 'react'
import { Login } from '../../User/features/auth/Login'
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
