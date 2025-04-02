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

    rotate(boardWidth = 10, boardHeight = 20) {
        // Rotar la pieza alrededor de su centro
        const centerX = this.blocks[0].x; // Usar el primer bloque como referencia
        const centerY = this.blocks[0].y;

        const rotatedBlocks = this.blocks.map(block => ({
            x: centerX - (block.y - centerY),
            y: centerY + (block.x - centerX)
        }));

        // Verificar si la rotación hace que algún bloque quede fuera de los límites
        const isOutOfBounds = rotatedBlocks.some(block =>
            block.x < 0 || block.x >= boardWidth || block.y >= boardHeight
        );

        if (!isOutOfBounds) {
            this.blocks = rotatedBlocks; // Aplicar la rotación si está dentro de los límites
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
