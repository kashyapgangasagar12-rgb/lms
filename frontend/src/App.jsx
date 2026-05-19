import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import CourseList from './pages/CourseList'
import Lessons from './pages/Lessons'
import CourseDetail from './pages/CourseDetail'
import Assignments from './pages/Assignments'
import AssignmentSubmission from './pages/AssignmentSubmission'
import CourseManagement from './pages/CourseManagement'
import ManageAssignments from './pages/ManageAssignments'
import AdminDashboard from './pages/AdminDashboard'
import Privacy from './pages/Privacy'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container py-5 text-center text-muted">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === 'STUDENT' ? '/dashboard' : '/teacher'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<PrivateRoute roles={['STUDENT']}><StudentDashboard /></PrivateRoute>} />
        <Route path="teacher" element={<PrivateRoute roles={['TEACHER', 'ADMIN']}><TeacherDashboard /></PrivateRoute>} />
        <Route path="manage-courses" element={<PrivateRoute roles={['TEACHER', 'ADMIN']}><CourseManagement /></PrivateRoute>} />
        <Route path="manage-assignments" element={<PrivateRoute roles={['TEACHER', 'ADMIN']}><ManageAssignments /></PrivateRoute>} />
        <Route path="admin" element={<PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
        <Route path="courses" element={<PrivateRoute><CourseList /></PrivateRoute>} />
        <Route path="courses/:courseId" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
        <Route path="courses/:courseId/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
        <Route path="assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
        <Route path="assignments/:id/submit" element={<PrivateRoute roles={['STUDENT']}><AssignmentSubmission /></PrivateRoute>} />
        <Route path="privacy" element={<Privacy />} />
      </Route>
    </Routes>
  )
}
