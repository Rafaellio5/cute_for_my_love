const container = document.getElementById('puzzle-container');
const rows = 3;
const cols = 3;
const pieceSize = 200 / 3;

let pieces = [];

// создание частей пазла
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        piece.style.width = pieceSize + 'px';
        piece.style.height = pieceSize + 'px';
        piece.style.backgroundPosition = `-${c * pieceSize}px -${r * pieceSize}px`;

        piece.style.left = Math.random() * 120 + 'px';
        piece.style.top = Math.random() * 120 + 'px';

        piece.dataset.row = r;
        piece.dataset.col = c;

        container.appendChild(piece);
        pieces.push(piece);

        piece.addEventListener('mousedown', dragStart);
        piece.addEventListener('mousemove', dragMove);
        piece.addEventListener('mouseup', dragEnd);

        piece.addEventListener('touchstart', dragStart, { passive: false });
        piece.addEventListener('touchmove', dragMove, { passive: false });
        piece.addEventListener('touchend', dragEnd);
    }
}

let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
    e.preventDefault();
    draggedPiece = e.target;

    const rect = draggedPiece.getBoundingClientRect();
    let clientX = e.clientX, clientY = e.clientY;

    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
}

function dragMove(e) {
    if (!draggedPiece) return;
    e.preventDefault();

    let clientX = e.clientX, clientY = e.clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left - offsetX;
    let y = clientY - rect.top - offsetY;

    x = Math.max(0, Math.min(x, rect.width - pieceSize));
    y = Math.max(0, Math.min(y, rect.height - pieceSize));

    draggedPiece.style.left = x + 'px';
    draggedPiece.style.top = y + 'px';
}

function dragEnd(e) {
    if (!draggedPiece) return;

    const x = parseFloat(draggedPiece.style.left);
    const y = parseFloat(draggedPiece.style.top);

    const row = Math.round(y / pieceSize);
    const col = Math.round(x / pieceSize);

    if (row == draggedPiece.dataset.row && col == draggedPiece.dataset.col) {
        draggedPiece.style.left = col * pieceSize + 'px';
        draggedPiece.style.top = row * pieceSize + 'px';
        draggedPiece.style.pointerEvents = 'none';
        checkCompletion();
    } else {
        draggedPiece.style.left = Math.random() * 120 + 'px';
        draggedPiece.style.top = Math.random() * 120 + 'px';
    }

    draggedPiece = null;
}

function checkCompletion() {
    if (pieces.every(p => p.style.pointerEvents === 'none')) {
        setTimeout(() => window.location.href = "message.html", 500);
    }
}

/* ===========================
   ЛЕТАЮЩИЕ СЕРДЕЧКИ
   =========================== */
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
