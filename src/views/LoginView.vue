<template>
  <!-- Sección con imagen de fondo -->
  <section
    class="vh-100 d-flex align-items-center justify-content-center login-bg"
  >
    <div class="card shadow-lg border-0 rounded-4" style="max-width: 420px; width: 100%;">
      <div class="card-body p-4 p-md-5 text-center bg-white bg-opacity-95 rounded-4">
        <!-- Logo y título -->
        <div class="mb-4">
          <img
            src="../assets/logo.png"
            alt="Logo Congreso"
            style="width: 70px; height: 70px;"
            class="mb-2"
          />
          <h4 class="fw-bold text-primary">Congreso de Tecnología</h4>
          <p class="text-muted small mb-0">Acceso al panel de control</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="login" class="text-start">
          <div class="mb-3">
            <label for="correo" class="form-label small fw-semibold">Correo electrónico</label>
            <input
              v-model="correo"
              type="email"
              id="correo"
              class="form-control form-control-sm"
              placeholder="ejemplo@miumg.edu.gt"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label small fw-semibold">Contraseña</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control form-control-sm"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-semibold py-2 mt-2">
            <i class="fas fa-sign-in-alt me-2"></i> Iniciar sesión
          </button>

          <p v-if="error" class="text-danger small text-center mt-3 mb-0">
            {{ error }}
          </p>
        </form>

        <!-- Pie -->
        <div class="mt-4 text-muted small">
          <a href="#" class="text-decoration-none text-secondary me-2">¿Olvidaste tu contraseña?</a> |
          <a href="/register" class="text-decoration-none text-primary ms-2">Crear cuenta</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const correo = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const router = useRouter()

async function login() {
  try {
    await auth.login(correo.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Credenciales incorrectas'
  }
}
</script>

<style scoped>
/* Fondo institucional: ocupa toda la pantalla sin dejar bordes blancos */
.login-bg {
  position: fixed; /* Fija el fondo a la ventana */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* Cubre todo el alto */
  background: linear-gradient(rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.85)),
              url('../assets/umg.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 0;
}

/* Tarjeta centrada sobre el fondo */
.card {
  background-color: #ffffff;
  position: relative;
  z-index: 2; /* Encima del fondo */
}

/* Botón principal */
.btn-primary {
  background-color: #0d6efd;
  border: none;
  transition: 0.3s ease;
}
.btn-primary:hover {
  background-color: #0b5ed7;
  transform: translateY(-1px);
}

/* Elimina márgenes del body que causan scroll */
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

</style>
