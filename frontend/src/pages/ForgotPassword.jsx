import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await axios.post('/api/auth/forgot-password', { email })
      setMessage(res.data.message)
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
            <h3 className="fw-bold mt-3 mb-1">Forgot Password?</h3>
            <p className="text-muted small">No worries, it happens. Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-gray small fw-bold">Email Address</label>
              <input
                type="email"
                className="form-control py-2 shadow-sm border-0 bg-off-white"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Processing...' : 'Send Reset Link'}
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
