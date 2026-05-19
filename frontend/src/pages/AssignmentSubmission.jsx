import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { submitAssignment } from '../services/assignmentService'

export default function AssignmentSubmission() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        submitAssignment({
            assignmentId: id,
            studentId: user.id,
            content: content
        })
            .then(() => navigate('/assignments'))
            .catch((err) => setError(err.response?.data?.message || 'Failed to submit'))
            .finally(() => setSubmitting(false))
    }

    return (
        <div className="container-udemy py-5" style={{ maxWidth: '800px' }}>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/assignments" className="text-decoration-none" style={{ color: 'var(--color-primary)' }}>Assignments</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Submit</li>
                </ol>
            </nav>

            <h2 className="fw-bold mb-4">Submit Assignment</h2>
            <div className="card shadow-sm border-0" style={{ borderRadius: '0.8rem' }}>
                <div className="card-body p-4 p-md-5">
                    {error && <div className="alert alert-danger mb-4">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted text-uppercase">Your Response / Link</label>
                            <textarea
                                className="form-control"
                                rows="10"
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your essay, code link, or solution here..."
                            ></textarea>
                        </div>
                        <button className="btn btn-udemy-primary btn-lg w-100" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Upload Submission'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
