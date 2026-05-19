export default function Terms() {
  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-2">Terms of Service</h1>
        <p className="lead text-muted">Last Updated: May 20, 2026</p>
      </div>

      <div className="card border-0 shadow-sm p-3 p-md-5 bg-off-white" style={{ borderRadius: '1rem' }}>
        <section className="mb-4">
          <h3 className="fw-bold mb-3 text-dark">1. Acceptance of Terms</h3>
          <p className="text-gray" style={{ lineHeight: '1.7' }}>
            By registering an account and using the LMS platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not access or use our services.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="fw-bold mb-3 text-dark">2. User Conduct</h3>
          <p className="text-gray" style={{ lineHeight: '1.7' }}>
            Students and teachers are expected to maintain professional and respectful behavior. You may not publish content that is hateful, abusive, plagiarized, or infringing on intellectual property rights. Violation of these guidelines will result in immediate account termination.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="fw-bold mb-3 text-dark">3. Account Integrity</h3>
          <p className="text-gray" style={{ lineHeight: '1.7' }}>
            You are responsible for keeping your login credentials confidential. Do not share your account or password with others. Any actions taken through your account are your sole responsibility.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="fw-bold mb-3 text-dark">4. Intellectual Property</h3>
          <p className="text-gray" style={{ lineHeight: '1.7' }}>
            All course materials, lectures, quizzes, and assignments created by instructors remain their respective intellectual property. You may access them for personal learning purposes only and may not distribute them outside the platform.
          </p>
        </section>

        <section className="mb-0">
          <h3 className="fw-bold mb-3 text-dark">5. Limitation of Liability</h3>
          <p className="text-gray mb-0" style={{ lineHeight: '1.7' }}>
            LMS is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or that course material will guarantee career success. We are not liable for any direct or indirect damages resulting from platform downtime or data loss.
          </p>
        </section>
      </div>
    </div>
  )
}
