import api from './api'

export const getAllUsers = () => api.get('/admin/users')
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
