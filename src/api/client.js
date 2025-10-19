import axios from 'axios'

// ⚙️ Config base — ajusta prefijo API automáticamente
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const api = axios.create({
  baseURL: `${API_BASE}/api`, // 👈 añade prefijo /api automáticamente
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🎯 Interceptor de requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Log más legible
    console.log(`📡 [${config.method?.toUpperCase()}] → ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// ⚠️ Interceptor de responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('⚠️ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`
    })

    if (error.response?.status === 401) {
      // Token inválido → cerrar sesión automática
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
