<template>
  <section class="diplomas container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-award me-2"></i> Mis Diplomas
      </h2>
      <p class="text-muted">Consulta, descarga o recibe por correo tus diplomas digitales.</p>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center text-muted my-5">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p>Cargando información...</p>
    </div>

    <template v-else>
      <!-- ✅ DIPLOMAS DISPONIBLES -->
      <div class="card shadow-sm border-0 mb-5">
        <div class="card-header bg-success text-white fw-semibold">
          <i class="fas fa-check-circle me-2"></i> Diplomas Disponibles
        </div>
        <div class="card-body">
          <p v-if="diplomas.length === 0" class="text-center text-muted m-0">
            Aún no tienes diplomas generados.
          </p>

          <div v-else class="row g-4">
            <div v-for="d in diplomas" :key="d.id" class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body text-center">
                  <div class="icono mb-3 text-success">
                    <i class="fas fa-certificate fa-3x"></i>
                  </div>
                  <h5 class="fw-bold">{{ d.inscripcion?.taller?.nombre || 'Taller no especificado' }}</h5>
                  <p class="small text-muted mb-2">
                    <i class="fas fa-calendar-alt me-1"></i>
                    {{ formatearFecha(d.created_at) }}
                  </p>
                  <span class="badge bg-success mb-3">Disponible</span>

                  <div class="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      @click="descargar(d.id)"
                      class="btn btn-primary btn-sm px-3"
                      :disabled="loading && accion === 'descargar'"
                    >
                      <i class="fas fa-download me-2"></i>
                      {{ loading && accion === 'descargar' ? 'Descargando...' : 'Descargar PDF' }}
                    </button>
                    <button
                      @click="enviarPorCorreo(d.id)"
                      class="btn btn-outline-primary btn-sm px-3"
                      :disabled="loading && accion === 'enviar'"
                    >
                      <i class="fas fa-envelope me-2"></i>
                      {{ loading && accion === 'enviar' ? 'Enviando...' : 'Enviar por correo' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ⏳ DIPLOMAS PENDIENTES -->
      <div class="card shadow-sm border-0">
        <div class="card-header bg-warning fw-semibold">
          <i class="fas fa-hourglass-half me-2"></i> Diplomas Pendientes
        </div>
        <div class="card-body">
          <p v-if="pendientes.length === 0" class="text-center text-success fw-semibold m-0">
            🎉 ¡Felicidades! No tienes diplomas pendientes.
          </p>

          <div v-else class="row g-4">
            <div v-for="p in pendientes" :key="p.id" class="col-md-6 col-lg-4">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-body text-center">
                  <div class="icono mb-3 text-warning">
                    <i class="fas fa-clock fa-3x"></i>
                  </div>
                  <h5 class="fw-bold">{{ p.taller?.nombre || 'Taller sin nombre' }}</h5>
                  <p class="small text-muted mb-2">
                    <i class="fas fa-calendar-alt me-1"></i>
                    {{ p.taller?.fechaInicio ? formatearFecha(p.taller.fechaInicio) : 'Sin fecha' }}
                  </p>
                  <span class="badge bg-warning text-dark mb-3">Pendiente</span>
                  <p class="text-muted small mb-3">Asistencia pendiente para generar diploma.</p>

                  <button
                    v-if="auth.role === 'admin'"
                    class="btn btn-success btn-sm px-3"
                    @click="generarDiploma(p.id)"
                  >
                    <i class="fas fa-cogs me-2"></i> Generar manualmente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 📢 NOTIFICACIONES -->
    <notifications position="bottom right" />
  </section>
</template>

<script setup>
import { useNotification } from '@kyvg/vue3-notification'
import { onMounted, ref } from 'vue'
import api from '../../api/client'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const diplomas = ref([])
const pendientes = ref([])
const insValidas = ref([])
const loading = ref(true)
const accion = ref(null)
const notify = useNotification()

onMounted(async () => {
  await cargarDatos()
})

// 🔁 Función para recargar diplomas e inscripciones
async function cargarDatos() {
  try {
    loading.value = true

    const { data: disp } = await api.get(`/diplomas/usuario/${auth.userId}`)
    diplomas.value = disp

    const { data: ins } = await api.get(`/inscripciones/usuario/${auth.userId}`)
    insValidas.value = ins.filter((i) => i.taller)

    actualizarPendientes()
  } catch (err) {
    console.error(err)
    notify({
      type: 'error',
      title: 'Error al cargar',
      text: 'No se pudieron obtener tus diplomas o inscripciones.'
    })
  } finally {
    loading.value = false
  }
}

// 🧮 Actualiza lista de pendientes
function actualizarPendientes() {
  pendientes.value = insValidas.value.filter(
    (i) => !diplomas.value.some(
      (d) => d.inscripcion?.taller?.id === i.taller?.id
    )
  )
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

// ✅ Descargar diploma
async function descargar(id) {
  loading.value = true
  accion.value = 'descargar'
  try {
    const response = await api.get(`/diplomas/${id}/download`, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diploma_${id}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    notify({
      type: 'success',
      title: 'Descarga completa',
      text: 'El diploma se descargó correctamente.'
    })
  } catch (err) {
    notify({
      type: 'error',
      title: 'Error al descargar',
      text: 'No se pudo descargar el diploma.'
    })
  } finally {
    loading.value = false
    accion.value = null
  }
}

// ✅ Enviar diploma por correo
async function enviarPorCorreo(id) {
  loading.value = true
  accion.value = 'enviar'
  try {
    const { data } = await api.post(`/diplomas/${id}/enviar-correo`)
    notify({
      type: 'success',
      title: 'Correo enviado',
      text: `Diploma enviado a ${data.correo}`
    })
  } catch (err) {
    notify({
      type: 'error',
      title: 'Error al enviar',
      text: 'No se pudo enviar el diploma por correo.'
    })
  } finally {
    loading.value = false
    accion.value = null
  }
}

// 🔧 Generar diploma (solo admin)
async function generarDiploma(inscripcionId) {
  if (auth.role !== 'admin') return
  try {
    const { data } = await api.post(`/diplomas/generar/${inscripcionId}`)
    diplomas.value.push(data)
    actualizarPendientes()
    notify({
      type: 'success',
      title: 'Diploma generado',
      text: `Diploma creado para inscripción #${inscripcionId}`
    })
  } catch (err) {
    notify({
      type: 'error',
      title: 'Error',
      text: 'No se pudo generar el diploma.'
    })
  }
}
</script>

<style scoped>
.diplomas {
  font-family: 'Poppins', system-ui, sans-serif;
}
.icono i {
  transition: 0.3s;
}
.card:hover .icono i {
  transform: scale(1.1);
}
.badge {
  font-size: 0.85rem;
}
</style>
