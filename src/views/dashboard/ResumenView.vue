<template>
  <section class="resumen container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-user-circle me-2"></i> Mi Perfil
      </h2>
      <p class="text-muted">
        Vista general de tu participación en el <b>Congreso de Tecnología 2025</b>.
      </p>
    </div>

    <!-- TARJETAS PRINCIPALES -->
    <div class="row g-4">
      <!-- QR -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100 text-center p-3">
          <div class="icono bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3">
            <i class="fas fa-qrcode fa-2x"></i>
          </div>
          <h5 class="fw-bold">Mi Código QR</h5>
          <div v-if="qrCodigo" class="mt-3">
            <qrcode-vue :value="qrCodigo" :size="150" />
            <p class="text-muted small mt-2">{{ qrCodigo }}</p>
          </div>
          <p v-else class="text-muted small">Cargando QR…</p>
        </div>
      </div>

      <!-- INSCRIPCIONES -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100 p-3">
          <div class="icono bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-3">
            <i class="fas fa-clipboard-list fa-2x"></i>
          </div>
          <h5 class="fw-bold text-center">Mis Inscripciones</h5>

          <div v-if="inscripciones.length" class="mt-3">
            <ul class="list-group list-group-flush small">
              <li
                v-for="i in inscripciones"
                :key="i.id"
                class="list-group-item d-flex flex-column"
              >
                <b>{{ i.taller?.nombre || 'Taller sin nombre' }}</b>
                <span class="text-muted">
                  <i class="fas fa-calendar-alt me-1"></i>
                  {{ i.taller?.fechaInicio ? formatear(i.taller.fechaInicio) : 'Sin fecha' }}
                </span>
                <span class="text-muted">
                  <i class="fas fa-map-marker-alt me-1"></i>
                  {{ i.taller?.lugar || 'Sin lugar' }}
                </span>
              </li>
            </ul>
          </div>

          <p v-else class="text-muted text-center small mt-3">
            Aún no te has inscrito en talleres.
          </p>
        </div>
      </div>

      <!-- DIPLOMAS -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0 h-100 text-center p-3">
          <div class="icono bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-3">
            <i class="fas fa-award fa-2x"></i>
          </div>
          <h5 class="fw-bold">Mis Diplomas</h5>
          <div v-if="loading" class="text-muted small mt-3">
            <div class="spinner-border text-warning spinner-border-sm me-2" role="status"></div>
            Cargando información...
          </div>
          <div v-else class="mt-3">
            <p v-if="diplomas.length > 0" class="mb-0">
              <span class="fw-semibold text-success">
                {{ diplomas.length }}
              </span>
              {{ diplomas.length === 1 ? 'diploma disponible' : 'diplomas disponibles' }} 🎓
            </p>
            <p v-else class="text-muted small mb-0">
              Todavía no tienes diplomas generados.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- RESUMEN VISUAL -->
    <div class="card shadow-sm border-0 mt-5 p-4">
      <h5 class="fw-bold text-primary mb-3">
        <i class="fas fa-chart-line me-2"></i> Resumen de Progreso
      </h5>
      <p class="text-muted small mb-4">
        Visualiza tu avance en el Congreso según tus inscripciones y diplomas obtenidos.
      </p>

      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <span class="fw-semibold">Talleres inscritos</span>
          <span class="text-muted small">{{ inscripciones.length }} / {{ totalTalleres }}</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div
            class="progress-bar bg-success"
            role="progressbar"
            :style="{ width: `${porcentajeInscripciones}%` }"
            :aria-valuenow="porcentajeInscripciones"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <span class="fw-semibold">Diplomas obtenidos</span>
          <span class="text-muted small">{{ diplomas.length }}</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div
            class="progress-bar bg-warning"
            role="progressbar"
            :style="{ width: `${porcentajeDiplomas}%` }"
            :aria-valuenow="porcentajeDiplomas"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      <div>
        <div class="d-flex justify-content-between">
          <span class="fw-semibold">Participación general</span>
          <span class="text-muted small">{{ porcentajeTotal }}%</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div
            class="progress-bar bg-primary"
            role="progressbar"
            :style="{ width: `${porcentajeTotal}%` }"
            :aria-valuenow="porcentajeTotal"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>

    <!-- RECOMENDACIONES -->
    <div class="mt-5">
      <h5 class="fw-bold text-primary mb-3">
        <i class="fas fa-lightbulb me-2"></i> Recomendaciones para ti
      </h5>

      <!-- Personalizada -->
      <div
        v-if="recomendacionPersonalizada"
        :class="['alert', recomendacionTipo, 'shadow-sm', 'fade', 'show']"
        role="alert"
      >
        <i class="fas fa-star me-2"></i>
        {{ recomendacionPersonalizada }}
      </div>

      <!-- Estáticas -->
      <div class="alert alert-info shadow-sm fade show mb-2" role="alert">
        <i class="fas fa-check-circle me-2"></i>
        Recuerda asistir puntualmente a tus talleres para asegurar tu diploma de participación.
      </div>
      <div class="alert alert-secondary shadow-sm fade show" role="alert">
        <i class="fas fa-bullhorn me-2"></i>
        ¡Sigue participando! Entre más talleres completes, más oportunidades tendrás de ganar premios.
      </div>
    </div>
  </section>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { computed, onMounted, ref } from 'vue'
