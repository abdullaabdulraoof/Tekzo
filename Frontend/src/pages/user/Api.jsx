import React from 'react'
import axios from 'axios'

const api = axios.create({
    baseURL:'https://tekzo.onrender.com/api'
})
export const googleAuth = (code) => api.get(`/google?code=${code}`)
