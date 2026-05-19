import api from './api'

export const getLessonsForCourse = (courseId) => api.get(`/lessons/course/${courseId}`)
export const getLesson = (id) => api.get(`/lessons/${id}`)
export const createLesson = (data) => api.post('/lessons', data)
export const completeLesson = (id) => api.post(`/lessons/${id}/complete`)
export const getProgress = () => api.get('/lessons/progress')
export const getCourseProgress = (courseId) => api.get(`/lessons/progress/${courseId}`)

