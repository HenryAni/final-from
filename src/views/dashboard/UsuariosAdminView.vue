<template>
  <section class="usuarios-admin">
    <h2>👥 Gestión de Usuarios</h2>
    <p class="muted">Lista completa de usuarios registrados. Solo los administradores pueden cambiar roles.</p>

    <p v-if="loading" class="loading">Cargando usuarios...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="usuarios.length" class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Tipo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nombre }}</td>
          <td>{{ u.correo }}</td>
          <td>{{ u.tipo }}</td>
          <td>
            <select v-model="u.rol" class="select-rol">
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>
            <button @click="actualizarRol(u)" class="btn-guardar">💾 Guardar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && usuarios.length === 0" class="muted">
      No hay usuarios registrados.
    </p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../api/client'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const usuarios = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await cargarUsuarios()
})

// 🔁 Cargar lista de usuarios
async function cargarUsuarios() {
  try {
    const { data } = await api.get('/usuarios', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    usuarios.value = data
  } catch (err) {
    console.error(err)
    error.value = 'No se pudieron cargar los usuarios.'
  } finally {
    loading.value = false
  }
}

// 💾 Actualizar rol
async function actualizarRol(usuario) {
  try {
    await api.patch(
      `/usuarios/${usuario.id}/rol`,
      { rol: usuario.rol },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )
    alert(`✅ Rol actualizado correctamente para ${usuario.nombre}`)
  } catch (err) {
    console.error(err)
    alert('❌ Error al actualizar el rol')
  }
}
</script>

<style scoped>
.usuarios-admin {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Poppins', system-ui, sans-serif;
}
h2 {
  color: #1976d2;
  margin-bottom: 10px;
}
.muted {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
}
.loading {
  text-align: center;
  color: #555;
}
.error {
  color: #d32f2f;
  text-align: center;
  margin-bottom: 10px;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.tabla th {
  background: #1976d2;
  color: white;
  padding: 10px;
  text-align: left;
}
.tabla td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.select-rol {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.btn-guardar {
  background: #1976d2;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.btn-guardar:hover {
  background: #125aa2;
}
</style>
