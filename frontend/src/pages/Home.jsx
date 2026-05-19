import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getCourses } from '../services/courseService'
import StarRating from '../components/StarRating'

export default function Home() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-home">
      {/* Search Hero Section */}
      <section className="hero-udemy">
        <div className="container-udemy">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="card hero-card p-4 p-md-5 shadow-sm border-0 text-center-mobile">
                <h1 className="display-4 fw-bold mb-3 text-dark">Learning that gets you</h1>
                <p className="lead text-gray mb-4">Skills for your present (and your future). Get started with us today and explore thousands of trending courses.</p>
                {!user ? (
                    <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                        <Link to="/register" className="btn btn-udemy-primary px-4 py-3">Join for Free</Link>
                        <Link to="/courses" className="btn btn-udemy-secondary px-4 py-3">View Courses</Link>
                    </div>
                ) : (
                    <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                        <Link to="/courses" className="btn btn-udemy-primary px-4 py-3">Explore Courses</Link>
                    </div>
                )}
              </div>
            </div>
            <div className="col-lg-7 d-none d-lg-block">
                <div className="position-relative">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Learning" className="img-fluid rounded shadow-sm" style={{ transform: 'translateX(30px)' }} />
                    <div className="position-absolute bottom-0 start-0 bg-white p-3 shadow rounded m-4 d-flex align-items-center gap-2 animate-slide-up">
                        <div className="bg-success rounded-circle p-2 text-white" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</div>
                        <div className="small fw-bold">100% Industry Relevant</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Courses */}
      <section className="py-5">
        <div className="container-udemy">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3 text-center-mobile">
            <div>
                <h2 className="fw-bold mb-2">A broad selection of courses</h2>
                <p className="text-gray mb-0">Choose from top-rated online video courses with new additions published every month</p>
            </div>
            <Link to="/courses" className="text-primary fw-bold text-decoration-none hover-opacity-100">Browse all courses →</Link>
          </div>
          
          <div className="row g-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="col-md-6 col-lg-3">
                  <div className="course-card placeholder-glow">
                    <div className="placeholder w-100 mb-2" style={{ height: '170px' }}></div>
                    <div className="placeholder w-75 mb-1"></div>
                    <div className="placeholder w-50 mb-1"></div>
                    <div className="placeholder w-25"></div>
                  </div>
                </div>
              ))
            ) : (
              courses.slice(0, 8).map(course => (
                <div key={course.id} className="col-md-6 col-lg-3">
                  <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                    <div className="course-card h-100">
                      <img src={course.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={course.name} />
                      <div className="course-card-title px-1">{course.name}</div>
                      <div className="course-card-instructor px-1">{course.instructorName || 'Expert Instructor'}</div>
                      <div className="course-card-rating px-1 my-1">
                        <StarRating rating={course.rating || 0} count={course.reviewCount || 0} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
            {courses.length === 0 && !loading && (
                <div className="col-12 text-center py-5 text-muted">
                    <div className="mb-3 fs-1">📚</div>
                    <h3>No courses available yet.</h3>
                    <p>Check back later for new additions!</p>
                </div>
            )}
          </div>
        </div>
      </section>

     

      
    </div>
  )
}
