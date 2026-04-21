import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - يقرأ التوكن من axios.defaults (يُضبط عند تسجيل الدخول)
api.interceptors.request.use(
  (config) => {
    const authHeader = axios.defaults.headers.common['Authorization']
    if (authHeader) {
      config.headers.Authorization = authHeader
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - امسح التوكن وارجع لصفحة الدخول
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('ajwaa_token')
      localStorage.removeItem('ajwaa_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Ticket APIs
export const ticketAPI = {
  list: (params) => api.get('/tickets', { params }),
  create: (data) => api.post('/tickets', data),
  get: (id) => api.get(`/tickets/${id}`),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
  addAttachment: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/attachments/upload/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Service APIs
export const serviceAPI = {
  list: (params) => api.get('/services', { params }),
  create: (data) => api.post('/services', data),
  get: (id) => api.get(`/services/${id}`),
  update: (id, data) => api.put(`/services/${id}`, data),
}

// User APIs
export const userAPI = {
  list: (params) => api.get('/users', { params }),
  create: (data) => api.post('/users', data),
  get: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  restore: (id) => api.put(`/users/${id}/restore`),
}

export const attachmentAPI = {
  delete: (id) => api.delete(`/attachments/${id}`),
}

// Sector APIs
export const sectorAPI = {
  list: () => api.get('/sectors'),
  create: (data) => api.post('/sectors', data),
  get: (id) => api.get(`/sectors/${id}`),
  update: (id, data) => api.put(`/sectors/${id}`, data),
}

// Department APIs
export const departmentAPI = {
  list: () => api.get('/sectors/departments/list'),
  create: (data) => api.post('/sectors/departments', data),
  update: (id, data) => api.put(`/sectors/departments/${id}`, data),
  delete: (id) => api.delete(`/sectors/departments/${id}`),
}

// Phase APIs
export const phaseAPI = {
  list: () => api.get('/sectors/phases/list'),
  create: (data) => api.post('/sectors/phases', data),
  update: (id, data) => api.put(`/sectors/phases/${id}`, data),
  delete: (id) => api.delete(`/sectors/phases/${id}`),
}

// Dashboard APIs
export const dashboardAPI = {
  stats: () => api.get('/tickets/stats/dashboard'),
  chartData: () => api.get('/tickets/stats/dashboard'),
}

// Logs APIs
export const logsAPI = {
  list: (params) => api.get('/logs', { params }),
  get: (id) => api.get(`/logs/${id}`),
  clear: () => api.delete('/logs'),
}
