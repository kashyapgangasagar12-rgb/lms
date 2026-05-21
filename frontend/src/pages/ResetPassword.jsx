import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = location.state?.email || ''

  const [form, setForm] = useState({
    email: initialEmail,
    token: '', // this is the OTP/verification code
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await api.post('/auth/reset-password', { 
        email: form.email,
        token: form.token, 
        newPassword: form.newPassword 
      })
      setMessage(res.data.message)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-off-white px-3">
      <div className="card shadow-lg border-0 animate-fade-in" style={{ maxWidth: '450px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none h2 fw-bold" style={{ color: 'var(--color-primary)' }}>LMS</Link>
            <div className="text-muted extra-small text-uppercase mb-4" style={{ letterSpacing: '2px' }}>Elevate Your Learning</div>
            <h3 className="fw-bold mt-3 mb-1">Set New Password</h3>
            <p className="text-muted small">Enter the 6-digit code sent to your email and choose a strong password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-gray small fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control py-2 shadow-sm border-0 bg-off-white"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!!initialEmail}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-gray small fw-bold">Verification Code (OTP)</label>
              <input
                type="text"
                maxLength={6}
                className="form-control py-2 shadow-sm border-0 bg-off-white font-monospace text-center fs-4"
                placeholder="000000"
                style={{ letterSpacing: '8px' }}
                required
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-gray small fw-bold">New Password</label>
              <input
                type="password"
                className="form-control py-2 shadow-sm border-0 bg-off-white"
                placeholder="••••••••"
                required
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-gray small fw-bold">Confirm New Password</label>
              <input
                type="password"
                className="form-control py-2 shadow-sm border-0 bg-off-white"
                placeholder="••••••••"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            {error && <div className="alert alert-danger py-2 small border-0 mb-4">{error}</div>}
            {message && <div className="alert alert-success py-2 small border-0 mb-4">{message}</div>}

            <button
              type="submit"
              className="btn btn-udemy-primary w-100 py-2 fw-bold shadow-sm"
              disabled={loading}
              style={{ borderRadius: '4px' }}
            >
              {loading ? 'Changing Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="text-decoration-none text-muted small hover-opacity-100">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
