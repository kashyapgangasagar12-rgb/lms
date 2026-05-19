import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : (user.role === 'STUDENT' ? '/dashboard' : '/teacher')} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      const role = res?.data?.role
      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else navigate(role === 'STUDENT' ? '/dashboard' : '/teacher', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('Network error: Backend server is unreachable. Check if Spring Boot is running on port 8080.')
        return
      }
      const data = err.response?.data
      setError(data?.error || data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: 'var(--bg-off-white)' }}>
      <div className="card shadow border-0 animate-fade-in" style={{ maxWidth: 420, width: '100%', borderRadius: '0.8rem' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none h2 fw-bold" style={{ color: 'var(--color-primary)' }}>LMS</Link>
            <div className="text-muted extra-small text-uppercase mb-4" style={{ letterSpacing: '2px' }}>Elevate Your Learning</div>
            <h1 className="h3 fw-bold mb-2">Log in to your account</h1>
            <p className="text-muted small">Welcome back! Enter your credentials below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <div className="text-end mt-2">
                <Link to="/forgot-password" className="text-decoration-none small fw-bold" style={{ color: 'var(--color-primary)' }}>Forgot Password?</Link>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-4">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-udemy-primary btn-lg w-100 mb-3" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : 'Log In'}
            </button>
          </form>

          <div className="text-center pt-3 border-top">
            <p className="text-muted small mb-0">
              Don't have an account? <Link to="/register" className="fw-bold text-decoration-none" style={{ color: 'var(--color-primary)' }}>Sign up</Link>
            </p>
            <div className="mt-3">
                <Link to="/" className="text-decoration-none text-muted extra-small hover-opacity-100 d-flex align-items-center justify-content-center gap-1">
                    <span>←</span> Back to Home
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
