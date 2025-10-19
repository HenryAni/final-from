<template>
  <section class="talleres container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-chalkboard-teacher me-2"></i> Talleres Disponibles
      </h2>
      <p class="text-muted">
        Explora los talleres y usa los filtros para encontrar los que más te interesen del
        <b>Congreso de Tecnología 2025</b>.
      </p>
    </div>

    <!-- FILTROS -->
    <div class="card shadow-sm border-0 p-3 mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-4">
          <label class="form-label fw-semibold text-secondary">Buscar por nombre</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            class="form-control"
            placeholder="Ej. Inteligencia Artificial"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold text-secondary">Filtrar por fecha</label>
          <input v-model="filtros.fecha" type="date" class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label fw-semibold text-secondary">Filtrar por lugar</label>
          <select v-model="filtros.lugar" class="form-select">
            <option value="">Todos</option>
            <option v-for="l in lugaresUnicos" :key="l" :value="l">{{ l }}</option>
          </select>
        </div>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-outline-secondary btn-sm me-2" @click="limpiarFiltros">
          <i class="fas fa-eraser me-1"></i> Limpiar
        </button>
        <button class="btn btn-primary btn-sm" @click="aplicarFiltros">
          <i class="fas fa-filter me-1"></i> Aplicar
        </button>
      </div>
    </div>

    <!-- ESTADO DE CARGA -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Cargando talleres...</p>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="alert alert-danger text-center shadow-sm">
      <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
    </div>

    <!-- LISTADO DE TALLERES -->
    <div v-if="!loading && talleresFiltrados.length" class="row g-4">
      <div
        v-for="t in talleresFiltrados"
        :key="t.id"
        class="col-md-6 col-lg-4 d-flex align-items-stretch"
      >
        <div class="card shadow-sm border-0 w-100">
          <div class="card-body d-flex flex-column">
            <h5 class="fw-bold text-primary mb-2">
              <i class="fas fa-laptop-code me-2"></i>{{ t.nombre }}
            </h5>

            <p class="text-muted small mb-1">
              <i class="fas fa-calendar-alt me-2"></i>{{ formatoFecha(t.fechaInicio) }}
            </p>
            <p class="text-muted small mb-1">
              <i class="fas fa-map-marker-alt me-2"></i>{{ t.lugar }}
            </p>

            <!-- Cupos -->
            <div class="mb-3">
              <small class="d-block text-secondary">
                <i class="fas fa-users me-2"></i>Cupos:
                {{ inscripcionesPorTaller[t.id] || 0 }} / {{ t.cupos }}
              </small>

              <div class="progress mt-1" style="height: 8px;">
                <div
                  class="progress-bar"
                  :class="cuposDisponibles(t.id) > 3 ? 'bg-success' : 'bg-danger'"
                  role="progressbar"
                  :style="{ width: `${ocupacionPorcentaje(t.id)}%` }"
                ></div>
              </div>
            </div>

            <p class="flex-grow-1 text-secondary small">{{ t.descripcion }}</p>

            <div class="mt-3">
              <button
                v-if="!inscritos.includes(t.id)"
                @click="inscribirse(t.id)"
                class="btn btn-primary w-100 fw-semibold shadow-sm"
                :disabled="cuposDisponibles(t.id) <= 0"
              >
                <i class="fas fa-user-plus me-2"></i>
                {{ cuposDisponibles(t.id) > 0 ? 'Inscribirme' : 'Cupos llenos' }}
              </button>

              <button
                v-else
                disabled
                class="btn btn-outline-success w-100 fw-semibold shadow-sm"
              >
                <i class="fas fa-check-circle me-2"></i> Ya estás inscrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SIN RESULTADOS -->
    <div v-if="!loading && talleresFiltrados.length === 0" class="text-center text-muted py-5">
      <i class="fas fa-info-circle fa-2x mb-2 text-primary"></i>
      <p>No se encontraron talleres con los filtros aplicados.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../../api/client'
import { useAuthStore } from '../../stores/auth'

const talleres = ref([])
const inscritos = ref([])
const inscripcionesPorTaller = ref({})
const loading = ref(true)
const error = ref('')
const auth = useAuthStore()

// 🎯 Filtros
const filtros = ref({
  busqueda: '',
  fecha: '',
  lugar: '',
})

onMounted(async () => {
  try {
    const { data } = await api.get('/talleres')
    talleres.value = data
    await cargarInscripciones()
  } catch {
    error.value = 'Error al cargar talleres'
  } finally {
    loading.value = false
  }
})

// 📋 Inscripciones
async function cargarInscripciones() {
  try {
    const { data } = await api.get('/inscripciones')
    inscripcionesPorTaller.value = contarInscripciones(data)
    const { data: misIns } = await api.get(`/inscripciones/usuario/${auth.userId}`)
    inscritos.value = misIns.map((i) => i.taller.id)
  } catch {
    inscritos.value = []
  }
}

function contarInscripciones(lista) {
  const conteo = {}
  lista.forEach((i) => {
    const id = i.taller.id
    conteo[id] = (conteo[id] || 0) + 1
  })
  return conteo
}

function cuposDisponibles(tallerId) {
  const total = talleres.value.find((t) => t.id === tallerId)?.cupos || 0
  const usados = inscripcionesPorTaller.value[tallerId] || 0
  return total - usados
}

function ocupacionPorcentaje(tallerId) {
  const total = talleres.value.find((t) => t.id === tallerId)?.cupos || 0
  const usados = inscripcionesPorTaller.value[tallerId] || 0
  return total ? (usados / total) * 100 : 0
}

async function inscribirse(tallerId) {
  try {
    await api.post('/inscripciones', {
      usuarioId: auth.userId,
      tallerId,
    })
    inscritos.value.push(tallerId)
    alert('✅ Inscripción realizada con éxito.')
    await cargarInscripciones()
  } catch (err) {
    alert(err.response?.data?.message || 'Error al inscribirse')
  }
}

function formatoFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

// 🎯 Computed: Talleres filtrados dinámicamente
const talleresFiltrados = computed(() => {
  return talleres.value.filter((t) => {
    const coincideBusqueda =
      t.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    const coincideFecha =
      !filtros.value.fecha ||
      new Date(t.fechaInicio).toISOString().slice(0, 10) === filtros.value.fecha
    const coincideLugar =
      !filtros.value.lugar || t.lugar === filtros.value.lugar

    return coincideBusqueda && coincideFecha && coincideLugar
  })
})

// 🏫 Lugares únicos para el select
const lugaresUnicos = computed(() => {
  return [...new Set(talleres.value.map((t) => t.lugar).filter(Boolean))]
})

// 🧹 Filtros
function limpiarFiltros() {
  filtros.value = { busqueda: '', fecha: '', lugar: '' }
}

function aplicarFiltros() {
  // En este caso no se necesita lógica adicional porque el filtrado es reactivo,
  // pero podríamos agregar animaciones o loaders si se quisiera.
}
</script>

<style scoped>
.talleres {
  font-family: 'Poppins', system-ui, sans-serif;
}
.card {
  border-radius: 14px;
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.progress {
  border-radius: 6px;
  overflow: hidden;
}
.btn {
  transition: all 0.2s ease-in-out;
}
.btn:hover {
  transform: translateY(-1px);
}
</style>
