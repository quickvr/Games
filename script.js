const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let score = 0;
let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
];

let currentTetromino = null;
let currentPosition = { x: 0, y: 0 };
let gameInterval;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'white';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawTetromino() {
    currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'cyan';
                context.fillRect(currentPosition.x + x, currentPosition.y + y, 1, 1);
            }
        });
    });
}

function mergeTetromino() {
    currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPosition.y + y][currentPosition.x + x] = 1;
            }
        });
    });
}

function collide() {
    return currentTetromino.shape.some((row, y) => {
        return row.some((value, x) => {
            return value && (
                board[currentPosition.y + y] === undefined ||
                board[currentPosition.y + y][currentPosition.x + x] === undefined ||
                board[currentPosition.y + y][currentPosition.x + x]
            );
        });
    });
}

function rotateTetromino() {
    const originalShape = currentTetromino.shape;
    currentTetromino.shape = currentTetromino.shape[0].map((_, i) => currentTetromino.shape.map(row => row[i]).reverse());
    if (collide()) {
        currentTetromino.shape = originalShape; // revert rotation
    }
}

function move(direction) {
    currentPosition.x += direction;
    if (collide()) {
        currentPosition.x -= direction; // revert move
    }
}

function drop() {
    currentPosition.y++;
    if (collide()) {
        currentPosition.y--; // revert move
        mergeTetromino();
        clearLines();
        spawnTetromino();
    }
}

function clearLines() {
    let linesCleared = 0;
    board = board.reduce((acc, row) => {
        if (row.every(value => value)) {
            linesCleared++;
            score += 100;
            document.getElementById('score').innerText = score;
            acc.unshift(Array(10).fill(0)); // add empty row at the top
        } else {
            acc.push(row);
        }
        return acc;
    }, []);
}

function spawnTetromino() {
    currentTetromino = { shape: tetrominoes[Math.floor(Math.random() * tetrominoes.length)] };
    currentPosition = { x: 3, y: 0 };
    if (collide()) {
        clearInterval(gameInterval);
        alert('Game Over');
    }
}

function startGame() {
    board = Array.from({ length: 20 }, () => Array(10).fill(0));
    score = 0;
    document.getElementById('score').innerText = score;
    spawnTetromino();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        drop();
        drawBoard();
        drawTetromino();
    }, 1000);
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowDown') drop();
    if (event.key === 'ArrowUp') rotateTetromino();
});
