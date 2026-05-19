import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyAssignments } from '../services/assignmentService'
import { useAuth } from '../auth/AuthContext'

export default function Assignments() {
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        if (user?.id) {
            getMyAssignments(user.id)
                .then((r) => setAssignments(r.data || []))
                .catch(() => setAssignments([]))
                .finally(() => setLoading(false))
        }
    }, [user])

    if (loading) return <div className="container py-5 text-center">Loading...</div>

    return (
        <div className="container-udemy py-5">
            <h1 className="fw-bold mb-4">Assignments & Tasks</h1>
            <p className="lead text-gray mb-5">Keep track of your submissions and grades across all courses.</p>

            <div className="row g-4">
                {assignments.map((a) => (
                    <div key={a.id} className="col-12">
                        <div className="card shadow-sm border p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className={`badge ${a.grade ? 'bg-success' : 'bg-warning'} text-white small px-3 py-2`}>
                                            {a.grade ? 'GRADED' : 'PENDING'}
                                        </span>
                                        <span className="text-muted small">Due Date: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <h3 className="fw-bold mb-3">{a.title}</h3>
                                    <p className="text-gray mb-0">{a.description}</p>
                                </div>
                                <div className="col-md-4 text-md-end mt-4 mt-md-0">
                                    {a.grade ? (
                                        <div className="mb-4">
                                            <div className="display-6 fw-bold text-success">{a.grade}</div>
                                            <div className="small text-muted">{a.feedback || 'Good work!'}</div>
                                        </div>
                                    ) : (
                                        <Link to={`/assignments/${a.id}/submit`} className="btn btn-udemy-primary px-5 py-3">Submit Work</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {assignments.length === 0 && (
                <div className="text-center py-5 my-5 text-muted">
                    <div className="mb-4 display-1">🎯</div>
                    <h3>No pending assignments</h3>
                    <p>You're all caught up with your coursework.</p>
                </div>
            )}
        </div>
    )
}
