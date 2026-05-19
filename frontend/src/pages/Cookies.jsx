import { useState, useEffect } from 'react'

export default function Cookies() {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_preferences')
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch (e) {
        // use default
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Cookie Settings & Policy</h1>
        <p className="lead text-muted">Manage your privacy choices. Customize which cookies you allow us to store.</p>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center mb-4 animate-fade-in" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <span>Your cookie preferences have been updated and saved successfully!</span>
        </div>
      )}

      <div className="card border-0 shadow-sm p-4 p-md-5 bg-off-white" style={{ borderRadius: '1rem' }}>
        <p className="text-gray mb-5" style={{ lineHeight: '1.7' }}>
          We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better, safer, and faster experience. You can choose your preferences below.
        </p>

        <div className="d-flex flex-column gap-4 mb-5">
          {/* Essential */}
          <div className="d-flex justify-content-between align-items-start border-bottom pb-4">
            <div className="pe-4">
              <h5 className="fw-bold text-dark mb-1">Essential Cookies</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>
                Required for core website operations, such as secure login authentication and session state preservation. These cannot be disabled.
              </p>
            </div>
            <div className="form-check form-switch pt-1">
              <input className="form-check-input" type="checkbox" checked disabled style={{ cursor: 'not-allowed', width: '45px', height: '22px' }} />
            </div>
          </div>

          {/* Analytics */}
          <div className="d-flex justify-content-between align-items-start border-bottom pb-4">
            <div className="pe-4">
              <h5 className="fw-bold text-dark mb-1">Performance & Analytics</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>
                Allow us to analyze traffic, count visits, and measure learning analytics to improve platform performance and personalize dashboard insights.
              </p>
            </div>
            <div className="form-check form-switch pt-1">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={preferences.analytics} 
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                style={{ cursor: 'pointer', width: '45px', height: '22px' }} 
              />
            </div>
          </div>

          {/* Marketing */}
          <div className="d-flex justify-content-between align-items-start">
            <div className="pe-4">
              <h5 className="fw-bold text-dark mb-1">Marketing Cookies</h5>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>
                Used to deliver relevant advertisements and measure campaign effectiveness. Disabling this does not reduce ads, but makes them generic.
              </p>
            </div>
            <div className="form-check form-switch pt-1">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={preferences.marketing} 
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                style={{ cursor: 'pointer', width: '45px', height: '22px' }} 
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-udemy-primary w-100 py-3 fw-bold">
          Save Settings & Preferences
        </button>
      </div>
    </div>
  )
}
