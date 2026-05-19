import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courseService'
import StarRating from '../components/StarRating'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCourses()
      .then((r) => setCourses(r.data || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load courses'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary"></div>
    </div>
  )

  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  )

  return (
    <div className="container-udemy py-5">
      <h1 className="fw-bold mb-4">All Courses</h1>
      
      <div className="row g-4">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-3">
             <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                <div className="course-card h-100">
                  <img src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={course.name} />
                  <div className="course-card-title">{course.name}</div>
                  <div className="course-card-instructor">{course.instructorName || 'Expert Instructor'}</div>
                  <div className="course-card-rating my-1">
                    <StarRating rating={course.rating || 0} count={course.reviewCount || 0} />
                  </div>
                </div>
              </Link>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-5 my-5 text-muted">
          <div className="mb-4" style={{ fontSize: '4rem' }}>📭</div>
          <h3>No courses found</h3>
        </div>
      )}
    </div>
  )
}
