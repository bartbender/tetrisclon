export function setupControls(onMoveLeft, onMoveRight, onRotate, onDrop) {
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowLeft":
                onMoveLeft();
                break;
            case "ArrowRight":
                onMoveRight();
                break;
            case "ArrowUp":
                onRotate();
                break;
            case "ArrowDown":
                onDrop();
                break;
        }
    });

    // Soporte para eventos táctiles
    let startX = null;
    let startY = null;

    document.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    document.addEventListener("touchmove", (event) => {
        if (!startX || !startY) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) onMoveRight();
            else onMoveLeft();
        } else {
            if (deltaY > 0) onDrop();
        }

        startX = null;
        startY = null;
    });

    document.addEventListener("touchend", () => {
        startX = null;
        startY = null;
    });
}
