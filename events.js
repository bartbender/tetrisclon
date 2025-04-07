/**
 * Configura los controles del juego para manejar eventos de teclado y táctiles.
 * 
 * @param {Function} onMoveLeft - Función que se ejecuta al mover la pieza hacia la izquierda.
 * @param {Function} onMoveRight - Función que se ejecuta al mover la pieza hacia la derecha.
 * @param {Function} onRotate - Función que se ejecuta al rotar la pieza.
 * @param {Function} onDrop - Función que se ejecuta al dejar caer la pieza rápidamente.
 */
export function setupControls(onMoveLeft, onMoveRight, onRotate, onDrop) {
    // Configuración de controles de teclado
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowLeft":
                onMoveLeft(); // Mover a la izquierda
                break;
            case "ArrowRight":
                onMoveRight(); // Mover a la derecha
                break;
            case "ArrowUp":
                onRotate(); // Rotar la pieza
                break;
            case "ArrowDown":
                onDrop(); // Dejar caer la pieza
                break;
        }
    });

    // Configuración de controles táctiles
    let startX = null;
    let startY = null;

    document.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        startX = touch.clientX; // Registrar la posición inicial del toque
        startY = touch.clientY;
    });

    document.addEventListener("touchmove", (event) => {
        if (!startX || !startY) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - startX; // Diferencia horizontal
        const deltaY = touch.clientY - startY; // Diferencia vertical

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Movimiento horizontal
            if (deltaX > 0) onMoveRight(); // Mover a la derecha
            else onMoveLeft(); // Mover a la izquierda
        } else {
            // Movimiento vertical
            if (deltaY > 0) onDrop(); // Dejar caer la pieza
        }

        startX = null; // Reiniciar posición inicial
        startY = null;
    });

    document.addEventListener("touchend", () => {
        startX = null;
        startY = null;
    });
}
