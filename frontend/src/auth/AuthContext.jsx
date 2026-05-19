import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getMe()
        .then((res) => {
          setUser({ ...res.data, token })
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    const { token, ...userData } = res.data
    localStorage.setItem('token', token)
    setUser({ ...userData, token })
    return res
  }

  const register = async (data) => {
    const res = await authService.register(data)
    // We don't set user/token yet because they need to verify OTP
    return res
  }

  const verifyOtp = async (email, otp) => {
    const res = await authService.verifyOtp(email, otp)
    const { token, ...userData } = res.data
    localStorage.setItem('token', token)
    setUser({ ...userData, token })
    return res
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
