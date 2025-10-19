import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import api from '../api/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null, // { sub, correo, rol }
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.rol || null,
    userId: (state) => state.user?.sub || null,
  },

  actions: {
    hydrateFromToken() {
      if (this.token) {
        try {
          this.user = jwtDecode(this.token)
        } catch (e) {
          this.logout()
        }
      }
    },

    async login(correo, password) {
      const { data } = await api.post('/auth/login', { correo, password })
      this.token = data.access_token
      localStorage.setItem('token', this.token)
      this.hydrateFromToken()
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
