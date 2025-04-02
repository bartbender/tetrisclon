export function createButton(id, text, onClick, onMouseDown, onMouseUp) {
    const button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    button.style.position = "absolute";
    button.style.top = "50%";
    button.style.left = "50%";
    button.style.transform = "translate(-50%, -50%)";
    button.style.padding = "1rem 2rem";
    button.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    button.style.fontSize = "1.5rem";
    button.style.color = "white";
    button.style.backgroundColor = "#007BFF";
    button.style.border = "none";
    button.style.borderRadius = "15px";
    button.style.boxShadow = "0 4px #0056b3";
    button.style.cursor = "pointer";

    button.addEventListener("click", onClick);
    button.addEventListener("mousedown", () => {
        button.style.transform = "translate(-50%, -50%) scale(0.95)";
        button.style.boxShadow = "0 2px #0056b3";
        if (onMouseDown) onMouseDown();
    });
    button.addEventListener("mouseup", () => {
        button.style.transform = "translate(-50%, -50%) scale(1)";
        button.style.boxShadow = "0 4px #0056b3";
        if (onMouseUp) onMouseUp();
    });

    return button;
}
