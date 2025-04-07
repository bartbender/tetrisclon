import { createButton } from "./tools.js";
import { setupControls } from "./events.js";
import Scene from './Scene.js';
import { Piece, shapes } from "./piece.js";
import { playSound } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
    const Game = {
        canvas: null,
        context: null,
        scene: null,
        board: null,
        colors: ["black", "cyan", "blue", "orange", "yellow", "green", "purple", "red", "white"],
        activePiece: null,
        nextPiece: null,
        score: 0,
        isGameOver: false,
        blockSize: null,
        gameAreaX: null,
        gameAreaY: null,
        gameAreaWidth: null,
        gameAreaHeight: null,
        speed: 1, // Velocidad inicial (1 línea por segundo)
        lastUpdateTime: 0, // Marca de tiempo para controlar la caída,
        offsetX: 0, // Desplazamiento horizontal para centrar el tablero
        rows: 20, // Número de filas del tablero
        offsetY: 0, // Desplazamiento vertical para dejar margen superior

        init() {
            this.canvas = document.getElementById("gameCanvas");
            this.context = this.canvas.getContext("2d");
            this.scene = new Scene(this.canvas);
            const gameHeightPercentage = 0.9;

            const canvasWidth = this.canvas.clientWidth;
            const canvasHeight = this.canvas.clientHeight;
            this.blockSize = Math.round(canvasHeight / (this.rows + 3)); // Calcular tamaño del bloque
            this.gameAreaWidth = this.blockSize * 10; // 10 columnas
            this.gameAreaHeight = this.blockSize * this.rows; // Altura del área de juego

            this.offsetX = Math.round((canvasWidth - this.gameAreaWidth) / 2); // Calcular desplazamiento horizontal
            this.offsetY = this.blockSize; // Margen superior del tamaño de un bloque

            this.board = Array.from({ length: this.rows }, () => Array(10).fill(0)); // Crear tablero

            this.scene.resize();

            const playButton = createButton("playButton", "Play", () => this.startGame(), null, null);
            playButton.style.zIndex = "10";
            playButton.style.pointerEvents = "auto";
            document.body.appendChild(playButton);

            setupControls(
                () => {
                    if (this.checkHorizontalLimits(-1)) this.activePiece?.move(-1, 0); // Mover izquierda
                },
                () => {
                    if (this.checkHorizontalLimits(1)) this.activePiece?.move(1, 0); // Mover derecha
                },
                () => {
                    const originalBlocks = [...this.activePiece.blocks]; // Guardar el estado original
                    this.activePiece?.rotate(10, this.rows, this.board); // Pasar el tablero al rotar
                    if (this.checkLock()) {
                        this.activePiece.blocks = originalBlocks; // Deshacer la rotación si colisiona
                    }
                },
                () => {
                    if (!this.checkLock()) this.activePiece?.move(0, 1); // Mover abajo si no hay colisión
                }
            );

            this.speed = 1; // Inicializar velocidad
        },

        startGame() {
            console.log("Juego iniciado");
            const playButton = document.getElementById("playButton");
            if (playButton) playButton.style.display = "none";

            this.activePiece = this.createRandomPiece();
            this.nextPiece = this.createRandomPiece();
            this.board = Array.from({ length: this.rows }, () => Array(10).fill(0)); // Reiniciar el tablero
            this.score = 0;
            this.isGameOver = false;
            this.lastUpdateTime = Date.now(); // Inicializar el tiempo al comenzar el juego
            this.gameLoop();
        },

        createRandomPiece() {
            const randomIndex = Math.floor(Math.random() * shapes.length);
            const randomColor = this.colors[randomIndex + 1];
            return new Piece(shapes[randomIndex], randomColor, randomIndex);
        },

        lockPiece() {
            this.activePiece.blocks.forEach(block => {
                const x = Math.floor(block.x);
                const y = Math.floor(block.y);
                if (y >= 0 && x >= 0 && x < 10 && y < this.rows) { // Usar this.rows en lugar de 20
                    this.board[y][x] = this.activePiece.shapeIndex + 1;
                }
            });
            this.clearLines();
            if (this.activePiece.blocks.some(block => block.y < 0)) {
                this.isGameOver = true;
            }
            if (this.activeSound) playSound("click.wav");
        },

        checkLock() {
            // Verificar si la pieza debe bloquearse (llega al fondo o colisiona con bloques existentes)
            return this.activePiece.blocks.some(block => {
                const x = block.x;
                const y = block.y;

                // Verificar si el bloque está fuera del límite inferior o colisiona con bloques existentes
                return (
                    y + 1 >= this.rows || // Fuera del límite inferior
                    (y + 1 >= 0 && this.board[y + 1][x] !== 0) // Colisión con bloques existentes en la fila siguiente
                );
            });
        },

        checkHorizontalLimits(dx) {
            // Verificar si la pieza está dentro de los límites horizontales
            return this.activePiece.blocks.every(block => {
                const x = block.x + dx;
                return x >= 0 && x < 10; // Dentro de los límites izquierdo y derecho
            });
        },

        clearLines() {
            let linesCleared = 0;
            for (let y = this.board.length - 1; y >= 0; y--) {
                if (this.board[y].every(cell => cell !== 0)) {
                    this.board.splice(y, 1);
                    this.board.unshift(Array(10).fill(0));
                    linesCleared++;
                    y++;
                }
            }
            this.score += linesCleared * 100;
        },

        updateScore() {
            // Placeholder para actualizar la puntuación
        },

        update() {
            if (!this.activePiece) return;

            const now = Date.now();
            const interval = 1000 / Math.min(this.speed, 5); // Máximo de 5 líneas por segundo

            if (this.checkLock()) {
                //this.activePiece.blocks.forEach(block => block.y -= 1); // Revertir el movimiento si debe bloquearse
                this.lockPiece();
                this.activePiece = this.nextPiece;
                this.nextPiece = this.createRandomPiece();
            }
                        
            if (now - this.lastUpdateTime >= interval) {
                this.activePiece.blocks.forEach(block => block.y += 1); // Incrementar la posición vertical

                

                this.lastUpdateTime = now;
            }

            this.updateScore();
        },

        render() {
            this.scene.render(
                this.board,
                this.activePiece,
                this.score,
                this.blockSize,
                this.isGameOver,
                this.offsetX,
                this.gameAreaWidth,
                this.gameAreaHeight // Ajustar altura con el margen superior
            );
        },

        gameLoop() {
            if (this.isGameOver) {
                this.render();
                return;
            }

            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    };

    Game.init();
});