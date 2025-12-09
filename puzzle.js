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
img.src = "heart.jpg"; // твоя картинка
img.onload = () => {
    initPuzzle();
    drawPuzzle();
};

// Инициализация пазла
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
                locked: false,
                z: 0
            });
        }
    }
}

// Рисуем пазл
function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // сортируем по z (слой)
    pieces.sort((a, b) => a.z - b.z);

    pieces.forEach(p => {
        ctx.globalAlpha = 1;
        ctx.drawImage(
            img,
            p.correctX, p.correctY, pieceSize, pieceSize,
            p.x, p.y, pieceSize, pieceSize
        );
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, pieceSize, pieceSize);
    });

    requestAnimationFrame(drawPuzzle);
}

// -------------------------
// Pointer Events (ПК + мобильные)
// -------------------------
canvas.addEventListener("pointerdown", e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let clicked = null;
    for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        if (!p.locked &&
            mx >= p.x && mx <= p.x + pieceSize &&
            my >= p.y && my <= p.y + pieceSize
        ) {
            clicked = p;
            break;
        }
    }

    if (clicked) {
        selectedPiece = clicked;
        selectedPiece.z = Math.max(...pieces.map(p => p.z)) + 1;
        selectedPiece.offsetX = mx - selectedPiece.x;
        selectedPiece.offsetY = my - selectedPiece.y;
        canvas.setPointerCapture(e.pointerId);
    }
});

canvas.addEventListener("pointermove", e => {
    if (!selectedPiece) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    selectedPiece.x = mx - selectedPiece.offsetX;
    selectedPiece.y = my - selectedPiece.offsetY;

    // ограничение движения
    selectedPiece.x = Math.max(0, Math.min(selectedPiece.x, canvas.width - pieceSize));
    selectedPiece.y = Math.max(0, Math.min(selectedPiece.y, canvas.height - pieceSize));
});

canvas.addEventListener("pointerup", e => {
    if (!selectedPiece) return;

    // проверка магнитного притяжения
    if (
        Math.abs(selectedPiece.x - selectedPiece.correctX) < 20 &&
        Math.abs(selectedPiece.y - selectedPiece.correctY) < 20
    ) {
        selectedPiece.x = selectedPiece.correctX;
        selectedPiece.y = selectedPiece.correctY;
        selectedPiece.locked = true;
        selectedPiece.z = -1; // фиксированные уходят вниз
    }

    selectedPiece = null;
    checkComplete();
});

// Проверка завершения пазла
function checkComplete() {
    if (pieces.every(p => p.locked)) {
        setTimeout(() => {
            window.location.href = "message.html"; // переход на романтическую страницу
        }, 500);
    }
}

// -------------------------
// Летающие сердечки (анимация)
function spawnHearts() {
    const container = document.getElementById('hearts');
    if (!container) return;

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = '❤';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (15 + Math.random() * 25) + 'px';
        heart.style.animationDuration = (4 + Math.random() * 4) + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }, 600);
}
spawnHearts();
