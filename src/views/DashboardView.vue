<template>
  <div class="dashboard d-flex flex-column flex-md-row min-vh-100">
    <!-- SIDEBAR -->
    <aside class="sidebar d-flex flex-column flex-shrink-0 p-3 text-white">
      <div class="text-center mb-4">
        <img src="../assets/logo.png" alt="Logo Congreso" class="logo mb-2" />
        <h5 class="fw-bold">Congreso UMG</h5>
      </div>

      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/dashboard/resumen">
            <i class="fas fa-home me-2"></i> Inicio
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav-link" to="/dashboard/talleres">
            <i class="fas fa-chalkboard-teacher me-2"></i> Talleres
          </RouterLink>
        </li>
        
        <li>
          <RouterLink class="nav-link" to="/dashboard/diplomas">
            <i class="fas fa-award me-2"></i> Mis Diplomas
          </RouterLink>
        </li>
        <li>
          <RouterLink class="nav-link" to="/resultados">
            <i class="fas fa-poll me-2"></i> Resultados Compotencias
          </RouterLink>
        </li>
      
        <li v-if="auth.role === 'admin'">
          <RouterLink class="nav-link" to="/dashboard/resultados">
            <i class="fas fa-list-check me-2"></i> Administrador Compotencias
          </RouterLink>
        </li>
         <li v-if="auth.role === 'admin'">
          <RouterLink class="nav-link" to="/dashboard/asistencia">
            <i class="fas fa-list-check me-2"></i> Asistencia Talleres
          </RouterLink>
        </li>
          <li v-if="auth.role === 'admin'">
            <RouterLink class="nav-link" to="/dashboard/usuarioss">
              <i class="fas fa-users-cog me-2"></i> Gestión de Usuarios
            </RouterLink>
          </li>
          <li v-if="auth.role === 'admin'">
          <RouterLink class="nav-link" to="/dashboard/admin">
            <i class="fas fa-tools me-2"></i> Administración Talleres
          </RouterLink>
        </li>
        <li v-if="auth.role === 'admin'">
          <RouterLink class="nav-link" to="/dashboard/reportes">
            <i class="fas fa-chart-bar me-2"></i> Reportes
          </RouterLink>
        </li>
      </ul>

      <div class="mt-auto text-center">
        <button @click="logout" class="btn btn-outline-light w-100">
          <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="flex-grow-1 bg-light">
      <header class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div class="container-fluid">
          <h4 class="fw-bold text-primary m-0">
            <i class="fas fa-microchip me-2"></i> Panel de Control
          </h4>
          <div class="text-end">
            <small class="text-muted d-block">
              {{ auth.user?.correo }} <span class="badge bg-primary text-light ms-1">{{ auth.role }}</span>
            </small>
          </div>
        </div>
      </header>

      <section class="p-4">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ---------- GENERAL LAYOUT ---------- */
.dashboard {
  font-family: 'Poppins', system-ui, sans-serif;
  overflow: hidden;
}

/* ---------- SIDEBAR ---------- */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #0d47a1, #1976d2);
  min-height: 100vh;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
}
.sidebar .logo {
  width: 60px;
  height: 60px;
}
.sidebar .nav-link {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s;
}
.sidebar .nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}
.sidebar .router-link-exact-active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

/* ---------- MAIN CONTENT ---------- */
main {
  flex-grow: 1;
}
header.navbar {
  border-bottom: 1px solid #eaeaea;
}
section {
  min-height: calc(100vh - 80px);
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    width: 100%;
    height: auto;
    min-height: unset;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0;
  }
  .sidebar ul {
    flex-direction: row;
  }
  .sidebar .mt-auto {
    display: none;
  }
  main {
    margin-top: 80px;
  }
}
</style>