import api from '../../api/client'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const qrCodigo = ref('')
const inscripciones = ref([])
const diplomas = ref([])
const totalTalleres = 10 // 🔹 cambiar si lo tomas desde API
const loading = ref(true)

onMounted(async () => {
  try {
    const { data: usuario } = await api.get(`/usuarios/${auth.userId}`)
    qrCodigo.value = usuario.qrCodigo

    const { data: misIns } = await api.get(`/inscripciones/usuario/${auth.userId}`)
    inscripciones.value = misIns

    const { data: misDiplomas } = await api.get(`/diplomas/usuario/${auth.userId}`)
    diplomas.value = misDiplomas
  } catch (err) {
    console.error('Error al cargar resumen', err)
  } finally {
    loading.value = false
  }
})

function formatear(fechaIso) {
  return new Date(fechaIso).toLocaleString()
}

// 📊 Cálculos de progreso
const porcentajeInscripciones = computed(() => Math.min((inscripciones.value.length / totalTalleres) * 100, 100))
const porcentajeDiplomas = computed(() => Math.min(diplomas.value.length * 20, 100))
const porcentajeTotal = computed(() =>
  Math.round((porcentajeInscripciones.value * 0.6 + porcentajeDiplomas.value * 0.4))
)

// 💡 Recomendaciones dinámicas
const recomendacionPersonalizada = computed(() => {
  if (porcentajeTotal.value >= 90) {
    return '¡Excelente! Has completado casi todo, estás entre los participantes más activos 🎉'
  } else if (porcentajeTotal.value >= 60) {
    return 'Vas muy bien 👏, aprovecha los últimos talleres para conseguir todos tus diplomas.'
  } else if (porcentajeTotal.value > 0) {
    return 'Te recomendamos inscribirte en más talleres para mejorar tu participación 💪.'
  } else {
    return '¡Empieza hoy mismo! Inscríbete a tu primer taller y genera tu primer diploma 🚀.'
  }
})

const recomendacionTipo = computed(() => {
  if (porcentajeTotal.value >= 90) return 'alert-success'
  if (porcentajeTotal.value >= 60) return 'alert-primary'
  if (porcentajeTotal.value > 0) return 'alert-warning'
  return 'alert-danger'
})
</script>

<style scoped>


.resumen {
  font-family: 'Poppins', system-ui, sans-serif;
}
.icono {
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
}
.card {
  border-radius: 14px;
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.list-group-item {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.list-group-item:last-child {
  border-bottom: none;
}
.progress {
  border-radius: 6px;
  overflow: hidden;
}
.alert {
  border-radius: 10px;
  font-size: 0.95rem;
}
</style>
