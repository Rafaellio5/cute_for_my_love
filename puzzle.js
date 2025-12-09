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

        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);

        container.appendChild(piece);
        pieces.push(piece);
    }
}

let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
    setTimeout(() => draggedPiece.style.visibility = 'hidden', 0);
}

function dragEnd(e) {
    draggedPiece.style.visibility = 'visible';
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const row = Math.floor(y / pieceSize);
    const col = Math.floor(x / pieceSize);

    if (row == draggedPiece.dataset.row && col == draggedPiece.dataset.col) {
        draggedPiece.style.left = col * pieceSize + 'px';
        draggedPiece.style.top = row * pieceSize + 'px';
        draggedPiece.style.pointerEvents = 'none';  // фиксируем на месте
        checkCompletion();
    } else {
        draggedPiece.style.left = Math.random() * 150 + 'px';
        draggedPiece.style.top = Math.random() * 150 + 'px';
    }
}

function checkCompletion() {
    if (pieces.every(p => p.style.pointerEvents == 'none')) {
        setTimeout(() => window.location.href = 'message.html', 500);
    }
}
