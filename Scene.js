/**
 * Clase encargada de manejar el renderizado del juego.
 */
export default class Scene {
    /**
     * @param {HTMLCanvasElement} canvas - Elemento canvas donde se dibuja el juego.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    /**
     * Limpia el canvas.
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Renderiza el tablero del juego.
     * @param {Array} board - Estado actual del tablero.
     * @param {number} blockSize - Tamaño de cada bloque.
     * @param {number} offsetX - Desplazamiento horizontal.
     * @param {number} offsetY - Desplazamiento vertical.
     */
    renderBoard(board, blockSize, offsetX, offsetY) {
        board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    this.context.fillStyle = "gray"; // Color de las piezas bloqueadas
                    this.context.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                    this.context.strokeStyle = "black";
                    this.context.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            });
        });
    }

    /**
     * Renderiza una pieza activa.
     * @param {Piece} piece - Pieza activa.
     * @param {number} blockSize - Tamaño de cada bloque.
     * @param {number} offsetX - Desplazamiento horizontal.
     * @param {number} offsetY - Desplazamiento vertical.
     */
    renderPiece(piece, blockSize, offsetX, offsetY) {
        piece.blocks.forEach(block => {
            this.context.fillStyle = piece.color;
            this.context.fillRect(
                offsetX + block.x * blockSize,
                offsetY + block.y * blockSize, // Usar block.y para la posición vertical
                blockSize,
                blockSize
            );
            this.context.strokeStyle = "black";
            this.context.strokeRect(
                offsetX + block.x * blockSize,
                offsetY + block.y * blockSize, // Usar block.y para la posición vertical
                blockSize,
                blockSize
            );
        });
    }

    /**
     * Renderiza la puntuación actual.
     * @param {number} score - Puntuación del jugador.
     */
    renderScore(score) {
        const dpr = window.devicePixelRatio || 1;
        this.context.fillStyle = "white";
        this.context.font = `${20 * dpr}px Arial`;
        this.context.textAlign = "left";
        this.context.fillText(`Score: ${score}`, 10, 30);
    }

    /**
     * Renderiza el mensaje de "Game Over".
     */
    renderGameOver() {
        const dpr = window.devicePixelRatio || 1;
        this.context.fillStyle = "red";
        this.context.font = `${30 * dpr}px Comic Sans MS`;
        this.context.textAlign = "center";
        this.context.fillText("Game Over", this.canvas.width / 2 / dpr, this.canvas.height / 2 / dpr);
    }

    /**
     * Dibuja el borde del área de juego.
     * @param {number} offsetX - Desplazamiento horizontal.
     * @param {number} offsetY - Desplazamiento vertical.
     * @param {number} gameAreaWidth - Ancho del área de juego.
     * @param {number} gameAreaHeight - Altura del área de juego.
     */
    drawGameAreaBorder(offsetX, offsetY, gameAreaWidth, gameAreaHeight) {
        this.context.strokeStyle = "white";
        this.context.lineWidth = 2;
        this.context.strokeRect(offsetX, offsetY, gameAreaWidth, gameAreaHeight);
    }

    /**
     * Renderiza todos los elementos del juego.
     * @param {Array} board - Estado actual del tablero.
     * @param {Piece} activePiece - Pieza activa.
     * @param {number} score - Puntuación del jugador.
     * @param {number} blockSize - Tamaño de cada bloque.
     * @param {boolean} isGameOver - Indica si el juego ha terminado.
     * @param {number} offsetX - Desplazamiento horizontal.
     * @param {number} gameAreaWidth - Ancho del área de juego.
     * @param {number} gameAreaHeight - Altura del área de juego.
     */
    render(board, activePiece, score, blockSize, isGameOver, offsetX, gameAreaWidth, gameAreaHeight) {
        const offsetY = blockSize; // Margen superior del tamaño de un bloque
        this.clear();
        this.renderBoard(board, blockSize, offsetX, offsetY);
        
        if (activePiece) {
            this.renderPiece(activePiece, blockSize, offsetX, offsetY);
        }

        this.renderScore(score);
        this.drawGameAreaBorder(offsetX, offsetY, gameAreaWidth, gameAreaHeight);
        if (isGameOver) {
            this.renderGameOver();
        }
    }

    /**
     * Ajusta el tamaño del canvas al tamaño de la ventana.
     */
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.context.scale(dpr, dpr);
    }
}