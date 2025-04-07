/**
 * Crea un botón HTML con un identificador, texto y comportamiento personalizado.
 * 
 * @param {string} id - Identificador único del botón.
 * @param {string} text - Texto que se mostrará en el botón.
 * @param {Function} onClick - Función que se ejecutará al hacer clic en el botón.
 * @param {HTMLElement} parent - Elemento padre donde se añadirá el botón (por defecto, el body).
 * @param {Array} additionalClasses - Clases CSS adicionales para el botón.
 * @returns {HTMLButtonElement} El botón creado.
 */
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
