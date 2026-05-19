import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">Get in Touch</h1>
        <p className="lead text-muted">Have a partnership inquiry, feature request, or general question? Let's connect!</p>
      </div>

      <div className="row g-5">
        <div className="col-md-5">
          <h3 className="fw-bold mb-4">Contact Info</h3>
          <div className="d-flex flex-column gap-4">
            <div className="d-flex gap-3 align-items-start">
              <div className="text-primary fs-4"><i className="bi bi-geo-alt-fill"></i></div>
              <div>
                <h6 className="fw-bold mb-1">Office Headquarters</h6>
                <p className="small text-muted mb-0">100 Innovation Way, Suite 400<br />Boston, MA 02110</p>
              </div>
            </div>

            <div className="d-flex gap-3 align-items-start">
              <div className="text-primary fs-4"><i className="bi bi-envelope-at-fill"></i></div>
              <div>
                <h6 className="fw-bold mb-1">Email Inquiries</h6>
                <p className="small text-muted mb-0">contact@lms.platform<br />partners@lms.platform</p>
              </div>
            </div>

            <div className="d-flex gap-3 align-items-start">
              <div className="text-primary fs-4"><i className="bi bi-telephone-fill"></i></div>
              <div>
                <h6 className="fw-bold mb-1">Phone Support</h6>
                <p className="small text-muted mb-0">+1 (800) 555-0199<br />Mon-Fri, 9AM - 6PM EST</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem' }}>
            <h3 className="fw-bold mb-3">Send a Message</h3>
            
            {success && (
              <div className="alert alert-success d-flex align-items-center mb-4 animate-fade-in" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                <span>Message sent successfully! Our team will get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Subject</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.subject} 
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Message</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  required 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-udemy-primary w-100 py-2.5">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
