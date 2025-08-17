import React from 'react'
import { Login } from '../../User/features/auth/Login'
import { Navbar } from '../../User/components/Navbar'
import { Footer } from '../../User/components/Footer'

export const LoginPage = () => {
  return (
    <>
      <Navbar />
      <Login />
      <Footer />
    </>
  )
}
