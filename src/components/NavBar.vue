<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top py-2"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" @click.prevent="$router.push('/')">
        <i class="fas fa-microchip text-primary"></i>
        Congreso de Tecnología
      </a>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        @click="menuAbierto = !menuAbierto"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Enlaces -->
      <div class="collapse navbar-collapse" :class="{ show: menuAbierto }" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/register">Registrarse</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="btn btn-primary btn-sm ms-lg-3 px-3" to="/login">
              <i class="fas fa-sign-in-alt me-1"></i> Iniciar sesión
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const menuAbierto = ref(false)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
}
.navbar-scrolled {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.nav-link {
  font-weight: 500;
  color: #333 !important;
}
.nav-link:hover {
  color: #0d6efd !important;
}
.navbar-brand {
  cursor: pointer;
}
</style>
