document.addEventListener('DOMContentLoaded', () => {
    const blockedBots = ["python-requests", "curl", "wget", "bot", "spider", "crawler"];
    const userAgent = navigator.userAgent.toLowerCase();

    if (blockedBots.some(bot => userAgent.includes(bot))) {
        console.warn("Bot detectado. Bloqueando acceso...");

        // Evitar la carga de cualquier contenido
        document.head.innerHTML = "";
        document.body.innerHTML = "<h2 style='color: red; text-align: center;'>Acceso restringido</h2>";
        
        // Bloquear la carga de archivos externos
        const allLinks = document.querySelectorAll("link, script, img, iframe, object");
        allLinks.forEach(el => el.remove());

        // Detener toda ejecución
        throw new Error("Acceso restringido por bot detection.");
    }
});
