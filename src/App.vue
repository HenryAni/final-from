<template>
  <div>
    <!-- Mostrar NavBar solo en rutas públicas -->
    <NavBar v-if="mostrarNavbar" />
    <main class="container-fluid p-0">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()

// 🔹 Oculta la NavBar en login, register y todo el dashboard
const mostrarNavbar = computed(() => {
  const path = route.path
  return !(
    path.startsWith('/dashboard') ||
    path === '/login' ||
    path === '/register'||
     path === '/resultados' 
                
  )
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  background: transparent;
}

main {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
