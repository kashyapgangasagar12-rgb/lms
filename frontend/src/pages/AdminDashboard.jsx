import { useState, useEffect } from 'react'
import { getAllUsers, deleteUser } from '../services/adminService'
import { getCourses, deleteCourse } from '../services/courseService'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users')
    const [users, setUsers] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers()
        } else {
            loadCourses()
        }
    }, [activeTab])

    const loadUsers = () => {
        setLoading(true)
        getAllUsers()
            .then(r => setUsers(r.data))
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false))
    }

    const loadCourses = () => {
        setLoading(true)
        getCourses()
            .then(r => setCourses(r.data))
            .catch(() => setError('Failed to load courses'))
            .finally(() => setLoading(false))
    }

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteUser(id)
                .then(() => {
                    setUsers(users.filter(u => u.id !== id))
                })
                .catch(() => alert('Failed to delete user'))
        }
    }

    const handleDeleteCourse = (id) => {
        if (window.confirm('Are you sure you want to delete this course? All associated lessons and reviews will be removed.')) {
            deleteCourse(id)
                .then(() => {
                    setCourses(courses.filter(c => c.id !== id))
                })
                .catch(() => alert('Failed to delete course'))
        }
    }

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>
    if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>

    const studentCount = users.filter(u => u.role === 'STUDENT').length
    const teacherCount = users.filter(u => u.role === 'TEACHER').length

    return (
        <div className="container-udemy py-5">
            <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 className="fw-bold mb-2 text-center text-md-start">Admin Dashboard</h1>
                    <p className="lead text-gray mb-0 text-center text-md-start">Platform-wide management and monitoring.</p>
                </div>
                <div className="btn-group shadow-sm w-100-mobile align-self-center align-self-md-auto" style={{ borderRadius: '0.5rem', overflow: 'hidden', maxWidth: '240px' }}>
                    <button 
                        className={`btn ${activeTab === 'users' ? 'btn-dark' : 'btn-light border'} w-50`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={`btn ${activeTab === 'courses' ? 'btn-dark' : 'btn-light border'} w-50`}
                        onClick={() => setActiveTab('courses')}
                    >
                        Courses
                    </button>
                </div>
            </div>

            {activeTab === 'users' ? (
                <>
                    <div className="row g-3 g-md-4 mb-5 animate-fade-in">
                        <div className="col-12 col-sm-4">
                            <div className="card shadow-sm border-0 p-3 p-md-4 text-center glass-card">
                                <div className="fs-3 fs-md-1 fw-bold mb-1 text-primary">{users.length}</div>
                                <div className="extra-small text-muted fw-bold text-uppercase">TOTAL USERS</div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="card shadow-sm border-0 p-3 p-md-4 text-center glass-card">
                                <div className="fs-3 fs-md-1 fw-bold mb-1 text-success">{studentCount}</div>
                                <div className="extra-small text-muted fw-bold text-uppercase">STUDENTS</div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="card shadow-sm border-0 p-3 p-md-4 text-center glass-card">
                                <div className="fs-3 fs-md-1 fw-bold mb-1 text-info">{teacherCount}</div>
                                <div className="extra-small text-muted fw-bold text-uppercase">INSTRUCTORS</div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 animate-slide-up" style={{ borderRadius: '0.8rem' }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">User Management</h5>
                            <div className="table-responsive shadow-sm rounded">
                                <table className="table align-middle" style={{ minWidth: '800px' }}>
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th className="px-4 py-3">Full Name</th>
                                            <th className="py-3">Email Address</th>
                                            <th className="py-3">Role</th>
                                            <th className="py-3 text-end px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td className="px-4 py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                                                            style={{ width: '36px', height: '36px', backgroundColor: u.role === 'TEACHER' ? 'var(--color-secondary)' : 'var(--color-primary)', fontSize: '0.85rem' }}>
                                                            {u.fullName.charAt(0)}
                                                        </div>
                                                        <span className="fw-bold">{u.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted">{u.email}</td>
                                                <td className="py-3">
                                                    <span className={`badge px-3 py-2 ${u.role === 'TEACHER' ? 'bg-info text-white' : 'bg-success text-white'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-end px-4">
                                                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card shadow-sm border-0 animate-slide-up" style={{ borderRadius: '0.8rem' }}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0">Platform Courses</h5>
                            <span className="badge bg-primary px-3 py-2">{courses.length} Total</span>
                        </div>
                        <div className="table-responsive shadow-sm rounded">
                            <table className="table align-middle" style={{ minWidth: '800px' }}>
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th className="px-4 py-3">Course Title</th>
                                        <th className="py-3">Instructor</th>
                                        <th className="py-3">Category</th>
                                        <th className="py-3 text-end px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={c.imageUrl || 'https://via.placeholder.com/60x34'} alt="" style={{ width: '48px', height: '27px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <span className="fw-bold">{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3">{c.instructorName}</td>
                                            <td className="py-3"><span className="badge bg-light text-dark border">{c.category}</span></td>
                                            <td className="py-3 text-end px-4">
                                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleDeleteCourse(c.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {courses.length === 0 && (
                                <div className="text-center py-5 text-muted italic">No courses available on the platform.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
