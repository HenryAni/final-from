<template>
  <section class="reportes">
    <h2>📊 Reportes del Congreso</h2>

    <div v-if="loading">Cargando reportes...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading" class="grid">
      <div class="card">
        <h3>Total de Talleres</h3>
        <p class="numero">{{ resumen.talleres }}</p>
      </div>

      <div class="card">
        <h3>Total de Inscripciones</h3>
        <p class="numero">{{ resumen.inscripciones }}</p>
      </div>

      <div class="card">
        <h3>Asistencias Registradas</h3>
        <p class="numero">{{ resumen.asistencias }}</p>
      </div>

      <div class="card">
        <h3>Diplomas Generados</h3>
        <p class="numero">{{ resumen.diplomas }}</p>
      </div>
    </div>

    <h3 style="margin-top: 40px;">📈 Asistencia por Taller</h3>
    <canvas id="graficoAsistencia" width="400" height="200"></canvas>
  </section>
</template>

<script setup>
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import api from '../../api/client'

const loading = ref(true)
const error = ref('')
const resumen = ref({ talleres: 0, inscripciones: 0, asistencias: 0, diplomas: 0 })
const datosTalleres = ref([])

onMounted(async () => {
  try {
    // Cargar datos generales
    const [talleres, inscripciones, asistencias, diplomas, reporteTalleres] = await Promise.all([
      api.get('/talleres'),
      api.get('/inscripciones'),
      api.get('/asistencia'),
      api.get('/diplomas'),
      api.get('/asistencia/reporte/talleres'),
    ])

    resumen.value = {
      talleres: talleres.data.length,
      inscripciones: inscripciones.data.length,
      asistencias: asistencias.data.length,
      diplomas: diplomas.data.length,
    }

    datosTalleres.value = reporteTalleres.data
    crearGrafico()
  } catch (err) {
    error.value = 'Error al cargar reportes'
  } finally {
    loading.value = false
  }
})

function crearGrafico() {
  const ctx = document.getElementById('graficoAsistencia')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datosTalleres.value.map((t) => t.nombre),
      datasets: [
        {
          label: 'Asistentes',
          data: datosTalleres.value.map((t) => t.asistentes),
          backgroundColor: '#1976d2aa',
        },
        {
          label: 'Cupos',
          data: datosTalleres.value.map((t) => t.cupos),
          backgroundColor: '#64b5f6aa',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  })
}
</script>

<style scoped>
.reportes {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
.numero {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
}
.error {
  color: #d32f2f;
}
</style>
