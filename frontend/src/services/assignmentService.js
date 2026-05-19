import api from './api'

export const getAllAssignments = () => api.get('/assignments')
export const getMyAssignments = (studentId) => api.get(`/assignments/my?studentId=${studentId}`)
export const getAssignmentsByCourse = (courseId) => api.get(`/assignments/course/${courseId}`)
export const createAssignment = (data) => api.post('/assignments', data)

export const submitAssignment = (data) => api.post('/submissions', data)
export const getSubmissionsByAssignment = (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`)
export const getMySubmissions = (studentId) => api.get(`/submissions/my?studentId=${studentId}`)
export const gradeSubmission = (submissionId, grade, feedback) =>
    api.post(`/submissions/${submissionId}/grade?grade=${grade}${feedback ? '&feedback=' + feedback : ''}`)

export const getTeacherAnalytics = () => api.get('/assignments/teacher/analytics')
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`)
export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data)
