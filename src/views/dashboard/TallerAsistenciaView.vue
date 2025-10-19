<template>
  <section class="asistencia-admin container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-clipboard-check me-2"></i> Control de Asistencia
      </h2>
      <p class="text-muted">
        Administra la asistencia de los participantes en cada taller del Congreso de Tecnología.
      </p>
    </div>

    <!-- SELECCIÓN DEL TALLER -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <label class="form-label fw-semibold text-secondary">Seleccionar taller</label>
            <select
              v-model="tallerSeleccionado"
              class="form-select"
              @change="cargarInscritos"
              required
            >
              <option disabled value="">-- Selecciona un taller --</option>
              <option v-for="t in talleres" :key="t.id" :value="t.id">
                {{ t.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4 text-center mt-3 mt-md-0">
            <button
              class="btn btn-primary px-4"
              :disabled="!tallerSeleccionado || loading"
              @click="cargarInscritos"
            >
              <i class="fas fa-sync-alt me-2"></i>
              Cargar Inscritos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA DE INSCRITOS -->
    <div v-if="inscritos.length" class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-primary text-white fw-semibold">
        <i class="fas fa-users me-2"></i> Estudiantes Inscritos ({{ inscritos.length }})
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary text-center">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Código QR</th>
                <th>Asistencia</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in inscritos" :key="i.id" class="text-center">
                <td class="fw-semibold">{{ i.usuario.nombre }}</td>
                <td>{{ i.usuario.correo }}</td>
                <td><code>{{ i.usuario.qrCodigo }}</code></td>
                <td>
                  <span
                    v-if="asistencias.includes(i.id)"
                    class="badge bg-success px-3 py-2"
                  >
                    ✅ Asistió
                  </span>
                  <span
                    v-else
                    class="badge bg-warning text-dark px-3 py-2"
                  >
                    ⏳ Pendiente
                  </span>
                </td>
                <td>
                  <button
                    v-if="!asistencias.includes(i.id)"
                    class="btn btn-outline-primary btn-sm"
                    @click="registrarAsistenciaManual(i)"
                  >
                    <i class="fas fa-user-check me-1"></i> Registrar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MENSAJES DE ESTADO -->
    <div v-if="loading" class="text-center text-muted my-4">
      <div class="spinner-border text-primary mb-2" role="status"></div>
      <p>Cargando datos...</p>
    </div>
    <div v-else-if="tallerSeleccionado && !inscritos.length" class="alert alert-info text-center">
      No hay inscritos en este taller.
    </div>

    <!-- ESCANEO DE QR -->
    <div v-if="tallerSeleccionado" class="card shadow-sm border-0 mt-4">
      <div class="card-header bg-light fw-semibold">
        <i class="fas fa-qrcode text-primary me-2"></i> Escanear Código QR
      </div>
      <div class="card-body text-center">
        <qrcode-stream @detect="onDetect" class="qr-stream"></qrcode-stream>
        <p class="text-muted mt-3 small">
          Apunta la cámara hacia el código QR del participante para registrar asistencia.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import api from '../../api/client'

const talleres = ref([])
const inscritos = ref([])
const asistencias = ref([])
const tallerSeleccionado = ref('')
const loading = ref(false)

onMounted(async () => {
  const { data } = await api.get('/talleres')
  talleres.value = data
})

async function cargarInscritos() {
  if (!tallerSeleccionado.value) return
  loading.value = true
  try {
    const { data } = await api.get(`/inscripciones/taller/${tallerSeleccionado.value}`)
    inscritos.value = data
    const { data: a } = await api.get(`/asistencia/taller/${tallerSeleccionado.value}`)
    asistencias.value = a.map(x => x.inscripcion.id)
  } finally {
    loading.value = false
  }
}

async function registrarAsistenciaManual(i) {
  try {
    await api.post('/asistencia/registrar', {
      qrCodigo: i.usuario.qrCodigo,
      tallerId: tallerSeleccionado.value,
    })
    asistencias.value.push(i.id)
  } catch (err) {
    alert(err.response?.data?.message || 'Error al registrar asistencia')
  }
}

async function onDetect(detected) {
  const qr = detected[0].rawValue
  try {
    await api.post('/asistencia/registrar', {
      qrCodigo: qr,
      tallerId: tallerSeleccionado.value,
    })
    alert('✅ Asistencia registrada correctamente.')
    await cargarInscritos()
  } catch (err) {
    alert(err.response?.data?.message || 'Error al registrar asistencia')
  }
}
</script>

<style scoped>
.asistencia-admin {
  font-family: 'Poppins', system-ui, sans-serif;
}

.qr-stream {
  display: inline-block;
  width: 320px;
  max-width: 100%;
  height: 240px;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid #1976d2;
  box-shadow: 0 0 15px rgba(25, 118, 210, 0.3);
}

/* Responsividad */
@media (max-width: 768px) {
  .qr-stream {
    width: 100%;
    height: 220px;
  }
}
</style>
