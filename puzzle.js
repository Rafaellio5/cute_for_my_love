const container = document.getElementById('puzzle-container');
const rows = 4;
const cols = 4;
const pieceSize = 50;
let pieces = [];

// создаем части пазла
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundPosition = `-${c * pieceSize}px -${r * pieceSize}px`;
        piece.style.left = Math.random() * 150 + 'px';
        piece.style.top = Math.random() * 150 + 'px';
        piece.dataset.row = r;
        piece.dataset.col = c;

        container.appendChild(piece);
        pieces.push(piece);

        // события для мыши
        piece.addEventListener('mousedown', dragStart);
        piece.addEventListener('mouseup', dragEnd);
        piece.addEventListener('mousemove', dragMove);

        // события для тача (мобильные устройства)
        piece.addEventListener('touchstart', dragStart, {passive:false});
        piece.addEventListener('touchend', dragEnd);
        piece.addEventListener('touchmove', dragMove, {passive:false});
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

    // ограничиваем движение внутри контейнера
    x = Math.max(0, Math.min(x, rect.width - pieceSize));
    y = Math.max(0, Math.min(y, rect.height - pieceSize));

    draggedPiece.style.left = x + 'px';
    draggedPiece.style.top = y + 'px';
}

function dragEnd(e) {
    if (!draggedPiece) return;

    const rect = container.getBoundingClientRect();
    const x = parseInt(draggedPiece.style.left);
    const y = parseInt(draggedPiece.style.top);

    const row = Math.round(y / pieceSize);
    const col = Math.round(x / pieceSize);

    if (row == draggedPiece.dataset.row && col == draggedPiece.dataset.col) {
        draggedPiece.style.left = col * pieceSize + 'px';
        draggedPiece.style.top = row * pieceSize + 'px';
        draggedPiece.style.pointerEvents = 'none'; // фиксируем
        checkCompletion();
    } else {
        draggedPiece.style.left = Math.random() * 150 + 'px';
        draggedPiece.style.top = Math.random() * 150 + 'px';
    }

    draggedPiece = null;
}

function checkCompletion() {
    if (pieces.every(p => p.style.pointerEvents == 'none')) {
        setTimeout(() => window.location.href = 'message.html', 500);
    }
}
