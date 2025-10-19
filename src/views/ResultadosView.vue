<template>
  <section class="resultados container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-trophy me-2"></i> Resultados de  las Competencias
      </h2>
      <p class="text-muted">
        Consulta los ganadores de las competencias del <b>Congreso de Tecnología 2025</b>.
      </p>
    </div>

    <!-- FILTROS -->
    <div class="card shadow-sm border-0 p-3 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <label class="form-label fw-semibold text-secondary">Buscar competencia</label>
          <input
            v-model="busqueda"
            type="text"
            class="form-control"
            placeholder="Ej: Hackathon, Robótica, etc."
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold text-secondary">Filtrar por año</label>
          <select v-model="anioFiltro" class="form-select">
            <option value="">Todos los años</option>
            <option v-for="a in aniosDisponibles" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- TABLA -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-primary text-center">
            <tr>
              <th>Año</th>
              <th>Competencia</th>
              <th>Ganador</th>
              <th>Puesto</th>
              <th>Descripción</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
              </td>
            </tr>

            <tr v-if="!loading && resultadosFiltrados.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="fas fa-info-circle me-2"></i> No se encontraron resultados.
              </td>
            </tr>

            <tr v-for="r in resultadosFiltrados" :key="r.id" class="text-center align-middle">
              <td class="fw-semibold text-secondary">{{ r.anio }}</td>
              <td class="fw-semibold text-dark">{{ r.competencia }}</td>
              <td>
                <div class="d-flex align-items-center justify-content-center">
                  <div class="foto-wrapper">
                    <img
                      :src="getFoto(r.fotoUrl)"
                      alt="Foto del ganador"
                      class="foto-ganador me-2"
                      @error="onError($event)"
                    />
                  </div>
                  <span class="fw-semibold text-dark nombre-ganador">
                    {{ r.nombreGanador }}
                  </span>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': r.puesto === 1,
                    'bg-secondary': r.puesto === 2,
                    'bg-bronze': r.puesto === 3,
                    'bg-light text-dark': r.puesto > 3
                  }"
                >
                  🏅 {{ puestoTexto(r.puesto) }}
                </span>
              </td>
              <td class="text-muted small">{{ r.descripcion || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pie -->
    <p class="text-center text-muted mt-4 small">
      <i class="fas fa-university me-1"></i>
      Facultad de Ingeniería en Sistemas — MIUMG Guastatoya
    </p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../api/client'

const resultados = ref([])
const loading = ref(true)
const busqueda = ref('')
const anioFiltro = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/resultados')
    resultados.value = data
  } catch (err) {
    console.error('Error al cargar resultados', err)
  } finally {
    loading.value = false
  }
})

/**
 * ✅ Soporte completo de imágenes:
 * - Base64 (data:image)
 * - Google Drive (auto extrae ID)
 * - URL completa (http/https)
 * - Archivos locales del backend (/uploads)
 */
function getFoto(fotoUrl) {
  if (!fotoUrl) return '/default-user.png'

  const url = fotoUrl.replace(/^datos:/, 'data:')

  if (url.startsWith('data:image')) return url

  // 🔹 Google Drive link -> convierte a enlace directo
  if (url.includes('drive.google.com')) {
    const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    const match2 = url.match(/id=([a-zA-Z0-9_-]+)/)
    const fileId = match1?.[1] || match2?.[1]
    if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // 🔹 URL externa normal
  if (url.startsWith('http')) return url

  // 🔹 Imagen servida desde el backend (ej: /uploads/...)
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return `${base}/uploads/${url}`
}

function onError(e) {
  e.target.src = '/default-user.png'
}

const resultadosFiltrados = computed(() =>
  resultados.value.filter((r) => {
    const coincideNombre = r.competencia?.toLowerCase()?.includes(busqueda.value.toLowerCase())
    const coincideAnio = !anioFiltro.value || r.anio === parseInt(anioFiltro.value)
    return coincideNombre && coincideAnio
  })
)

const aniosDisponibles = computed(() => {
  const anios = resultados.value.map((r) => r.anio)
  return [...new Set(anios)].sort((a, b) => b - a)
})

function puestoTexto(puesto) {
  if (puesto === 1) return '1° Lugar'
  if (puesto === 2) return '2° Lugar'
  if (puesto === 3) return '3° Lugar'
  return `${puesto}°`
}
</script>

<style scoped>
.resultados {
  font-family: 'Poppins', system-ui, sans-serif;
}
.table th {
  font-weight: 600;
  letter-spacing: 0.3px;
}
.table tbody tr:hover {
  background-color: #f8f9fa;
  transition: 0.3s;
}
.badge.bg-bronze {
  background-color: #cd7f32;
}
.card {
  border-radius: 12px;
}
.foto-wrapper {
  width: 65px;
  height: 65px;
  display: grid;
  place-items: center;
  margin-right: 10px;
}
.foto-ganador {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.foto-ganador:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 14px rgba(0, 123, 255, 0.3);
}
.nombre-ganador {
  font-weight: 600;
  color: #212529;
}
</style>
