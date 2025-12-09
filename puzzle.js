const container = document.getElementById('puzzle-container');
const rows = 3;
const cols = 3;
const pieceSize = 200 / 3; // размер части пазла

let pieces = [];

// создаём части пазла
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');

        piece.style.width = pieceSize + 'px';
        piece.style.height = pieceSize + 'px';
        piece.style.backgroundPosition = `-${c * pieceSize}px -${r * pieceSize}px`;
        piece.style.transition = 'transform 0.2s ease'; // плавное прибивание

        // случайное начальное положение
        piece.style.transform = `translate(${Math.random() * 120}px, ${Math.random() * 120}px)`;

        piece.dataset.row = r;
        piece.dataset.col = c;

        container.appendChild(piece);
        pieces.push(piece);

        // события мыши
        piece.addEventListener('mousedown', dragStart);
        piece.addEventListener('mousemove', dragMove);
        piece.addEventListener('mouseup', dragEnd);

        // события тач
        piece.addEventListener('touchstart', dragStart, { passive: false });
        piece.addEventListener('touchmove', dragMove, { passive: false });
        piece.addEventListener('touchend', dragEnd);
    }
}

let draggedPiece = null;
let startX = 0;
let startY = 0;
let origX = 0;
let origY = 0;

function dragStart(e) {
    e.preventDefault();
    draggedPiece = e.target;

    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    const transform = draggedPiece.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    origX = parseFloat(transform[1]);
    origY = parseFloat(transform[2]);

    startX = clientX;
    startY = clientY;

    draggedPiece.style.transition = 'none'; // отключаем transition при движении
}

function dragMove(e) {
    if (!draggedPiece) return;
    e.preventDefault();

    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    draggedPiece.style.transform = `translate(${origX + deltaX}px, ${origY + deltaY}px)`;
}

function dragEnd(e) {
    if (!draggedPiece) return;

    const style = draggedPiece.style.transform;
    const match = style.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    const row = Math.round(y / pieceSize);
    const col = Math.round(x / pieceSize);

    if (row == draggedPiece.dataset.row && col == draggedPiece.dataset.col) {
        // фиксируем на месте с анимацией
        draggedPiece.style.transition = 'transform 0.3s ease, scale 0.3s ease';
        draggedPiece.style.transform = `translate(${col * pieceSize}px, ${row * pieceSize}px) scale(1.05)`;
        setTimeout(() => draggedPiece.style.transform = `translate(${col * pieceSize}px, ${row * pieceSize}px) scale(1)`, 200);
        draggedPiece.style.pointerEvents = 'none';
        checkCompletion();
    } else {
        // возвращаем в случайное место
        draggedPiece.style.transition = 'transform 0.3s ease';
        draggedPiece.style.transform = `translate(${Math.random() * 120}px, ${Math.random() * 120}px)`;
    }

    draggedPiece = null;
}

function checkCompletion() {
    if (pieces.every(p => p.style.pointerEvents === 'none')) {
        setTimeout(() => {
            window.location.href = "message.html";
        }, 500);
    }
}

/* ===========================
   Летающие сердечки
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
