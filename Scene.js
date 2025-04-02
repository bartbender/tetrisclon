export default class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

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

    renderScore(score) {
        const dpr = window.devicePixelRatio || 1;
        this.context.fillStyle = "white";
        this.context.font = `${20 * dpr}px Arial`;
        this.context.textAlign = "left";
        this.context.fillText(`Score: ${score}`, 10, 30);
    }

    renderGameOver() {
        const dpr = window.devicePixelRatio || 1;
        this.context.fillStyle = "red";
        this.context.font = `${30 * dpr}px Comic Sans MS`;
        this.context.textAlign = "center";
        this.context.fillText("Game Over", this.canvas.width / 2 / dpr, this.canvas.height / 2 / dpr);
    }

    drawGameAreaBorder(offsetX, offsetY, gameAreaWidth, gameAreaHeight) {
        this.context.strokeStyle = "white";
        this.context.lineWidth = 2;
        this.context.strokeRect(offsetX, offsetY, gameAreaWidth, gameAreaHeight);
    }

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

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * dpr;
        this.canvas.height = this.canvas.clientHeight * dpr;
        this.context.scale(dpr, dpr);
    }
}