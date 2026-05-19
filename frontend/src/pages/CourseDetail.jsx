import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourse, enrollCourse, getEnrolledCourses } from '../services/courseService'
import { getLessonsForCourse } from '../services/lessonService'
import { getReviewsByCourse, submitReview } from '../services/reviewService'
import { useAuth } from '../auth/AuthContext'
import RatingInput from '../components/RatingInput'
import StarRating from '../components/StarRating'
import { getYouTubeEmbedUrl } from '../utils/youtubeUtils'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null) // URL of video to preview
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const promises = [
      getCourse(courseId),
      getLessonsForCourse(courseId).catch(err => {
        console.error("Failed to load lessons:", err)
        return { data: [] }
      }),
      getReviewsByCourse(courseId).catch(err => {
        console.error("Failed to load reviews:", err)
        return { data: [] }
      })
    ]
    if (user) {
      promises.push(
        getEnrolledCourses().catch(err => {
          console.error("Failed to load enrolled courses:", err)
          return { data: [] }
        })
      )
    }

    Promise.all(promises)
      .then(([courseRes, lessonsRes, reviewsRes, enrolledRes]) => {
        setCourse(courseRes.data)
        setLessons(lessonsRes.data || [])
        setReviews(reviewsRes.data || [])
        if (enrolledRes) {
          const enrolled = enrolledRes.data.some(c => c.id === parseInt(courseId))
          setIsEnrolled(enrolled)
        }
      })
      .catch(err => {
        console.error("Failed to load course:", err)
        setCourse(null)
      })
      .finally(() => setLoading(false))
  }, [courseId, user])

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      await enrollCourse(courseId)
      setIsEnrolled(true)
    } catch (err) {
      console.error(err)
      alert('Enrollment failed. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (newReview.rating === 0) { alert('Please select a rating'); return }
    setSubmittingReview(true)
    try {
      await submitReview({ ...newReview, courseId: parseInt(courseId) })
      const [reviewsRes, courseRes] = await Promise.all([
        getReviewsByCourse(courseId),
        getCourse(courseId)
      ])
      setReviews(reviewsRes.data || [])
      setCourse(courseRes.data)
      setNewReview({ rating: 0, comment: '' })
    } catch (err) {
      console.error(err)
      alert('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const openPreview = (videoUrl) => {
    const embed = getYouTubeEmbedUrl(videoUrl)
    if (embed) setPreviewVideo(embed)
  }

  const closePreview = () => setPreviewVideo(null)

  // Parse learning objectives — stored as newline-separated string
  const objectives = course?.learningObjectives
    ? course.learningObjectives.split('\n').map(o => o.trim()).filter(Boolean)
    : []

  const videoLessonsCount = lessons.filter(l => l.videoUrl).length

  if (loading) return <div className="container py-5 text-center">Loading...</div>
  if (!course) return <div className="container py-5 text-center">Course not found</div>

  // First preview-able lesson
  const firstPreviewLesson = lessons.find(l => l.videoUrl)

  return (
    <div className="course-detail-page">

      {/* ── Video Preview Modal ── */}
      {previewVideo && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000 }}
          onClick={closePreview}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content border-0 bg-dark shadow-lg" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
              <div className="modal-header border-0 bg-dark text-white px-4 py-3">
                <h5 className="modal-title fw-bold">🎬 Course Preview</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closePreview}></button>
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`${previewVideo}?autoplay=1&rel=0`}
                  title="Course Preview"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <div className="bg-dark text-white py-5 px-3">
        <div className="container-udemy">
          <div className="row">
            <div className="col-lg-8 text-center-mobile">
              <nav aria-label="breadcrumb" className="mb-3 d-none d-md-block">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/courses" className="text-primary text-decoration-none">Courses</Link></li>
                  <li className="breadcrumb-item active text-white" aria-current="page">{course.category}</li>
                </ol>
              </nav>
              <h1 className="display-5 fw-bold mb-3">{course.name}</h1>
              <p className="lead mb-4">
                {course.description
                  ? (course.description.length > 200 ? course.description.substring(0, 200) + '...' : course.description)
                  : 'No description available.'}
              </p>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 gap-md-3 mb-4 flex-wrap">
                <StarRating rating={course.rating || 0} count={course.reviewCount || 0} />
                <span className="small">Created by <span className="text-primary">{course.instructorName}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-udemy py-5 px-3">
        <div className="row g-5">
          <div className="col-lg-8">

            {/* ── What You'll Learn ── */}
            {objectives.length > 0 && (
              <div className="card shadow-sm p-4 mb-5 border-light animate-fade-in">
                <h3 className="fw-bold mb-3">What you'll learn</h3>
                <div className="row g-3">
                  {objectives.map((obj, i) => (
                    <div key={i} className="col-md-6 d-flex align-items-start gap-2">
                      <span className="text-success fw-bold flex-shrink-0">✓</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Course Content ── */}
            <h3 className="fw-bold mb-3">
              Course Content
              <span className="text-muted fw-normal fs-6 ms-3">
                {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                {videoLessonsCount > 0 && ` · ${videoLessonsCount} video${videoLessonsCount !== 1 ? 's' : ''}`}
              </span>
            </h3>
            <div className="list-group mb-5 shadow-sm">
              {lessons.length === 0 ? (
                <div className="list-group-item py-4 text-center text-muted">No lessons available.</div>
              ) : (
                lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-light">
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-light text-dark border rounded-circle"
                        style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="fw-medium">{lesson.title}</div>
                        {lesson.videoUrl && <small className="text-muted">📹 Video included</small>}
                      </div>
                    </div>
                    {isEnrolled ? (
                      <span className="text-muted small">Enrolled</span>
                    ) : idx < 2 && lesson.videoUrl ? (
                      <button
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => openPreview(lesson.videoUrl)}
                      >
                        ▶ Preview
                      </button>
                    ) : idx < 2 ? (
                      <span className="small text-muted">Preview</span>
                    ) : (
                      <span className="text-muted small">🔒</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ── Reviews Section ── */}
            <div className="mt-5">
              <h3 className="fw-bold mb-4">Student Reviews</h3>
              {isEnrolled && (
                <div className="card p-4 mb-4 border-0 shadow-sm bg-off-white animate-fade-in">
                  <h5 className="fw-bold mb-3">Leave a Review</h5>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="small fw-bold mb-1">Your Rating</label>
                      <RatingInput value={newReview.rating} onChange={(val) => setNewReview({ ...newReview, rating: val })} />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control border-light"
                        rows="3"
                        placeholder="What did you like or dislike about this course?"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-udemy-primary" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-muted">No reviews yet. Be the first to rate this course!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="review-item py-4 border-top">
                      <div className="d-flex gap-3 mb-2">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '40px', height: '40px' }}>
                          {r.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="fw-bold">{r.userName}</div>
                          <div className="small">
                            <StarRating rating={r.rating} showNumber={false} />
                            <span className="ms-2 text-muted extra-small">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mb-0 text-dark opacity-75">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="col-lg-4">
            <div className="card shadow sticky-top border-0 overflow-hidden" style={{ top: '100px' }}>
              <div className="position-relative">
                <img
                  src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                  className="card-img-top"
                  alt={course.name}
                />
                {firstPreviewLesson && (
                  <div
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openPreview(firstPreviewLesson.videoUrl)}
                    title="Watch Preview"
                  >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                      style={{ width: '60px', height: '60px', opacity: '0.95', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{ fontSize: '1.5rem', marginLeft: '4px' }}>▶</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="card-body p-4">
                {firstPreviewLesson && !isEnrolled && (
                  <button
                    className="btn btn-outline-secondary w-100 py-2 mb-2"
                    onClick={() => openPreview(firstPreviewLesson.videoUrl)}
                  >
                    ▶ Watch Preview
                  </button>
                )}
                {isEnrolled ? (
                  <button className="btn btn-outline-primary w-100 py-3 mb-2 fw-bold" onClick={() => navigate(`/courses/${course.id}/lessons`)}>
                    Go to Course
                  </button>
                ) : (
                  <button className="btn btn-udemy-primary w-100 py-3 mb-2" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold small mb-3">This course includes:</h6>
                  <ul className="list-unstyled small text-muted">
                    <li className="mb-2">📋 {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</li>
                    {videoLessonsCount > 0 && (
                      <li className="mb-2">📹 {videoLessonsCount} video{videoLessonsCount !== 1 ? 's' : ''}</li>
                    )}
                    <li className="mb-2">✓ Full access on enrollment</li>
                    <li className="mb-2">✓ Access on all devices</li>
                    <li className="mb-2">✓ Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
