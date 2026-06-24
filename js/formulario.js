/**
 * FORMULARIO: validación del formulario de contacto.
 * PERSONALIZAR: conecta enviarFormulario() con tu servicio real de email o backend.
 */

/**
 * Objeto con reglas de validación
 */
const validadores = {
  // Validar nombre (mínimo 3 caracteres, solo letras y espacios)
  nombre: function(valor) {
    if (valor.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(valor)) {
      return 'El nombre solo puede contener letras';
    }
    return null;
  },

  // Validar email (formato válido)
  email: function(valor) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(valor)) {
      return 'Por favor ingresa un email válido';
    }
    return null;
  },

  // Validar teléfono (opcional pero si se ingresa debe ser válido)
  telefono: function(valor) {
    if (valor.trim() === '') {
      return null; // Campo opcional
    }
    if (!/^[\d\s\-\+\(\)]+$/.test(valor)) {
      return 'El teléfono debe contener solo números y caracteres de formato';
    }
    if (valor.replace(/\D/g, '').length < 8) {
      return 'El teléfono debe tener al menos 8 dígitos';
    }
    return null;
  },

  // Validar asunto (debe seleccionar)
  asunto: function(valor) {
    if (valor === '' || valor === null) {
      return 'Por favor selecciona un asunto';
    }
    return null;
  },

  detalleOtro: function(valor) {
    const asunto = document.getElementById('asunto');
    if (!asunto || asunto.value !== 'otro') {
      return null;
    }
    if (valor.trim().length < 10) {
      return 'Explica tu problema o motivo de contacto con al menos 10 caracteres';
    }
    if (valor.trim().length > 500) {
      return 'El detalle no debe exceder 500 caracteres';
    }
    return null;
  },

  // Validar mensaje (mínimo 10 caracteres)
  mensaje: function(valor) {
    if (valor.trim().length < 10) {
      return 'El mensaje debe tener al menos 10 caracteres';
    }
    if (valor.trim().length > 500) {
      return 'El mensaje no debe exceder 500 caracteres';
    }
    return null;
  },

  // Validar términos (debe estar marcado)
  terminos: function(valor) {
    if (!valor) {
      return 'Debes aceptar los términos y condiciones';
    }
    return null;
  }
};

/**
 * Validar un campo individual
 * @param {String} nombreCampo - Nombre del campo a validar
 * @returns {Boolean} true si es válido, false si no
 */
function validarCampo(nombreCampo) {
  const campo = document.getElementById(nombreCampo);
  if (!campo) return true;

  let valor;
  if (campo.type === 'checkbox') {
    valor = campo.checked;
  } else {
    valor = campo.value;
  }

  // Obtener validador
  const validador = validadores[nombreCampo];
  if (!validador) return true;

  // Validar
  const error = validador(valor);

  // Mostrar o ocultar error
  const formGroup = campo.closest('.form-group');
  const errorMsg = document.getElementById(`error${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}`);

  if (error) {
    formGroup.classList.add('error');
    if (errorMsg) {
      errorMsg.textContent = error;
      errorMsg.style.display = 'block';
    }
    return false;
  } else {
    formGroup.classList.remove('error');
    if (errorMsg) {
      errorMsg.style.display = 'none';
    }
    return true;
  }
}

/**
 * Validar todos los campos del formulario
 * @returns {Boolean} true si todos son válidos, false si hay errores
 */
function validarFormulario() {
  const campos = ['nombre', 'email', 'telefono', 'asunto', 'detalleOtro', 'mensaje', 'terminos'];
  let esValido = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      esValido = false;
    }
  });

  return esValido;
}

/**
 * Enviar formulario
 * @param {Event} e - Evento del formulario
 */
function enviarFormulario(e) {
  e.preventDefault();

  console.log('🔍 Validando formulario...');

  // Validar todos los campos
  if (!validarFormulario()) {
    console.log('❌ Formulario inválido');
    alert('Por favor corrige los errores en el formulario');
    return;
  }

  console.log('✓ Formulario válido, procesando...');

  // Obtener datos del formulario
  const formData = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    asunto: document.getElementById('asunto').value,
    detalleOtro: document.getElementById('detalleOtro').value,
    mensaje: document.getElementById('mensaje').value,
    fecha: new Date().toLocaleString()
  };

  // Simular envío (en producción iría a un servidor)
  console.log('📧 Datos del formulario:', formData);

  // Guardar en localStorage (para demostración)
  let mensajes = JSON.parse(localStorage.getItem('mensajesContacto') || '[]');
  mensajes.push(formData);
  localStorage.setItem('mensajesContacto', JSON.stringify(mensajes));

  // Mostrar mensaje de éxito
  const successMsg = document.getElementById('successMsg');
  if (successMsg) {
    successMsg.style.display = 'block';
    console.log('✓ ¡Mensaje enviado exitosamente!');
  }

  // Limpiar formulario
  document.getElementById('formularioContacto').reset();
  actualizarDetalleOtro();

  // Limpiar clases de error
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });

  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    if (successMsg) {
      successMsg.style.display = 'none';
    }
  }, 5000);
}

/**
 * Limpiar mensaje de error de un campo al escribir
 */
function limpiarError(nombreCampo) {
  const campo = document.getElementById(nombreCampo);
  const formGroup = campo.closest('.form-group');
  const errorMsg = document.getElementById(`error${nombreCampo.charAt(0).toUpperCase() + nombreCampo.slice(1)}`);

  formGroup.classList.remove('error');
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }
}

/**
 * Mostrar el detalle extra solo cuando el asunto es "Otro"
 */
function actualizarDetalleOtro() {
  const asunto = document.getElementById('asunto');
  const detalleGroup = document.getElementById('detalleOtroGroup');
  const detalle = document.getElementById('detalleOtro');

  if (!asunto || !detalleGroup || !detalle) return;

  if (asunto.value === 'otro') {
    detalleGroup.classList.add('visible');
    detalle.setAttribute('required', 'required');
  } else {
    detalleGroup.classList.remove('visible');
    detalle.removeAttribute('required');
    detalle.value = '';
    limpiarError('detalleOtro');
  }
}

// Inicializar form
document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('formularioContacto');
  
  if (!formulario) return;

  // Listener para enviar formulario
  formulario.addEventListener('submit', enviarFormulario);

  // Listeners para validación en tiempo real
  const campos = formulario.querySelectorAll('input, textarea, select');
  campos.forEach(campo => {
    // Limpiar error al escribir
    campo.addEventListener('input', function() {
      if (this.value !== '') {
        limpiarError(this.id);
      }
    });

    // Validar al dejar el campo (blur)
    campo.addEventListener('blur', function() {
      validarCampo(this.id);
    });
  });

  const asunto = document.getElementById('asunto');
  if (asunto) {
    asunto.addEventListener('change', actualizarDetalleOtro);
    actualizarDetalleOtro();
  }

  console.log('✓ Sistema de validación de formulario inicializado');
});
