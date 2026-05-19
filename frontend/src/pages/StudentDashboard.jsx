import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyAssignments } from '../services/assignmentService'
import { getProgress, getCourseProgress } from '../services/lessonService'
import { getEnrolledCourses } from '../services/courseService'
import { useAuth } from '../auth/AuthContext'

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [recentAssignments, setRecentAssignments] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [progress, setProgress] = useState(null)
  const [courseProgressMap, setCourseProgressMap] = useState({})
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        getMyAssignments(user.id),
        getProgress(),
        getEnrolledCourses()
      ]).then(([assRes, progRes, enrolledRes]) => {
        setRecentAssignments(assRes.data?.slice(0, 3) || [])
        setProgress(progRes.data)
        const courses = enrolledRes.data || []
        setEnrolledCourses(courses)

        // Fetch per-course progress for each enrolled course
        const progressPromises = courses.map(c =>
          getCourseProgress(c.id)
            .then(r => ({ courseId: c.id, data: r.data }))
            .catch(() => ({ courseId: c.id, data: { completedLessons: 0, totalLessons: 0 } }))
        )
        return Promise.all(progressPromises)
      }).then((progResults) => {
        if (Array.isArray(progResults)) {
          const map = {}
          progResults.forEach(({ courseId, data }) => {
            map[courseId] = data
          })
          setCourseProgressMap(map)
        }
      }).catch(() => {
        setRecentAssignments([])
        setProgress(null)
        setEnrolledCourses([])
      }).finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <div className="container py-5 text-center">Loading...</div>

  const masteryPercent = progress?.totalLessons
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0

  return (
    <div className="container-udemy py-5">
      <div className="mb-5">
        <h1 className="fw-bold mb-2 text-dark">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
        <p className="text-gray lead">Keep track of your learning and pick up where you left off.</p>
      </div>

      <div className="row g-4">
        {/* Progress Card */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-off-white" style={{ height: '100%' }}>
            <h5 className="fw-bold mb-4">My Learning Progress</h5>
            <div className="progress mb-3" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${masteryPercent}%`, backgroundColor: 'var(--color-primary)' }}
              />
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="small text-muted">{masteryPercent}% Complete</span>
              <Link to="/courses" className="small text-primary text-decoration-none fw-bold">View Courses</Link>
            </div>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between small">
                <span className="text-gray">Lessons Completed</span>
                <span className="fw-bold">{progress?.completedLessons || 0} / {progress?.totalLessons || 0}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-gray">Assignments Submitted</span>
                <span className="fw-bold">{progress?.submittedAssignments || 0} / {progress?.totalAssignments || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Card */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4" style={{ height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Assignments</h5>
              <Link to="/assignments" className="small text-primary text-decoration-none fw-bold">All Assignments</Link>
            </div>
            <div className="list-group list-group-flush">
              {recentAssignments.length === 0 ? (
                <div className="text-center py-5 text-muted small">No recent assignments.</div>
              ) : (
                recentAssignments.map(a => (
                  <div key={a.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{a.title}</div>
                      <div className="text-muted extra-small">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    {a.grade ? (
                      <span className="badge bg-light text-success border">
                        Graded: {isNaN(a.grade) ? a.grade : `${a.grade}/${a.maxMarks || 100}`}
                      </span>
                    ) : (
                      <Link to={`/assignments/${a.id}/submit`} className="btn btn-udemy-secondary btn-sm">Submit</Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0">My Courses</h5>
          <Link to="/courses" className="small text-primary text-decoration-none fw-bold">Browse all courses</Link>
        </div>

        <div className="row g-4">
          {enrolledCourses.length === 0 ? (
            <div className="col-12 text-center py-5 bg-light rounded">
              <p className="text-muted mb-3">You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="btn btn-udemy-primary btn-sm px-4">Start Learning Now</Link>
            </div>
          ) : (
            enrolledCourses.map(course => {
              const cp = courseProgressMap[course.id]
              const pct = cp?.totalLessons > 0
                ? Math.round((cp.completedLessons / cp.totalLessons) * 100)
                : 0
              return (
                <div key={course.id} className="col-md-6 col-lg-4">
                  <Link to={`/courses/${course.id}/lessons`} className="text-decoration-none text-dark">
                    <div className="card h-100 shadow-sm border-0 course-card-hover">
                      <img
                        src={course.imageUrl || 'https://via.placeholder.com/400x225'}
                        className="card-img-top"
                        alt={course.name}
                        style={{ height: '140px', objectFit: 'cover' }}
                      />
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-1 text-truncate">{course.name}</h6>
                        <p className="text-muted extra-small mb-2">{course.instructorName}</p>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '4px' }}>
                            <div
                              className="progress-bar bg-success"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="extra-small fw-bold">{pct}%</span>
                        </div>
                        {cp && (
                          <div className="extra-small text-muted mt-1">
                            {cp.completedLessons} / {cp.totalLessons} lessons completed
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="mt-5">
        <h5 className="fw-bold mb-4">Quick Links</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <Link to="/courses" className="btn btn-outline-dark w-100 py-3 fw-bold">Browse Courses</Link>
          </div>
          <div className="col-md-4">
            <Link to="/assignments" className="btn btn-outline-dark w-100 py-3 fw-bold">My Assignments</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
