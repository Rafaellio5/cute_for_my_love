const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const rows = 3;
const cols = 3;
const pieceSize = canvas.width / cols;

let pieces = [];
let selectedPiece = null;

// Загружаем картинку пазла
const img = new Image();
img.src = "puzzle.jpg";

img.onload = () => {
    initPuzzle();
    drawPuzzle();
};

function initPuzzle() {
    pieces = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            pieces.push({
                correctX: x * pieceSize,
                correctY: y * pieceSize,
                x: Math.random() * (canvas.width - pieceSize),
                y: Math.random() * (canvas.height - pieceSize),
                index: pieces.length,
                locked: false,   // добавили флаг "поставлен"
                z: 0             // уровень слоя
            });
        }
    }
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // сортируем по z-index
    pieces.sort((a, b) => a.z - b.z);

    pieces.forEach(p => {
        ctx.globalAlpha = 1;
        ctx.drawImage(
            img,
            p.correctX, p.correctY, pieceSize, pieceSize,
            p.x, p.y, pieceSize, pieceSize
        );
        ctx.strokeStyle = "#000";
        ctx.strokeRect(p.x, p.y, pieceSize, pieceSize);
    });

    requestAnimationFrame(drawPuzzle);
}

canvas.addEventListener("mousedown", e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // выбираем кусок с самым высоким z-index
    let clicked = null;
    for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        if (
            mx >= p.x && mx <= p.x + pieceSize &&
            my >= p.y && my <= p.y + pieceSize
        ) {
            clicked = p;
            break;
        }
    }

    if (clicked && !clicked.locked) {
        selectedPiece = clicked;

        // поднимаем наверх
        selectedPiece.z = Math.max(...pieces.map(p => p.z)) + 1;

        selectedPiece.offsetX = mx - selectedPiece.x;
        selectedPiece.offsetY = my - selectedPiece.y;
    }
});

canvas.addEventListener("mousemove", e => {
    if (selectedPiece && !selectedPiece.locked) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        selectedPiece.x = mx - selectedPiece.offsetX;
        selectedPiece.y = my - selectedPiece.offsetY;
    }
});

canvas.addEventListener("mouseup", () => {
    if (selectedPiece) {

        if (
            Math.abs(selectedPiece.x - selectedPiece.correctX) < 20 &&
            Math.abs(selectedPiece.y - selectedPiece.correctY) < 20
        ) {
            // фиксируем кусок
            selectedPiece.x = selectedPiece.correctX;
            selectedPiece.y = selectedPiece.correctY;
            selectedPiece.locked = true;
            selectedPiece.z = -1;  // зафиксированные уходят вниз
        }

        selectedPiece = null;

        // проверяем — всё собрано?
        checkComplete();
    }
});

function checkComplete() {
    if (pieces.every(p => p.locked)) {
        setTimeout(() => {
            // ПЕРЕХОДИМ НА НОВУЮ РОМАНТИЧЕСКУЮ СТРАНИЦУ
            window.location.href = "romantic.html";
        }, 500);
    }
}
