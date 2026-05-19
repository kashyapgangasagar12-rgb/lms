import api from './api'

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const register = (data) =>
  api.post('/auth/register', data)

export const getMe = () =>
  api.get('/user/me')

export const verifyOtp = (email, otp) =>
  api.post('/auth/verify-otp', { email, otp })
