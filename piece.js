export class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.blocks = this.initializeBlocks();
    }

    initializeBlocks() {
        // Genera los bloques de la pieza según su forma (coordenadas relativas al tablero)
        return this.shape.map(([x, y]) => ({ x, y }));
    }

    move(dx, dy) {
        // Desplazar la pieza en el tablero
        this.blocks.forEach(block => {
            block.x += dx;
            block.y += dy;
        });
    }

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
