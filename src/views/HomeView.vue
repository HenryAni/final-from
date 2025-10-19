<template>
  <!-- Hero principal -->
  <section class="hero position-relative d-flex align-items-center justify-content-center text-center text-white">
    <div class="overlay"></div>
    <div class="container position-relative z-2">
      <h1 class="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
        Congreso de Tecnología
      </h1>
      <h2 class="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
        Universidad Mariano Gálvez
      </h2>
      <p class="lead mb-4 animate__animated animate__fadeInUp">
        Innovación, aprendizaje y comunidad. Vive el evento tecnológico más importante del año.
      </p>
      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-primary btn-lg px-4 fw-semibold shadow-lg" @click="$router.push('/register')">
          <i class="fas fa-user-plus me-2"></i> Registrarme
        </button>
        <button class="btn btn-outline-light btn-lg px-4 fw-semibold shadow-lg" @click="$router.push('/login')">
          <i class="fas fa-sign-in-alt me-2"></i> Iniciar sesión
        </button>
      </div>
      <small class="d-block mt-4 text-light opacity-75">
        🎓 Cupos limitados • Diplomas garantizados
      </small>
    </div>
  </section>

  <!-- Sección de beneficios -->
  <section class="py-5 bg-light text-center">
    <div class="container">
      <h2 class="fw-bold text-primary mb-5">Explora las experiencias del Congreso</h2>
      <div class="row g-4">
        <div class="col-md-4" v-for="(b, i) in beneficios" :key="i">
          <div class="glass-card p-4 h-100 shadow-sm">
            <i :class="b.icono + ' fa-3x text-primary mb-3'"></i>
            <h5 class="fw-bold mb-2">{{ b.titulo }}</h5>
            <p class="text-muted">{{ b.descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Agenda -->
  <section class="agenda-section text-center py-5 text-white">
    <div class="overlay-dark"></div>
    <div class="container position-relative z-2">
      <h2 class="fw-bold mb-4">Agenda Destacada</h2>
      <div class="row g-4 justify-content-center">
        <div class="col-md-3" v-for="(a, i) in agenda" :key="i">
          <div class="card bg-transparent border-light text-white shadow-sm">
            <div class="card-body">
              <h4 class="fw-bold">{{ a.hora }}</h4>
              <p class="mb-1">{{ a.actividad }}</p>
              <small class="opacity-75">{{ a.lugar }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-5 bg-white">
    <div class="container">
      <h2 class="fw-bold text-center text-primary mb-4">Preguntas Frecuentes</h2>
      <div class="accordion accordion-flush mx-auto" id="faqAccordion" style="max-width: 800px;">
        <div class="accordion-item" v-for="(p, i) in preguntas" :key="i">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" :data-bs-target="'#faq' + i">
              {{ p.titulo }}
            </button>
          </h2>
          <div :id="'faq' + i" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div class="accordion-body text-muted">
              {{ p.descripcion }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA final -->
  <section class="cta text-center text-white py-5">
    <div class="overlay"></div>
    <div class="container position-relative z-2">
      <h3 class="fw-bold mb-3">¿Listo para formar parte del cambio?</h3>
      <p class="mb-4">Innova, aprende y crece junto a los mejores en tecnología.</p>
      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-light btn-lg fw-semibold px-4" @click="$router.push('/register')">
          Crear cuenta
        </button>
        <button class="btn btn-outline-light btn-lg fw-semibold px-4" @click="$router.push('/login')">
          Ya tengo cuenta
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const beneficios = [
  { icono: 'fas fa-user-check', titulo: 'Inscripción Simple', descripcion: 'Regístrate con tu correo institucional o Gmail, y recibe tu QR automático.' },
  { icono: 'fas fa-laptop-code', titulo: 'Talleres y Competencias', descripcion: 'Elige tus actividades, aprende de expertos y demuestra tus habilidades.' },
  { icono: 'fas fa-award', titulo: 'Diplomas Automáticos', descripcion: 'Descarga tus reconocimientos y diplomas de participación desde tu perfil.' },
]

const agenda = [
  { actividad: 'Taller de Inteligencia Artificial', lugar: 'Aula 101' },
  { actividad: 'Competencia de Programación', lugar: 'Laboratorio 2' },
  { actividad: 'Ponencia: Carrera en Sistemas', lugar: 'Auditorio Principal' },
]

const preguntas = [
  { titulo: '¿Cómo me inscribo?', descripcion: 'Haz clic en “Registrarme”, completa tus datos y confirma. Luego inicia sesión.' },
  { titulo: '¿Cómo se toma la asistencia?', descripcion: 'Escanea tu QR personal al llegar. Quedará registrada automáticamente.' },
  { titulo: '¿Recibo diploma?', descripcion: 'Sí, podrás descargarlo en PDF desde tu perfil al finalizar el evento.' },
]
</script>

<style scoped>
/* --- Hero con fondo elegante --- */
.hero {
  min-height: 100vh;
  background: url('../assets/umg.jpg') center/cover no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}
.hero .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13, 71, 161, 0.7), rgba(25, 118, 210, 0.8));
  backdrop-filter: blur(2px);
}
.z-2 { z-index: 2; }

/* --- Glass cards --- */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* --- Agenda con fondo oscuro --- */
.agenda-section {
  background: linear-gradient(135deg, #0d47a1, #1976d2);
  position: relative;
}
.overlay-dark {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
}

/* --- CTA final --- */
.cta {
  background: url('/fondo-tecnologia.jpg') center/cover no-repeat;
  position: relative;
}
.cta .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(13, 71, 161, 0.8));
}
</style>
