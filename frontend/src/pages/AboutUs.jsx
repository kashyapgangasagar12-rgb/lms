import { Link } from 'react-router-dom'

export default function AboutUs() {
  return (
    <div className="container py-5" style={{ maxWidth: '1000px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-4">
          <span className="text-gradient" style={{ background: 'linear-gradient(135deg, var(--color-primary), #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Democratizing Professional Education
          </span>
        </h1>
        <p className="lead text-muted fs-4">
          We build modern tools that empower students and teachers worldwide to share knowledge, master new skills, and connect.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 bg-off-white" style={{ borderRadius: '1rem' }}>
            <h3 className="fw-bold mb-3 text-dark">Our Mission</h3>
            <p className="text-gray mb-0" style={{ lineHeight: '1.7' }}>
              We believe quality learning is a fundamental right. Our platform brings industry-expert instructors together with motivated learners, bypassing institutional borders and rigid schedules. We make learning interactive, modular, and performance-driven.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 bg-off-white" style={{ borderRadius: '1rem' }}>
            <h3 className="fw-bold mb-3 text-dark">Our Technology</h3>
            <p className="text-gray mb-0" style={{ lineHeight: '1.7' }}>
              Built with a sleek, cloud-scale backend and intuitive user-focused frontend, our LMS ensures fast video stream load times, dynamic assignment feedback loops, and robust security safeguards.
            </p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-5 text-center mb-5" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <h2 className="fw-bold text-white mb-4">LMS by the Numbers</h2>
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-3">
            <div className="display-5 fw-bold text-primary mb-2" style={{ color: 'var(--color-primary)' }}>10K+</div>
            <div className="small text-white-50 text-uppercase">Active Learners</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-5 fw-bold text-primary mb-2" style={{ color: 'var(--color-primary)' }}>250+</div>
            <div className="small text-white-50 text-uppercase">Expert Instructors</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-5 fw-bold text-primary mb-2" style={{ color: 'var(--color-primary)' }}>500+</div>
            <div className="small text-white-50 text-uppercase">Interactive Courses</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="display-5 fw-bold text-primary mb-2" style={{ color: 'var(--color-primary)' }}>99.9%</div>
            <div className="small text-white-50 text-uppercase">Uptime SLA</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="fw-bold mb-3">Ready to start your journey?</h3>
        <div className="d-flex gap-3 justify-content-center mt-4">
          <Link to="/courses" className="btn btn-udemy-primary px-4 py-2">Explore Courses</Link>
          <Link to="/register" className="btn btn-udemy-secondary px-4 py-2">Sign Up Now</Link>
        </div>
      </div>
    </div>
  )
}
