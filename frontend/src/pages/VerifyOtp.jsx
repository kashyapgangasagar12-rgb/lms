import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  const { verifyOtp, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const email = location.state?.email
  const pendingRole = location.state?.role

  // If already logged in, go to dashboard
  useEffect(() => {
    if (user) {
      navigate(user.role === 'STUDENT' ? '/dashboard' : '/teacher', { replace: true })
    }
  }, [user, navigate])

  // If no email in state (they accessed /verify-otp directly instead of from register), send back to register
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true })
    }
  }, [email, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(email, otp)
      setSuccessMsg('Email verified successfully! Redirecting...')
      // Give them a brief moment to see success, though AuthContext might auto-trigger navigate via user change
      setTimeout(() => {
        if (pendingRole === 'ADMIN') navigate('/admin', { replace: true })
        else navigate(pendingRole === 'STUDENT' ? '/dashboard' : '/teacher', { replace: true })
      }, 1000)
    } catch (err) {
      const data = err.response?.data
      setError(data?.error || data?.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!email) return null

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: 'var(--bg-off-white)' }}>
      <div className="card shadow border-0 animate-fade-in" style={{ maxWidth: 480, width: '100%', borderRadius: '0.8rem' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="text-muted extra-small text-uppercase mb-2" style={{ letterSpacing: '2px' }}>Verification</div>
            <h1 className="h3 fw-bold mb-3">Check your email</h1>
            <p className="text-muted small">
              We've sent a 6-digit one-time password to <br/>
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-center d-block">Enter your 6-digit OTP</label>
              <input
                type="text"
                className="form-control form-control-lg text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="000000"
                maxLength={6}
                style={{ letterSpacing: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-4">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="alert alert-success py-2 px-3 small mb-4">
                {successMsg}
              </div>
            )}

            <button type="submit" className="btn btn-udemy-primary btn-lg w-100 mb-3" disabled={loading || otp.length < 6}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : 'Verify Email'}
            </button>
          </form>

          <div className="text-center pt-3 border-top mt-4">
            <p className="text-muted small mb-0">
              Didn't receive the email? Check your spam folder.
            </p>
            <div className="mt-3">
                <Link to="/register" className="text-decoration-none text-muted extra-small hover-opacity-100 d-flex align-items-center justify-content-center gap-1">
                    <span>←</span> Use a different email
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
