<template>
  <section class="admin-resultados container py-4">
    <!-- TÍTULO -->
    <div class="text-center mb-5">
      <h2 class="fw-bold text-primary">
        <i class="fas fa-trophy me-2"></i> Agregar Resultados de Competencias
      </h2>
      <p class="text-muted">Gestiona los ganadores y resultados de las competencias del Congreso.</p>
    </div>

    <!-- FORMULARIO -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-primary text-white fw-semibold">
        <i class="fas fa-edit me-2"></i>
        {{ editando ? 'Editar Resultado' : 'Registrar Nuevo Resultado' }}
      </div>

      <div class="card-body">
        <form @submit.prevent="guardar" class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">Competencia</label>
            <input
              v-model="form.competencia"
              type="text"
              class="form-control"
              placeholder="Ej: Hackathon de IA"
              required
            />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold">Nombre del Ganador</label>
            <input
              v-model="form.nombreGanador"
              type="text"
              class="form-control"
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold">Puesto</label>
            <input
              v-model.number="form.puesto"
              type="number"
              class="form-control"
              placeholder="Ej: 1"
              required
            />
          </div>

          <div class="col-md-4">
            <label class="form-label fw-semibold">Año</label>
            <input
              v-model="form.anio"
              type="number"
              class="form-control"
              placeholder="Ej: 2025"
            />
          </div>

          <!-- 🔹 CAMPO PARA SUBIR IMAGEN -->
          <div class="col-md-4">
            <label class="form-label fw-semibold">Foto del ganador</label>
            <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="onFileChange"
            />
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">Descripción</label>
            <textarea
              v-model="form.descripcion"
              class="form-control"
              rows="2"
              placeholder="Detalles sobre el resultado o reconocimiento"
            ></textarea>
          </div>

          <div class="col-12 text-center mt-2">
            <button type="submit" class="btn btn-primary px-4 me-2">
              <i class="fas fa-save me-2"></i>
              {{ editando ? 'Actualizar' : 'Guardar' }}
            </button>
            <button
              v-if="editando"
              type="button"
              class="btn btn-secondary px-4"
              @click="cancelar"
            >
              <i class="fas fa-undo me-2"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light fw-semibold">
        <i class="fas fa-list-ul text-primary me-2"></i> Resultados Registrados
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table v-if="resultados.length" class="table table-hover align-middle mb-0">
            <thead class="table-primary">
              <tr>
                <th>Año</th>
                <th>Competencia</th>
                <th>Ganador</th>
                <th>Puesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in resultados" :key="r.id">
                <td class="fw-semibold">{{ r.anio }}</td>
                <td>{{ r.competencia }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img
                      v-if="r.fotoUrl"
                      :src="r.fotoUrl"
                      alt="Foto"
                      class="rounded-circle border"
                      style="width: 45px; height: 45px; object-fit: cover;"
                    />
                    <span class="fw-semibold">{{ r.nombreGanador }}</span>
                  </div>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success': r.puesto === 1,
                      'bg-warning text-dark': r.puesto === 2,
                      'bg-secondary': r.puesto === 3
                    }"
                  >
                    {{ r.puesto }}° Lugar
                  </span>
                </td>
                <td>
                  <button @click="editar(r)" class="btn btn-sm btn-outline-primary me-1">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminar(r.id)" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="text-center text-muted p-3 mb-0">
            No hay resultados registrados.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../api/client'

const resultados = ref([])
const selectedFile = ref(null)

const form = ref({
  competencia: '',
  nombreGanador: '',
  puesto: 1,
  anio: new Date().getFullYear(),
  descripcion: '',
  fotoUrl: ''
})
const editando = ref(false)
const editId = ref(null)

onMounted(cargar)

async function cargar() {
  const { data } = await api.get('/resultados')
  resultados.value = data
}

// 🔹 Cuando seleccionan un archivo
function onFileChange(e) {
  selectedFile.value = e.target.files[0]
}

async function guardar() {
  try {
    // 📸 Subir imagen si existe
    if (selectedFile.value) {
      const fd = new FormData()
      fd.append('file', selectedFile.value)
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      form.value.fotoUrl = data.url
    }

    if (editando.value) {
      await api.put(`/resultados/${editId.value}`, form.value)
      alert('✅ Resultado actualizado correctamente')
    } else {
      await api.post('/resultados', form.value)
      alert('✅ Resultado agregado correctamente')
    }

    cancelar()
    await cargar()
  } catch (err) {
    console.error(err)
    alert('❌ Error al guardar el resultado')
  }
}

function editar(r) {
  form.value = { ...r }
  editId.value = r.id
  editando.value = true
}

function cancelar() {
  form.value = {
    competencia: '',
    nombreGanador: '',
    puesto: 1,
    anio: new Date().getFullYear(),
    descripcion: '',
    fotoUrl: ''
  }
  selectedFile.value = null
  editando.value = false
}

async function eliminar(id) {
  if (confirm('¿Eliminar este resultado?')) {
    await api.delete(`/resultados/${id}`)
    alert('🗑 Eliminado correctamente')
    await cargar()
  }
}
</script>

<style scoped>
.admin-resultados {
  font-family: 'Poppins', system-ui, sans-serif;
}
.badge {
  font-size: 0.9rem;
}
.table td,
.table th {
  vertical-align: middle;
}
.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
img.rounded-circle {
  border: 2px solid #dee2e6;
}
</style>
