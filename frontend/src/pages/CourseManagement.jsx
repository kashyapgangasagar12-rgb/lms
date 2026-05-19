import { useState, useEffect } from 'react'
import { getCourses, createCourse, deleteCourse } from '../services/courseService'
import { createLesson, getLessonsForCourse } from '../services/lessonService'
import { getReviewsByCourse } from '../services/reviewService'
import { useAuth } from '../auth/AuthContext'

export default function CourseManagement() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const [newCourse, setNewCourse] = useState({ 
        name: '', 
        description: '', 
        instructorName: '', 
        category: '', 
        imageUrl: '',
        learningObjectives: ''
    })
    const [saving, setSaving] = useState(false)
    const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null)
    const [curriculumLessons, setCurriculumLessons] = useState([])
    const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', attachmentsUrl: '', orderIndex: 1 })
    
    // Review specific state
    const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null)
    const [courseReviews, setCourseReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(false)

    useEffect(() => {
        loadCourses()
    }, [])

    const loadCourses = () => {
        getCourses().then((r) => setCourses(r.data || [])).finally(() => setLoading(false))
    }

    const handleCreate = (e) => {
        e.preventDefault()
        setSaving(true)
        createCourse(newCourse).then(() => {
            setNewCourse({ name: '', description: '', instructorName: '', category: '', imageUrl: '', learningObjectives: '' })
            loadCourses()
        }).finally(() => setSaving(false))
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this course? This will remove all associated lessons.')) {
            deleteCourse(id).then(loadCourses)
        }
    }

    const openCurriculum = (course) => {
        setSelectedCourseForCurriculum(course)
        getLessonsForCourse(course.id).then(r => setCurriculumLessons(r.data || []))
    }

    const openReviews = (course) => {
        setSelectedCourseForReviews(course)
        setLoadingReviews(true)
        getReviewsByCourse(course.id)
            .then(r => setCourseReviews(r.data || []))
            .finally(() => setLoadingReviews(false))
    }

    const handleAddLesson = (e) => {
        e.preventDefault()
        createLesson({ ...newLesson, courseId: selectedCourseForCurriculum.id })
            .then(() => {
                setNewLesson({ title: '', content: '', videoUrl: '', attachmentsUrl: '', orderIndex: curriculumLessons.length + 1 })
                getLessonsForCourse(selectedCourseForCurriculum.id).then(r => setCurriculumLessons(r.data || []))
            })
    }

    if (loading) return <div className="container py-5 text-center">Loading courses...</div>

    return (
        <div className="container-udemy py-5">
            <h1 className="fw-bold mb-4">Course Management</h1>

            <div className="card shadow-sm mb-5 border-0 bg-off-white" style={{ borderRadius: '0.8rem' }}>
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Create New Course</h5>
                    <form onSubmit={handleCreate} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Course Title</label>
                            <input type="text" className="form-control" placeholder="e.g. Master React in 30 Days" required
                                value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Instructor Name</label>
                            <input type="text" className="form-control" placeholder="Your Name" required
                                value={newCourse.instructorName} onChange={(e) => setNewCourse({ ...newCourse, instructorName: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Category</label>
                            <input type="text" className="form-control" placeholder="Development, Business, etc." required
                                value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label small fw-bold">Image URL</label>
                            <input type="text" className="form-control" placeholder="https://images.unsplash.com/..."
                                value={newCourse.imageUrl} onChange={(e) => setNewCourse({ ...newCourse, imageUrl: e.target.value })} />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Description</label>
                            <textarea className="form-control" rows="3" placeholder="Describe what students will learn..." required
                                value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}></textarea>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">What You'll Learn <span className="text-muted fw-normal">(one objective per line)</span></label>
                            <textarea className="form-control" rows="4"
                                placeholder={"Understand core concepts\nBuild real-world projects\nApply best practices"}
                                value={newCourse.learningObjectives}
                                onChange={(e) => setNewCourse({ ...newCourse, learningObjectives: e.target.value })}></textarea>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-udemy-primary" disabled={saving}>
                                {saving ? 'Creating...' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table bg-white align-middle" style={{ minWidth: '800px' }}>
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="px-4 py-3">Course</th>
                            <th className="py-3">Rating</th>
                            <th className="py-3">Category</th>
                            <th className="py-3 text-end px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((c) => (
                            <tr key={c.id}>
                                <td className="px-4 py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={c.imageUrl || 'https://via.placeholder.com/60x34'} alt="" style={{ width: '60px', height: '34px', objectFit: 'cover' }} />
                                        <span className="fw-bold">{c.name}</span>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="text-warning small">
                                        ★ {c.rating?.toFixed(1) || '0.0'} 
                                        <span className="text-muted ms-1">({c.reviewCount || 0})</span>
                                    </div>
                                </td>
                                <td className="py-3"><span className="badge bg-light text-dark border">{c.category}</span></td>
                                <td className="py-3 text-end px-4">
                                    {(c.instructorId === user?.id || user?.role === 'ADMIN') ? (
                                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                                            <button className="btn btn-udemy-secondary btn-sm" onClick={() => openReviews(c)}>Reviews</button>
                                            <button className="btn btn-udemy-secondary btn-sm" onClick={() => openCurriculum(c)}>Curriculum</button>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                                        </div>
                                    ) : (
                                        <span className="badge bg-light text-muted border">🔒 Not your course</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Curriculum Modal */}
            {selectedCourseForCurriculum && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
                            <div className="modal-header border-0 bg-dark text-white p-4">
                                <h5 className="modal-title fw-bold">Manage Curriculum: {selectedCourseForCurriculum.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCourseForCurriculum(null)}></button>
                            </div>
                            <div className="modal-body p-4 bg-off-white">
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        <div className="card border-0 shadow-sm p-4 h-100">
                                            <h6 className="fw-bold mb-3">Add New Lesson</h6>
                                            <form onSubmit={handleAddLesson}>
                                                <div className="mb-3">
                                                    <input type="text" className="form-control" placeholder="Lesson Title" required
                                                        value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" className="form-control" placeholder="Video URL (YouTube)" 
                                                        value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} />
                                                </div>
                                                <div className="mb-3">
                                                    <input type="text" className="form-control" placeholder="Attachments URL" 
                                                        value={newLesson.attachmentsUrl} onChange={e => setNewLesson({...newLesson, attachmentsUrl: e.target.value})} />
                                                </div>
                                                <div className="mb-3">
                                                    <textarea className="form-control" placeholder="Lesson Content (Markdown supported)" rows="4"
                                                        value={newLesson.content} onChange={e => setNewLesson({...newLesson, content: e.target.value})}></textarea>
                                                </div>
                                                <button type="submit" className="btn btn-udemy-primary w-100">Add to Course</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="card border-0 shadow-sm p-4 h-100">
                                            <h6 className="fw-bold mb-3">Curriculum Overview</h6>
                                            <div className="list-group list-group-flush">
                                                {curriculumLessons.map((l, i) => (
                                                    <div key={l.id} className="list-group-item bg-transparent border-0 px-0 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '10px' }}>{i+1}</div>
                                                            <div className="fw-medium">{l.title}</div>
                                                        </div>
                                                        {l.videoUrl && <span className="badge bg-danger rounded-pill" style={{fontSize: '8px'}}>VIDEO</span>}
                                                    </div>
                                                ))}
                                                {curriculumLessons.length === 0 && <div className="text-center py-5 text-muted italic">No lessons yet.</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Modal */}
            {selectedCourseForReviews && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
                            <div className="modal-header border-0 bg-dark text-white p-4">
                                <h5 className="modal-title fw-bold">Student Reviews: {selectedCourseForReviews.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedCourseForReviews(null)}></button>
                            </div>
                            <div className="modal-body p-4 bg-off-white" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {loadingReviews ? (
                                    <div className="text-center py-5">Loading reviews...</div>
                                ) : courseReviews.length === 0 ? (
                                    <div className="text-center py-5 text-muted">No reviews yet for this course.</div>
                                ) : (
                                    <div className="reviews-list">
                                        {courseReviews.map((r) => (
                                            <div key={r.id} className="card border-0 shadow-sm p-3 mb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="fw-bold">{r.userName}</div>
                                                    <div className="text-warning small">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                                                </div>
                                                <p className="mb-1 small text-dark">{r.comment}</p>
                                                <div className="extra-small text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
