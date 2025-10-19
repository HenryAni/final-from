<template>
  <section class="d-flex align-items-center justify-content-center min-vh-100 bg-light register-bg">
    <div class="card shadow-lg border-0 rounded-4 p-4 p-md-5" style="max-width: 750px; width: 100%;">
      <div class="card-body">
        <!-- Encabezado -->
        <div class="text-center mb-4">
          <img src="../assets/logo.png" alt="Logo Congreso" style="width: 70px;" class="mb-2" />
          <h3 class="fw-bold text-primary mb-2">Registro de Participantes</h3>
          <p class="text-muted">
            Completa tus datos para inscribirte en el <b>Congreso de Tecnología</b>.<br />
            Usa tu correo institucional <b>@miumg.edu.gt</b> o <b>@gmail.com</b>.
          </p>
        </div>

        <!-- FORMULARIO -->
        <form v-if="!qrCodigo" @submit.prevent="registrar">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre completo</label>
              <input v-model="nombre" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Correo electrónico</label>
              <input v-model="correo" type="email" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Contraseña</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Teléfono</label>
              <input v-model="telefono" type="tel" class="form-control" placeholder="Opcional" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Colegio o Universidad</label>
              <input v-model="colegio" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Carrera</label>
              <input v-model="carrera" type="text" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha de Nacimiento</label>
              <input v-model="fechaNacimiento" type="date" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Dirección</label>
              <input v-model="direccion" type="text" class="form-control" />
            </div>
          </div>

          <!-- Botón principal -->
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary px-5 py-2 fw-semibold shadow-sm">
              <i class="fas fa-user-plus me-2"></i> Registrarme
            </button>
          </div>

          <!-- Mensajes -->
          <p v-if="msg" class="text-success text-center fw-semibold mt-3">{{ msg }}</p>
          <p v-if="error" class="text-danger text-center fw-semibold mt-3">{{ error }}</p>
        </form>

        <!-- SECCIÓN QR -->
        <div v-else class="text-center">
          <h4 class="fw-bold text-success mb-3">¡Registro completado con éxito!</h4>
          <p class="text-muted mb-4">
            Este es tu código QR personal. Guárdalo o descárgalo, lo necesitarás para tus asistencias.
          </p>

          <div id="qr-area" class="p-4 bg-white rounded shadow-sm d-inline-block">
            <qrcode-vue :value="qrCodigo" :size="220" />
            <p class="mt-3 mb-0"><b>Código:</b> {{ qrCodigo }}</p>
          </div>

          <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <button class="btn btn-primary" @click="descargarImagen">
              <i class="fas fa-image me-2"></i> Descargar Imagen
            </button>
            <button class="btn btn-outline-primary" @click="descargarPDF">
              <i class="fas fa-file-pdf me-2"></i> Descargar PDF
            </button>
          </div>

          <div class="mt-4">
            <button class="btn btn-dark px-4" @click="$router.push('/login')">
              <i class="fas fa-sign-in-alt me-2"></i> Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'; // 👈 usamos axios directo SOLO aquí
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QrcodeVue from 'qrcode.vue';
import { ref } from 'vue';

// ✅ URL absoluta del backend (sin duplicar /api)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const nombre = ref('');
const correo = ref('');
const password = ref('');
const telefono = ref('');
const colegio = ref('');
const carrera = ref('');
const fechaNacimiento = ref('');
const direccion = ref('');

const msg = ref('');
const error = ref('');
const qrCodigo = ref(null);

async function registrar() {
  msg.value = '';
  error.value = '';
  qrCodigo.value = null;

  try {
    const res = await axios.post(`${API_URL}/api/usuarios/registrar`, {
      nombre: nombre.value,
      correo: correo.value,
      password: password.value,
      telefono: telefono.value || undefined,
      colegio: colegio.value || undefined,
      carrera: carrera.value || undefined,
      fechaNacimiento: fechaNacimiento.value || undefined,
      direccion: direccion.value || undefined,
    });

    qrCodigo.value = res.data.qrCodigo;
    msg.value = `✅ ${res.data.nombre} registrado correctamente.`;
  } catch (err) {
    console.error('Error en registro:', err);
    error.value = err.response?.data?.message || 'Error al registrarse';
  }
}

async function descargarImagen() {
  const qrElement = document.getElementById('qr-area');
  const canvas = await html2canvas(qrElement);
  const link = document.createElement('a');
  link.download = 'mi-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function descargarPDF() {
  const qrElement = document.getElementById('qr-area');
  const canvas = await html2canvas(qrElement);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.text('Código QR - Congreso de Tecnología 2025', 14, 20);
  pdf.addImage(imgData, 'PNG', 15, 30, width - 30, height);
  pdf.save('mi-qr.pdf');
}
</script>

<style scoped>
/* Fondo institucional con imagen */
.register-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(
      rgba(25, 118, 210, 0.75),
      rgba(13, 71, 161, 0.85)
    ),
    url('../assets/umg.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

/* 🧩 Tarjeta principal */
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
  width: 100%;
  max-width: 750px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* Botones */
.btn-primary {
  background-color: #1976d2;
  border: none;
}
.btn-primary:hover {
  background-color: #0d47a1;
}
.btn-outline-primary:hover {
  background-color: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

/* ⚙️ Contenedor QR adaptable */
#qr-area {
  display: inline-block;
  max-width: 100%;
  text-align: center;
}
#qr-area canvas {
  width: 100%;
  max-width: 220px;
  height: auto;
}

/* Responsividad */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
  }

  #qr-area canvas {
    max-width: 180px;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  #qr-area canvas {
    max-width: 160px;
  }
  .fw-bold.text-primary.mb-2 {
    font-size: 1.25rem;
  }
}
</style>
