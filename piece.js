/**
 * Representa una pieza del juego Tetris.
 */
export class Piece {
    /**
     * @param {Array} shape - Forma de la pieza (coordenadas relativas).
     * @param {string} color - Color de la pieza.
     */
    constructor(shape, color) {
        this.shape = shape; // Forma de la pieza
        this.color = color; // Color de la pieza
        this.blocks = this.initializeBlocks(); // Inicializar bloques
    }

    /**
     * Genera los bloques de la pieza según su forma.
     * @returns {Array} Lista de bloques con coordenadas iniciales.
     */
    initializeBlocks() {
        return this.shape.map(([x, y]) => ({ x, y }));
    }

    /**
     * Mueve la pieza en el tablero.
     * @param {number} dx - Desplazamiento horizontal.
     * @param {number} dy - Desplazamiento vertical.
     */
    move(dx, dy) {
        this.blocks.forEach(block => {
            block.x += dx;
            block.y += dy;
        });
    }

    /**
     * Rota la pieza en el tablero.
     * @param {number} boardWidth - Ancho del tablero.
     * @param {number} boardHeight - Altura del tablero.
     * @param {Array} board - Estado actual del tablero.
     */
    rotate(boardWidth = 10, boardHeight = 20, board) {
        // Determinar el bloque de referencia (top-left) como punto de pivote
        const pivot = this.blocks.reduce((topLeft, block) => ({
            x: Math.min(topLeft.x, block.x),
            y: Math.min(topLeft.y, block.y)
        }), { x: Infinity, y: Infinity });

        // Calcular los bloques rotados alrededor del punto de pivote
        const rotatedBlocks = this.blocks.map(block => ({
            x: pivot.x - (block.y - pivot.y),
            y: pivot.y + (block.x - pivot.x)
        }));

        // Determinar el nuevo bloque top-left después de la rotación
        const newTopLeft = rotatedBlocks.reduce((topLeft, block) => ({
            x: Math.min(topLeft.x, block.x),
            y: Math.min(topLeft.y, block.y)
        }), { x: Infinity, y: Infinity });

        // Calcular el desplazamiento necesario para mantener el nuevo top-left en la posición del anterior
        const offsetX = pivot.x - newTopLeft.x;
        const offsetY = pivot.y - newTopLeft.y;

        // Ajustar los bloques rotados con el desplazamiento calculado
        const adjustedBlocks = rotatedBlocks.map(block => ({
            x: block.x + offsetX,
            y: block.y + offsetY
        }));

        // Verificar si la rotación ajustada está dentro de los límites y no colisiona
        const isValid = adjustedBlocks.every(block =>
            block.x >= 0 &&
            block.x < boardWidth &&
            block.y < boardHeight &&
            (block.y < 0 || board[block.y][block.x] === 0) // No colisiona con otras piezas
        );

        if (isValid) {
            this.blocks = adjustedBlocks; // Aplicar la rotación ajustada
        }
    }

    /**
     * Dibuja la pieza en el canvas.
     * @param {CanvasRenderingContext2D} context - Contexto del canvas.
     * @param {number} blockSize - Tamaño de cada bloque.
     * @param {number} offsetX - Desplazamiento horizontal.
     * @param {number} offsetY - Desplazamiento vertical.
     */
    render(context, blockSize, offsetX, offsetY) {
        // Dibujar la pieza en el canvas
        context.fillStyle = this.color;
        this.blocks.forEach(block => {
            context.fillRect(
                offsetX + block.x * blockSize,
                offsetY + block.y * blockSize,
                blockSize,
                blockSize
            );
            context.strokeStyle = "black";
            context.strokeRect(
                offsetX + block.x * blockSize,
                offsetY + block.y * blockSize,
                blockSize,
                blockSize
            );
        });
    }
}

/**
 * Formas disponibles para las piezas del juego.
 */
export const shapes = [
    // Forma I
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    // Forma O
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    // Forma T
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    // Forma S
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    // Forma Z
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    // Forma L
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    // Forma J
    [[2, 0], [0, 1], [1, 1], [2, 1]]
];
