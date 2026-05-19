import api from './api'

export const getCourses = () => api.get('/courses')
export const getCourse = (id) => api.get(`/courses/${id}`)
export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)

export const enrollCourse = (id) => api.post(`/courses/${id}/enroll`)
export const getEnrolledCourses = () => api.get('/courses/enrolled')
