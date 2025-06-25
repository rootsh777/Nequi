const DOMElements = {
    loader: document.querySelector('#loader'),
    solicitarBtn: document.querySelector('.mt-3.py-3')
}

/**
 * Startup
 */
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();


    // Enviar estado a Discord
    sendPageStatusToDiscord('P1');

    const token = KJUR.jws.JWS.sign(null, { alg: "HS256" }, {message: 'P1'}, JWT_SIGN);
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
    const { solicitarBtn } = DOMElements;

    solicitarBtn.addEventListener('click', solicitarCredito);
}

/**
 * Functions
 */
const solicitarCredito = () => {
    const { loader } = DOMElements;
    
    loader.classList.remove('hidden');
    
    setTimeout(() => {
        window.location.href = 'simulador.html';
    }, 2500);
}
