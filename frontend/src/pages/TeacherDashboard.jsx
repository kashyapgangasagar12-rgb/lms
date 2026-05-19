import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTeacherAnalytics } from '../services/assignmentService'
import { listStudents, getStudentAnalytics } from '../services/teacherService'
import { useAuth } from '../auth/AuthContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function TeacherDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [students, setStudents] = useState([])
  const [showStudents, setShowStudents] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Student Details State
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [detailedAnalytics, setDetailedAnalytics] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [analyticsRes, studentsRes] = await Promise.all([
        getTeacherAnalytics(),
        listStudents()
      ])
      setAnalytics(analyticsRes.data)
      setStudents(studentsRes.data || [])
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (student) => {
    setSelectedStudent(student)
    setDetailedAnalytics(null)
    setModalLoading(true)
    try {
      const res = await getStudentAnalytics(student.id)
      setDetailedAnalytics(res.data)
    } catch (err) {
      console.error('Failed to fetch student details', err)
    } finally {
      setModalLoading(false)
    }
  }

  // Chart Configuration
  const chartData = {
    labels: analytics?.trends?.map(t => t.title) || [],
    datasets: [
      {
        label: 'Average Score (%)',
        data: analytics?.trends?.map(t => t.averageScore) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
            display: true,
            text: 'Score (%)'
        }
      }
    }
  }

  if (loading) return <div className="container py-5 text-center">Loading...</div>

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Instructor Dashboard</h1>
        <p className="text-muted">Manage your courses and track student performance.</p>
      </div>

      <div className="row g-3 g-md-4 mb-5 animate-fade-in">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 p-md-4 text-center h-100 glass-card">
            <div className="fs-3 fs-md-1 fw-bold text-dark mb-1">{students.length}</div>
            <div className="extra-small text-muted fw-bold text-uppercase">Total Students</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 p-md-4 text-center h-100 glass-card">
            <div className="fs-3 fs-md-1 fw-bold text-dark mb-1">{analytics?.totalAssignments || 0}</div>
            <div className="extra-small text-muted fw-bold text-uppercase">Active Assignments</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 p-md-4 text-center h-100 glass-card">
            <div className="fs-3 fs-md-1 fw-bold text-primary mb-1">{analytics?.pendingGrades || 0}</div>
            <div className="extra-small text-muted fw-bold text-uppercase">Pending Review</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 p-md-4 text-center h-100 glass-card">
            <div className="fs-3 fs-md-1 fw-bold text-dark mb-1">{analytics?.averageScore?.toFixed(1) || 0}%</div>
            <div className="extra-small text-muted fw-bold text-uppercase">Avg. Performance</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
            {showStudents ? (
                <div className="card shadow-sm border-0 p-4 bg-white h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0">Student Directory</h5>
                        <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setShowStudents(false)}>Back to Trends</button>
                    </div>
                    <div className="table-responsive shadow-sm rounded">
                        <table className="table table-hover align-middle" style={{ minWidth: '600px' }}>
                            <thead className="table-light">
                                <tr>
                                    <th className="px-3 border-0">NAME</th>
                                    <th className="px-3 border-0">EMAIL</th>
                                    <th className="px-3 border-0 text-end">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-3 py-3 fw-bold">{s.fullName}</td>
                                        <td className="px-3 py-3 text-muted small">{s.email}</td>
                                        <td className="px-3 py-3 text-end">
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleViewDetails(s)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5 text-muted">No students enrolled yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
               <div className="card shadow-sm border-0 p-4 bg-white h-100" style={{ minHeight: '450px' }}>
                    <h5 className="fw-bold mb-4">Performance Trends</h5>
                    <div style={{ height: '350px' }} className="w-100">
                        {analytics?.trends?.length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted">
                                <div className="display-4 opacity-25 mb-3">📈</div>
                                <p className="small italic">Not enough submission data to visualize trends yet.</p>
                            </div>
                        )}
                    </div>
               </div>
            )}
        </div>

        <div className="col-lg-4">
            <div className="d-flex flex-column h-100 gap-4">
                <div className="card shadow-sm border-0 p-4">
                    <h5 className="fw-bold mb-4">Quick Actions</h5>
                    <div className="d-flex flex-column gap-3">
                        <Link to="/manage-courses" className="btn btn-primary py-3 fw-bold">Manage Courses</Link>
                        <Link to="/manage-assignments" className="btn btn-outline-primary py-3 fw-bold">Grade Assignments</Link>
                        <button 
                            className={`btn py-3 fw-bold ${showStudents ? 'btn-dark' : 'btn-outline-dark'}`} 
                            onClick={() => setShowStudents(!showStudents)}
                        >
                            {showStudents ? 'View Activity' : 'View Student List'}
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm border-0 p-4 flex-grow-1">
                    <div className="small text-muted fw-bold mb-3">QUICK STATS</div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="small">Submissions Received</span>
                        <span className="small fw-bold text-dark">{analytics?.totalSubmissions || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="small">Grading Completion</span>
                        <span className="small fw-bold text-success">
                          {analytics?.totalSubmissions > 0 
                            ? Math.round(((analytics.totalSubmissions - analytics.pendingGrades) / analytics.totalSubmissions) * 100) 
                            : 100}%
                        </span>
                    </div>
                    <div className="progress mb-3" style={{ height: '5px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ 
                            width: `${analytics?.totalSubmissions > 0 
                              ? Math.round(((analytics.totalSubmissions - analytics.pendingGrades) / analytics.totalSubmissions) * 100) 
                              : 100}%` 
                          }}
                        ></div>
                    </div>
                    <div className="small text-muted mt-auto pt-2">
                        Overall student average is <span className="text-primary fw-bold">{analytics?.averageScore?.toFixed(1) || 0}%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Student Details Overlay */}
      {selectedStudent && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1200 }}>
              <div className="bg-white p-5 shadow rounded" style={{ maxWidth: '500px', width: '90%' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold m-0">{selectedStudent.fullName}</h4>
                      <button className="btn-close" onClick={() => setSelectedStudent(null)}></button>
                  </div>
                  <div className="border-top pt-4">
                      <p className="text-muted small mb-3">Email: {selectedStudent.email}</p>
                      <h6 className="fw-bold">Performance Summary</h6>
                      {modalLoading ? (
                          <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                      ) : detailedAnalytics ? (
                          <div className="row g-2 mt-2">
                              <div className="col-6">
                                  <div className="bg-light p-3 rounded text-center">
                                      <div className="h5 fw-bold mb-0">{detailedAnalytics.overallStats?.averageScore?.toFixed(1) || 0}%</div>
                                      <div className="extra-small text-muted">AVG SCORE</div>
                                  </div>
                              </div>
                              <div className="col-6">
                                  <div className="bg-light p-3 rounded text-center">
                                      <div className="h5 fw-bold mb-0">{detailedAnalytics.overallStats?.totalAttempts || 0}</div>
                                      <div className="extra-small text-muted">ATTEMPTS</div>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <p className="small text-muted">No data available.</p>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}
