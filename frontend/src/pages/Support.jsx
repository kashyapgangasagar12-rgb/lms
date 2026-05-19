import { useState } from 'react'

export default function Support() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSuccess(false), 5000)
  }

  const faqs = [
    { q: "How do I enroll in a course?", a: "Browse our course catalog by clicking 'Browse Courses' or 'My Learning'. Select a course and click the 'Enroll' button to add it to your dashboard." },
    { q: "Can I teach courses on LMS?", a: "Yes! Register an account and choose the 'TEACHER' role, or request role elevation from your profile dashboard." },
    { q: "How are assignments graded?", a: "Instructors will grade your submitted responses and assign a score out of the maximum marks. You can view feedback instantly in the 'Assignments & Tasks' tab." },
    { q: "Who should I contact for billing questions?", a: "For any payment or account queries, please fill out the contact form below or email support@lms.platform." }
  ]

  return (
    <div className="container py-5" style={{ maxWidth: '1000px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3 display-5">Help & Support Center</h1>
        <p className="lead text-muted">Have questions? We are here to help you get the most out of your learning experience.</p>
      </div>

      <div className="row g-5 mb-5">
        {/* FAQs */}
        <div className="col-lg-6">
          <h3 className="fw-bold mb-4">Frequently Asked Questions</h3>
          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card border-0 shadow-sm p-4 bg-off-white" style={{ borderRadius: '0.8rem' }}>
                <h6 className="fw-bold text-dark mb-2">
                  <i className="bi bi-lightbulb-fill text-primary me-2"></i>
                  {faq.q}
                </h6>
                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1rem' }}>
            <h3 className="fw-bold mb-3">Contact Support</h3>
            <p className="small text-muted mb-4">Submit a ticket and our support team will reach out within 24 hours.</p>
            
            {success && (
              <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                <span>Inquiry submitted successfully! We'll contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
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
