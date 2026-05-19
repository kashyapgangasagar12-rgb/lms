import { useState, useEffect } from 'react'
import { getCourses } from '../services/courseService'
import { createAssignment, getAssignmentsByCourse, getSubmissionsByAssignment, gradeSubmission } from '../services/assignmentService'
import { useAuth } from '../auth/AuthContext'
import api from '../services/api'

export default function ManageAssignments() {
    const { user } = useAuth()
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState('')
    const [assignments, setAssignments] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [students, setStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState([])
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', maxMarks: '' })
    const [grading, setGrading] = useState({ id: null, grade: '', feedback: '' })
    const [viewingSubmission, setViewingSubmission] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            getCourses().then(r => setCourses(r.data || [])).catch(() => []),
            api.get('/teacher/students').then(r => setStudents(r.data || [])).catch(() => [])
        ]).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (selectedCourse) {
            getAssignmentsByCourse(selectedCourse).then((r) => setAssignments(r.data || []))
        }
    }, [selectedCourse])

    const handleCreate = (e) => {
        e.preventDefault()
        createAssignment({
            ...newAssignment,
            courseId: selectedCourse,
            studentIds: selectedStudents,
            maxMarks: parseInt(newAssignment.maxMarks) || 100
        }).then(() => {
            setNewAssignment({ title: '', description: '', dueDate: '', maxMarks: '' })
            setSelectedStudents([])
            getAssignmentsByCourse(selectedCourse).then((r) => setAssignments(r.data || []))
        })
    }

    const loadSubmissions = (id) => {
        getSubmissionsByAssignment(id).then((r) => setSubmissions(r.data || []))
    }

    const handleGrade = (e) => {
        e.preventDefault()
        gradeSubmission(grading.id, grading.grade, grading.feedback).then(() => {
            const currentAssignment = submissions[0]?.assignmentId
            setGrading({ id: null, grade: '', feedback: '' })
            if (currentAssignment) loadSubmissions(currentAssignment)
        })
    }

    const toggleStudent = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    if (loading) return <div className="container py-5 text-center">Loading...</div>

    return (
        <div className="container-udemy py-5">
            <h1 className="fw-bold mb-4">Assignments & Grading</h1>

            <div className="card shadow-sm mb-4 border-0 bg-off-white p-4">
                <label className="form-label fw-bold">Active Course Selection</label>
                <select className="form-select w-50" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Choose a course to manage...</option>
                    {courses
                        .filter(c => user?.role === 'ADMIN' || c.instructorId === user?.id)
                        .map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    }
                </select>
            </div>

            {selectedCourse && (
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm mb-4 p-4">
                            <h5 className="fw-bold mb-3">Create Assignment</h5>
                            <form onSubmit={handleCreate}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="Title" required
                                        value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <textarea className="form-control" placeholder="Instructions" rows="3"
                                        value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold">Due Date</label>
                                    <input type="datetime-local" className="form-control" required
                                        value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control" placeholder="Max Points" required
                                        value={newAssignment.maxMarks} onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Assign to Students</label>
                                    <div className="p-2 border rounded overflow-auto" style={{ maxHeight: '150px', backgroundColor: '#fff' }}>
                                        {students.map(s => (
                                            <div key={s.id} className="form-check">
                                                <input className="form-check-input" type="checkbox"
                                                    checked={selectedStudents.includes(s.id)}
                                                    onChange={() => toggleStudent(s.id)} id={`std-${s.id}`} />
                                                <label className="form-check-label small" htmlFor={`std-${s.id}`}>
                                                    {s.fullName}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-udemy-primary w-100">Create & Notify</button>
                            </form>
                        </div>

                        <div className="card border-0 shadow-sm p-4">
                            <h6 className="fw-bold mb-3">Course Assignments</h6>
                            <div className="list-group">
                                {assignments.map(a => (
                                    <button key={a.id} className="list-group-item list-group-item-action border-0 mb-1 rounded bg-off-white"
                                        onClick={() => loadSubmissions(a.id)}>
                                        {a.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-4">Submissions</h5>
                            {submissions.length === 0 ? (
                                <p className="text-muted italic py-5 text-center">Select an assignment to view student work.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead className="bg-light">
                                            <tr>
                                                <th>Student</th>
                                                <th>Ref</th>
                                                <th>Grade</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.map(s => (
                                                <tr key={s.id}>
                                                    <td>
                                                        <div className="fw-bold">{s.studentName || 'Unknown Student'}</div>
                                                    </td>
                                                    <td><small className="text-muted">ID: {s.studentId}</small></td>
                                                    <td><span className="badge bg-light text-dark border">{s.grade || 'Pending'}</span></td>
                                                    <td className="text-end">
                                                        <button className="btn btn-udemy-secondary btn-sm me-2"
                                                            onClick={() => setViewingSubmission(s)}>Review</button>
                                                        <button className="btn btn-udemy-primary btn-sm"
                                                            onClick={() => setGrading({ ...grading, id: s.id })}>Grade</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {grading.id && (
                            <div className="card shadow mt-4 p-4 border-0">
                                <h6 className="fw-bold mb-3">Grade Submission #{grading.id}</h6>
                                <form onSubmit={handleGrade} className="row g-3">
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="Grade (e.g. A, 95)" required
                                            value={grading.grade} onChange={(e) => setGrading({ ...grading, grade: e.target.value })} />
                                    </div>
                                    <div className="col-md-5">
                                        <input type="text" className="form-control" placeholder="Feedback"
                                            value={grading.feedback} onChange={(e) => setGrading({ ...grading, feedback: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <button type="submit" className="btn btn-udemy-primary w-100">Save Grade</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* View Submission Modal */}
            {viewingSubmission && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header border-0 bg-dark text-white">
                                <h5 className="modal-title">Submission by {viewingSubmission.studentName}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingSubmission(null)}></button>
                            </div>
                            <div className="modal-body p-4 bg-off-white">
                                <div className="p-4 bg-white border mb-4" style={{ minHeight: '200px', whiteSpace: 'pre-wrap' }}>
                                    {viewingSubmission.content}
                                </div>
                                <div className="text-end">
                                    <button className="btn btn-udemy-primary px-4"
                                        onClick={() => {
                                            setGrading({ ...grading, id: viewingSubmission.id });
                                            setViewingSubmission(null);
                                        }}>Proceed to Grade</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
