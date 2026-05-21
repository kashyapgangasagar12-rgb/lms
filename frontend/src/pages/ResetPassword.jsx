import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
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
        token, 
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
      <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none h2 fw-bold" style={{ color: 'var(--color-primary)' }}>LMS</Link>
            <div className="text-muted extra-small text-uppercase mb-4" style={{ letterSpacing: '2px' }}>Elevate Your Learning</div>
            <h3 className="fw-bold mt-3 mb-1">Set New Password</h3>
            <p className="text-muted small">Choose a strong password to secure your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
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

          <div className="text-center mt-4 text-muted extra-small">
            Redirecting to login after success...
          </div>
        </div>
      </div>
    </div>
  )
}
