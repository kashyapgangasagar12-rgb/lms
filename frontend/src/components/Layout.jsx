import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useEffect, useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className={`navbar navbar-expand-lg navbar-dark sticky-top transition-all py-3 ${isScrolled ? 'scrolled shadow-lg' : 'bg-transparent'}`} style={{ zIndex: 1100 }}>
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold text-dark fs-3 d-flex align-items-center gap-2">
            <span className="text-primary" style={{ color: 'var(--color-primary)' }}>LMS</span>
            <div className="vr d-none d-sm-block ms-2 opacity-25" style={{ height: '1.5rem' }}></div>
            <span className="navbar-tagline d-none d-sm-block text-muted fw-normal" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
              Elevate Your Learning
            </span>
          </Link>

          <div className="search-bar-container d-none d-xl-block">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search for anything" 
            />
          </div>

          <button className="navbar-toggler border-0 shadow-none text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" style={{ filter: 'invert(0)' }}></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
              <li className="nav-item">
                <Link to="/" className={`nav-link px-3 ${location.pathname === '/' ? 'text-primary fw-bold' : 'text-dark'}`}>Home</Link>
              </li>

              {user?.role === 'STUDENT' && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'text-primary fw-bold' : 'text-dark'}`}>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/courses" className={`nav-link px-3 ${location.pathname.startsWith('/courses') ? 'text-primary fw-bold' : 'text-dark'}`}>My Learning</Link>
                  </li>
                </>
              )}

              {user?.role === 'TEACHER' && (
                <>
                  <li className="nav-item">
                    <Link to="/teacher" className={`nav-link px-3 ${location.pathname === '/teacher' ? 'text-primary fw-bold' : 'text-dark'}`}>Instructor Hub</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/manage-courses" className={`nav-link px-3 ${location.pathname === '/manage-courses' ? 'text-primary fw-bold' : 'text-dark'}`}>Course Builder</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/manage-assignments" className={`nav-link px-3 ${location.pathname === '/manage-assignments' ? 'text-primary fw-bold' : 'text-dark'}`}>Grading</Link>
                  </li>
                </>
              )}

               {user?.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <Link to="/admin" className={`nav-link px-3 ${location.pathname === '/admin' ? 'text-primary fw-bold' : 'text-dark'}`}>Admin Control</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/manage-courses" className={`nav-link px-3 ${location.pathname === '/manage-courses' ? 'text-primary fw-bold' : 'text-dark'}`}>Course Builder</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/teacher" className={`nav-link px-3 ${location.pathname === '/teacher' ? 'text-primary fw-bold' : 'text-dark'}`}>Instructor Hub</Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="text-end d-none d-md-block">
                    <div className="text-dark small fw-bold mb-0">{user.fullName}</div>
                    <div className="extra-small text-muted text-uppercase">{user.role}</div>
                  </div>
                  <button type="button" className="btn btn-udemy-secondary btn-sm" onClick={handleLogout}>Log Out</button>
                </div>
              ) : (
                <div className="d-flex gap-2 align-items-center">
                  <Link to="/login" className="btn btn-udemy-secondary btn-sm">Log In</Link>
                  <Link to="/register" className="btn btn-udemy-primary btn-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="footer-premium bg-footer text-white pt-5 pb-4 mt-auto border-top border-secondary" style={{ borderTop: '4px solid var(--color-primary) !important' }}>
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="mb-4">
                <span className="fw-bold h3 m-0 text-white">LMS</span>
                <div className="text-secondary small mt-1" style={{ letterSpacing: '1px', opacity: '0.9' }}>Elevate Your Learning Platform</div>
              </div>
              <p className="text-white-50 small mb-4 pr-lg-5" style={{ opacity: '0.8' }}>
                Start your journey into professional learning. We provide the tools you need to build your skills and master new technologies.
              </p>
              <div className="d-flex gap-3">
                <span className="bg-dark p-2 rounded-circle text-white cursor-pointer hover-opacity-100" title="Twitter" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>𝕏</span>
                <span className="bg-dark p-2 rounded-circle text-white cursor-pointer hover-opacity-100" title="LinkedIn" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>in</span>
                <span className="bg-dark p-2 rounded-circle text-white cursor-pointer hover-opacity-100" title="YouTube" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>yt</span>
                <span className="bg-dark p-2 rounded-circle text-white cursor-pointer hover-opacity-100" title="Instagram" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>ig</span>
              </div>
            </div>
            
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3 text-white">Explore</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><Link to="/courses" className="text-white text-decoration-none small opacity-75 hover-opacity-100 d-inline-block">Browse Courses</Link></li>
                {!user ? (
                  <>
                    <li className="mb-2"><Link to="/login" className="text-white text-decoration-none small opacity-75 hover-opacity-100 d-inline-block">Sign In</Link></li>
                    <li className="mb-2"><Link to="/register" className="text-white text-decoration-none small opacity-75 hover-opacity-100 d-inline-block">Sign Up</Link></li>
                  </>
                ) : (
                  <>
                    <li className="mb-2"><Link to={user.role === 'STUDENT' ? '/dashboard' : '/teacher'} className="text-white text-decoration-none small opacity-75 hover-opacity-100 d-inline-block">My Dashboard</Link></li>
                    <li className="mb-2"><span onClick={handleLogout} className="text-white text-decoration-none small opacity-75 hover-opacity-100 d-inline-block cursor-pointer">Log Out</span></li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3 text-white">Community</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><Link to="/about" className="text-white text-decoration-none small opacity-75 hover-opacity-100">About Us</Link></li>
                <li className="mb-2"><Link to="/support" className="text-white text-decoration-none small opacity-75 hover-opacity-100">Support</Link></li>
                <li className="mb-2"><Link to="/support" className="text-white text-decoration-none small opacity-75 hover-opacity-100">Contact</Link></li>
              </ul>
            </div>

            <div className="col-md-6 col-lg-4">
              <h6 className="fw-bold mb-3 text-white">Stay Updated</h6>
              <p className="text-white-50 small mb-3" style={{ opacity: '0.8' }}>Subscribe for special offers, free tutorials, and latest news.</p>
              <div className="input-group mb-3 shadow-sm border border-secondary" style={{ borderRadius: '4px', overflow: 'hidden' }}>
                <input type="text" className="form-control bg-dark border-0 text-white small" placeholder="Enter your email" aria-label="Email" />
                <button className="btn btn-primary btn-sm px-4" type="button" style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}>Join</button>
              </div>
              <div className="d-flex align-items-center gap-2 text-white-50 extra-small">
                <span>🛡️</span> Zero spam, just pure learning.
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top border-secondary">
            <div className="text-white-50 small mb-3 mb-md-0" style={{ opacity: '0.7' }}>
              © 2026 LMS Platform, Inc. Crafted with ❤️ for learners worldwide.
            </div>
            <div className="d-flex gap-4">
                <Link to="/privacy" className="text-white text-decoration-none extra-small opacity-75 hover-opacity-100">Privacy Policy</Link>
                <Link to="/terms" className="text-white text-decoration-none extra-small opacity-75 hover-opacity-100">Terms of Service</Link>
                <Link to="/privacy" className="text-white text-decoration-none extra-small opacity-75 hover-opacity-100">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
