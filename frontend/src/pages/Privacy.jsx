export default function Privacy() {
  return (
    <div className="container py-5" style={{ maxWidth: '1000px' }}>
      <div className="mb-5 text-center">
        <h1 className="fw-bold mb-2">
          <span className="text-gradient">Secure Student Data & Privacy Shield</span>
        </h1>
        <p className="lead text-secondary">Advanced encryption and privacy-first architecture protecting your learning journey.</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-transparent">
            <div className="card-body p-4 rounded-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <div className="text-primary mb-3"><i className="bi bi-shield-lock-fill" style={{ fontSize: '2.5rem' }}></i></div>
              <h2 className="card-title h5 fw-bold text-dark">Authentication & Access</h2>
              <p className="card-text small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                Bank-grade protection with JWT tokens and granular role-based permissions (RBAC). Your progress data is strictly siloed—other students cannot access your performance metrics.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-transparent">
            <div className="card-body p-4 rounded-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <div className="text-success mb-3"><i className="bi bi-shield-check" style={{ fontSize: '2.5rem' }}></i></div>
              <h2 className="card-title h5 fw-bold text-dark">Data Minimization</h2>
              <p className="card-text small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                We practice strict data minimization. We only store essential analytics to personalize your AI tutor. No data is ever sold or shared with third-party advertisers.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-transparent">
            <div className="card-body p-4 rounded-4" style={{ backgroundColor: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.15)' }}>
              <div className="text-info mb-3"><i className="bi bi-people-fill" style={{ fontSize: '2.5rem' }}></i></div>
              <h2 className="card-title h5 fw-bold text-dark">Study Match Privacy</h2>
              <p className="card-text small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                Our matchmaker uses anonymous compatibility scores. Contact details are only shared implicitly when you choose to collaborate, giving you full control over your social learning interactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-5 border-0">
        <div className="card-body p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
            <span><i className="bi bi-file-earmark-text-fill text-primary"></i></span> Your Data Rights
          </h2>
          <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-secondary">
            <li className="d-flex gap-2">
              <span className="text-primary">•</span>
              <span>Request a complete export of your learning history and AI interactions.</span>
            </li>
            <li className="d-flex gap-2">
              <span className="text-primary">•</span>
              <span>Passwords are hashed using industry-standard BCrypt encryption.</span>
            </li>
            <li className="d-flex gap-2">
              <span className="text-primary">•</span>
              <span>All API communications are encrypted in transit via HTTPS.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
