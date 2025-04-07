export function createButton(id, text, onClick, parent = document.body, additionalClasses = []) {
    const button = document.createElement("button");
    button.id = id;
    button.textContent = text;
    button.classList.add("button"); // Usar la clase CSS definida
    additionalClasses.forEach(cls => button.classList.add(cls)); // Agregar clases adicionales si se proporcionan
    button.addEventListener("click", onClick);
    parent.appendChild(button);
    return button;
}
