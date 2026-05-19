import api from './api'

export const listStudents = () => api.get('/teacher/students')
export const getStudentAnalytics = (studentId) => api.get(`/submissions/analytics/student/${studentId}`)
