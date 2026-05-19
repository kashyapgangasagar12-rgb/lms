import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate(user.role === 'STUDENT' ? '/dashboard' : '/teacher', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ email, password, fullName, role })
      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else navigate(role === 'STUDENT' ? '/dashboard' : '/teacher', { replace: true })
    } catch (err) {
      if (!err.response) {
        setError('Network error: Backend server is unreachable. Please ensure your backend is running on http://localhost:8080 and that your VS Code / Intel setup has correctly configured the proxy in vite.config.js.')
        return
      }
      const data = err.response?.data
      if (data && typeof data === 'object' && !data.error) {
        // Handle Map of field errors (e.g. { "password": "too short" })
        const firstError = Object.values(data)[0]
        setError(firstError || 'Registration failed. Please check your inputs.')
      } else {
        setError(data?.error || data?.message || 'Registration failed. Backend returned error.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: 'var(--bg-off-white)' }}>
      <div className="card shadow border-0 animate-fade-in" style={{ maxWidth: 480, width: '100%', borderRadius: '0.8rem' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none h2 fw-bold" style={{ color: 'var(--color-primary)' }}>LMS</Link>
            <div className="text-muted extra-small text-uppercase mb-4" style={{ letterSpacing: '2px' }}>Elevate Your Learning</div>
            <h1 className="h3 fw-bold mb-2">Create your account</h1>
            <p className="text-muted small">Sign up and start learning today.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Username"
              />
            </div>
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
            <div className="row g-3 mb-4">
              <div className="col-md-7">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>
              <div className="col-md-5">
                <label className="form-label small fw-bold">I am a</label>
                <select
                  className="form-select form-select-lg"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">Learner</option>
                  <option value="TEACHER">Instructor</option>
                </select>
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
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="text-center pt-3 border-top">
            <p className="text-muted small mb-0">
              Already have an account? <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--color-primary)' }}>Log in</Link>
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
