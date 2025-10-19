import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DashboardView from '../views/DashboardView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'


// Subvistas
import AdminView from '../views/dashboard/AdminView.vue'
import DiplomasView from '../views/dashboard/DiplomasView.vue'
import ReportesView from '../views/dashboard/ReportesView.vue'
import ResultadosAdmin from '../views/dashboard/ResultadosAdmin.vue'
import ResumenView from '../views/dashboard/ResumenView.vue'
import TallerAsistenciaView from '../views/dashboard/TallerAsistenciaView.vue'
import TalleresView from '../views/dashboard/TalleresView.vue'
import UsuariosAdminView from '../views/dashboard/UsuariosAdminView.vue'
import ResultadosView from '../views/ResultadosView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard/resumen' },
        { path: 'talleres', component: TalleresView },
        { path: 'diplomas', component: DiplomasView },
        { path: 'admin', component: AdminView, meta: { requiresAdmin: true } },
        { path: 'resumen', component: ResumenView },
        { path: 'reportes', component: ReportesView, meta: { requiresAdmin: true } },
        { path: '/resultados', component: ResultadosView },
        { path: 'resultados', component: ResultadosAdmin, meta: { requiresAdmin: true } },
        { path: 'asistencia', component: TallerAsistenciaView, meta: { requiresAdmin: true } },
        { path: 'usuarios', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true }, },
        { path: 'usuarioss', component: UsuariosAdminView, meta: { requiresAdmin: true } },
        

      ],
    },
  ],
})

// 🛡 Protección
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!auth.user && auth.token) auth.hydrateFromToken()

  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.requiresAdmin && auth.role !== 'admin') return next('/dashboard')
  next()
})

export default router

