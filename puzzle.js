const container = document.getElementById('puzzle-container');
const rows = 3;
const cols = 3;
const pieceSize = 200 / 3; // размер части пазла
const snapTolerance = 15; // допустимое расстояние для привязки

let pieces = [];

// создание частей пазла
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        piece.style.width = pieceSize + 'px';
        piece.style.height = pieceSize + 'px';
        piece.style.backgroundPosition = `-${c * pieceSize}px -${r * pieceSize}px`;
        piece.style.transition = 'transform 0.2s ease';

        piece.style.transform = `translate(${Math.random() * 120}px, ${Math.random() * 120}px)`;

        piece.dataset.row = r;
        piece.dataset.col = c;

        container.appendChild(piece);
        pieces.push(piece);

        // pointer events для ПК и мобильных устройств
        piece.addEventListener('pointerdown', pointerDown);
    }
}

let draggedPiece = null;
let pointerOffsetX = 0;
let pointerOffsetY = 0;

// -------------------------
// Pointer Handlers
// -------------------------
function pointerDown(e) {
    e.preventDefault();
    draggedPiece = e.currentTarget;

    // захватываем координаты указателя относительно кусочка
    const rect = draggedPiece.getBoundingClientRect();
    const transform = draggedPiece.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const currentX = parseFloat(transform[1]);
    const currentY = parseFloat(transform[2]);

    pointerOffsetX = e.clientX - rect.left;
    pointerOffsetY = e.clientY - rect.top;

    draggedPiece.dataset.startX = currentX;
    draggedPiece.dataset.startY = currentY;

    draggedPiece.setPointerCapture(e.pointerId);
    draggedPiece.style.transition = 'none';

    draggedPiece.addEventListener('pointermove', pointerMove);
    draggedPiece.addEventListener('pointerup', pointerUp);
}

function pointerMove(e) {
    if (!draggedPiece) return;
    e.preventDefault();

    const startX = parseFloat(draggedPiece.dataset.startX);
    const startY = parseFloat(draggedPiece.dataset.startY);

    const rect = container.getBoundingClientRect();
    let newX = startX + (e.clientX - rect.left - pointerOffsetX);
    let newY = startY + (e.clientY - rect.top - pointerOffsetY);

    // ограничиваем движение по контейнеру
    newX = Math.max(0, Math.min(newX, rect.width - pieceSize));
    newY = Math.max(0, Math.min(newY, rect.height - pieceSize));

    draggedPiece.style.transform = `translate(${newX}px, ${newY}px)`;
}

function pointerUp(e) {
    if (!draggedPiece) return;

    // вычисляем центр кусочка
    const transform = draggedPiece.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const x = parseFloat(transform[1]);
    const y = parseFloat(transform[2]);

    const targetX = draggedPiece.dataset.col * pieceSize;
    const targetY = draggedPiece.dataset.row * pieceSize;

    // проверяем расстояние для «магнита»
    if (Math.abs(x - targetX) <= snapTolerance && Math.abs(y - targetY) <= snapTolerance) {
        // плавное прибивание на место
        draggedPiece.style.transition = 'transform 0.3s ease';
        draggedPiece.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.05)`;
        setTimeout(() => {
            draggedPiece.style.transform = `translate(${targetX}px, ${targetY}px) scale(1)`;
        }, 150);

        draggedPiece.style.pointerEvents = 'none';
    }

    draggedPiece.removeEventListener('pointermove', pointerMove);
    draggedPiece.removeEventListener('pointerup', pointerUp);
    draggedPiece.releasePointerCapture(e.pointerId);
    draggedPiece = null;

    checkCompletion();
}

// -------------------------
// Проверка завершения пазла
// -------------------------
function checkCompletion() {
    if (pieces.every(p => p.style.pointerEvents === 'none')) {
        setTimeout(() => {
            window.location.href = "message.html";
        }, 500);
    }
}

// -------------------------
// Летающие сердечки
// -------------------------
function spawnHearts() {
    const container = document.getElementById('hearts');
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
