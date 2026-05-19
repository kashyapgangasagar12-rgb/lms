import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLessonsForCourse, completeLesson } from '../services/lessonService'
import { getCourse } from '../services/courseService'
import { useAuth } from '../auth/AuthContext'
import { getYouTubeEmbedUrl } from '../utils/youtubeUtils'

export default function Lessons() {
  const { courseId } = useParams()
  const { user } = useAuth()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!courseId) return
    Promise.all([
      getCourse(courseId).then((r) => r.data).catch(() => null),
      getLessonsForCourse(courseId).then((r) => r.data).catch(() => []),
    ])
      .then(([c, list]) => {
        setCourse(c)
        setLessons(Array.isArray(list) ? list : [])
        if (list.length > 0) setCurrentLesson(list[0])
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load course content'))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleComplete = async (lessonId) => {
    try {
      await completeLesson(lessonId)
      setLessons(lessons.map(l => l.id === lessonId ? { ...l, completed: true } : l))
    } catch (err) {
      console.error('Failed to mark as complete', err)
    }
  }

  if (loading) return <div className="container py-5 text-center">Loading...</div>
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>

  return (
    <div className="lesson-player-page d-flex flex-column flex-lg-row bg-white min-vh-100">
      <div className="flex-grow-1 p-0 border-end border-light">
        {/* Main Content Area */}
        <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center" style={{ position: 'sticky', zIndex: 10, top: '72px' }}>
            <Link to={`/courses/${courseId}`} className="text-white text-decoration-none small hover-opacity-100">← Back to course</Link>
            <span className="fw-bold text-truncate mx-3">{course?.name}</span>
            <div className="small d-none d-sm-block">Progress: {lessons.filter(l => l.completed).length}/{lessons.length}</div>
        </div>

        <div className="p-3 p-md-4 p-lg-5 mx-auto" style={{ maxWidth: '1000px' }}>
          {currentLesson ? (
            <div className="lesson-content-view animate-fade-in">
              <h1 className="fw-bold h2 mb-4">{currentLesson.title}</h1>
              
              {currentLesson.videoUrl ? (
                <div className="ratio ratio-16x9 mb-5 rounded shadow-sm overflow-hidden bg-black border">
                  <iframe 
                    src={getYouTubeEmbedUrl(currentLesson.videoUrl)} 
                    title={currentLesson.title} 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="video-placeholder bg-dark ratio ratio-16x9 mb-5 rounded shadow-sm d-flex align-items-center justify-content-center text-white opacity-75">
                  <div className="text-center">
                      <div className="h1 mb-3">▶</div>
                      <div className="px-3">No video preview available for: {currentLesson.title}</div>
                  </div>
                </div>
              )}

              {currentLesson.attachmentsUrl && (
                <div className="alert alert-info border-0 shadow-sm mb-5 d-flex flex-column flex-sm-row align-items-center justify-content-between p-4 gap-3">
                  <div>
                    <h6 className="fw-bold mb-1">Study Materials Included</h6>
                    <p className="small mb-0 opacity-75">Download or view the resources for this lesson.</p>
                  </div>
                  <a href={currentLesson.attachmentsUrl} target="_blank" rel="noreferrer" className="btn btn-udemy-primary btn-sm w-100-mobile">Access Materials</a>
                </div>
              )}

              <div className="lesson-body text-dark" style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {currentLesson.content}
              </div>

              <div className="mt-5 pt-5 border-top d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <button className="btn btn-udemy-secondary" disabled={lessons.indexOf(currentLesson) === 0} onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson) - 1])}>Previous</button>
                {!currentLesson.completed && (
                  <button className="btn btn-udemy-primary px-4 px-md-5" onClick={() => handleComplete(currentLesson.id)}>Mark as Complete</button>
                )}
                <button className="btn btn-udemy-primary" disabled={lessons.indexOf(currentLesson) === lessons.length - 1} onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson) + 1])}>Next Lesson</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">Select a lesson from the curriculum</div>
          )}
        </div>
      </div>

      {/* Curriculum Sidebar */}
      <div className="curriculum-sidebar" style={{ position: 'sticky', top: '72px', zIndex: 5 }}>
        <div className="p-3 fw-bold border-bottom bg-off-white d-flex justify-content-between align-items-center">
            <span>Course Content</span>
            <span className="extra-small text-muted">{lessons.length} sections</span>
        </div>
        <div className="curriculum-scroll-area">
          {lessons.map((l, idx) => (
            <div 
              key={l.id} 
              className={`sidebar-item py-3 ${currentLesson?.id === l.id ? 'active' : ''}`}
              onClick={() => setCurrentLesson(l)}
            >
              <div className="d-flex align-items-center gap-3 px-3">
                  <div className="d-flex align-items-center">
                    <input type="checkbox" checked={l.completed} readOnly className="form-check-input m-0 cursor-pointer" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div className="flex-grow-1">
                      <div className={`small ${currentLesson?.id === l.id ? 'fw-bold text-dark' : 'text-muted'}`}>{idx + 1}. {l.title}</div>
                      <div className="text-muted extra-small mt-1">Video • 10min</div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
