<template>
  <section class="admin container py-4">
    <!-- ENCABEZADO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-cogs me-2"></i> Administración de Talleres
      </h2>
      <p class="text-muted">Crea, edita y gestiona los talleres del Congreso de Tecnología.</p>
    </div>

    <!-- FORMULARIO -->
    <div class="card shadow-sm border-0 mb-5">
      <div class="card-header bg-primary text-white fw-semibold">
        {{ editando ? '✏️ Editar Taller' : '🧩 Crear Nuevo Taller' }}
      </div>
      <div class="card-body">
        <form @submit.prevent="guardarTaller" class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">Nombre del Taller</label>
            <input v-model="form.nombre" type="text" class="form-control" placeholder="Ej: IA aplicada" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Lugar</label>
            <input v-model="form.lugar" type="text" class="form-control" placeholder="Ej: Auditorio Central" required />
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">Descripción</label>
            <textarea
              v-model="form.descripcion"
              class="form-control"
              rows="2"
              placeholder="Describe brevemente el contenido del taller"
              required
            ></textarea>
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold">Fecha de Inicio</label>
            <input v-model="form.fechaInicio" type="datetime-local" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold">Fecha de Finalización</label>
            <input v-model="form.fechaFin" type="datetime-local" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label class="form-label fw-semibold">Cupos Disponibles</label>
            <input v-model.number="form.cupos" type="number" class="form-control" placeholder="Ej: 50" required />
          </div>

          <div class="col-12 text-center mt-3">
            <button type="submit" class="btn btn-primary me-2 px-4">
              <i class="fas fa-save me-2"></i>
              {{ editando ? 'Actualizar Taller' : 'Crear Taller' }}
            </button>
            <button
              v-if="editando"
              type="button"
              class="btn btn-secondary px-4"
              @click="cancelarEdicion"
            >
              <i class="fas fa-undo me-2"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- LISTA DE TALLERES -->
    <div class="card shadow-sm border-0 mb-5">
      <div class="card-header bg-light fw-semibold">
        <i class="fas fa-list-ul me-2 text-primary"></i> Talleres Registrados
      </div>
      <div class="card-body">
        <p v-if="loading" class="text-muted">Cargando talleres...</p>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="talleres.length" class="row g-3">
          <div v-for="t in talleres" :key="t.id" class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h5 class="fw-bold text-primary">{{ t.nombre }}</h5>
                <p class="small text-muted mb-1">
                  <i class="fas fa-calendar-alt me-1"></i> {{ formatoFecha(t.fechaInicio) }}
                </p>
                <p class="small text-muted mb-1">
                  <i class="fas fa-map-marker-alt me-1"></i> {{ t.lugar }}
                </p>
                <p class="small text-muted mb-2">
                  <i class="fas fa-users me-1"></i> Cupos: {{ t.cupos }}
                </p>
                <p class="mb-3">{{ t.descripcion }}</p>

                <div class="d-flex justify-content-between">
                  <button @click="editarTaller(t)" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-edit me-1"></i> Editar
                  </button>
                  <button @click="eliminarTaller(t.id)" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash-alt me-1"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-if="!loading && talleres.length === 0" class="text-center text-muted mt-3">
          No hay talleres registrados.
        </p>
      </div>
    </div>

    <!-- RESUMEN -->
    <div class="card shadow-sm border-0 mb-5">
      <div class="card-header bg-primary text-white fw-semibold">
        📊 Resumen de Inscripciones por Taller
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table v-if="resumen.length" class="table table-hover align-middle mb-0">
            <thead class="table-primary">
              <tr>
                <th>Taller</th>
                <th>Cupos</th>
                <th>Inscritos</th>
                <th>Disponibles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in resumen" :key="r.tallerId">
                <td>{{ r.nombre }}</td>
                <td>{{ r.cupos }}</td>
                <td>{{ r.inscritos }}</td>
                <td :class="{ 'text-danger fw-bold': r.disponibles <= 3 }">{{ r.disponibles }}</td>
                <td>
                  <button @click="verInscritos(r)" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye me-1"></i> Ver inscritos
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-if="!resumen.length" class="text-center text-muted p-3 mb-0">
            No hay datos de inscripciones.
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL DE INSCRITOS -->
    <div v-if="mostrandoModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="fas fa-users me-2"></i> Inscritos en {{ tallerSeleccionado?.nombre }}
            </h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <table v-if="inscritos.length" class="table table-bordered table-striped">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Colegio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(i, index) in inscritos" :key="i.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ i.usuario.nombre }}</td>
                  <td>{{ i.usuario.correo }}</td>
                  <td>{{ i.usuario.telefono || 'N/A' }}</td>
                  <td>{{ i.usuario.colegio || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>

            <p v-else class="text-muted text-center mb-0">No hay inscritos en este taller.</p>
          </div>
          <div class="modal-footer">
            <button @click="exportarPDF" class="btn btn-success">
              <i class="fas fa-file-pdf me-2"></i> Exportar PDF
            </button>
            <button @click="cerrarModal" class="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { onMounted, ref } from 'vue'
import api from '../../api/client'
import logoCongreso from '../../assets/logo.png'

const talleres = ref([])
const resumen = ref([])
const inscritos = ref([])
const form = ref({
  id: null,
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  cupos: 0,
  lugar: '',
})
const loading = ref(true)
const error = ref('')
const editando = ref(false)
const mostrandoModal = ref(false)
const tallerSeleccionado = ref(null)

onMounted(() => {
  cargarTalleres()
  cargarResumen()
})

async function cargarTalleres() {
  loading.value = true
  try {
    const { data } = await api.get('/talleres')
    talleres.value = data
  } catch {
    error.value = 'Error al cargar talleres'
  } finally {
    loading.value = false
  }
}

async function guardarTaller() {
  try {
    if (editando.value) {
      await api.put(`/talleres/${form.value.id}`, form.value)
      alert('✅ Taller actualizado correctamente')
    } else {
      await api.post('/talleres', form.value)
      alert('✅ Taller creado correctamente')
    }
    limpiarFormulario()
    await cargarTalleres()
  } catch (err) {
    alert(err.response?.data?.message || 'Error al guardar taller')
  }
}

function editarTaller(t) {
  form.value = { ...t }
  editando.value = true
}

function cancelarEdicion() {
  limpiarFormulario()
}

function limpiarFormulario() {
  form.value = { id: null, nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', cupos: 0, lugar: '' }
  editando.value = false
}

async function eliminarTaller(id) {
  if (!confirm('¿Seguro que deseas eliminar este taller?')) return
  await api.delete(`/talleres/${id}`)
  await cargarTalleres()
}

function formatoFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

async function cargarResumen() {
  try {
    const { data } = await api.get('/inscripciones/resumen')
    resumen.value = data
  } catch {
    resumen.value = []
  }
}

async function verInscritos(taller) {
  const { data } = await api.get(`/inscripciones/taller/${taller.tallerId}`)
  inscritos.value = data
  tallerSeleccionado.value = taller
  mostrandoModal.value = true
}

function cerrarModal() {
  mostrandoModal.value = false
}

function exportarPDF() {
  if (!inscritos.value.length || !tallerSeleccionado.value) return
  const doc = new jsPDF('p', 'mm', 'a4')
  const fecha = new Date().toLocaleDateString()
  doc.addImage(logoCongreso, 'PNG', 14, 10, 25, 25)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Congreso de Tecnología - MIUMG', 45, 20)
  doc.setFontSize(12)
  doc.text(`Listado de Inscritos: ${tallerSeleccionado.value.nombre}`, 45, 28)
  doc.setFontSize(10)
  doc.text(`Fecha: ${fecha}`, 45, 34)
  autoTable(doc, {
    head: [['#', 'Nombre', 'Correo', 'Teléfono', 'Colegio']],
    body: inscritos.value.map((i, index) => [index + 1, i.usuario.nombre, i.usuario.correo, i.usuario.telefono || 'N/A', i.usuario.colegio || 'N/A']),
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [25, 118, 210] },
  })
  doc.save(`Inscritos_${tallerSeleccionado.value.nombre}.pdf`)
}
</script>

<style scoped>
.admin {
  font-family: 'Poppins', system-ui, sans-serif;
}
.modal {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>
