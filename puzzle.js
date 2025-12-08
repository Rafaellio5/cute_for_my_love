const puzzleContainer = document.getElementById('puzzle-container');
const nextBtn = document.getElementById('next-btn');

const size = puzzleContainer.offsetWidth;
const grid = 3;
const pieceSize = size / grid;

let pieces = [];

for (let i = 0; i < grid * grid; i++) {
  const piece = document.createElement('div');
  piece.classList.add('puzzle-piece');
  piece.style.width = pieceSize + 'px';
  piece.style.height = pieceSize + 'px';
  piece.style.left = Math.random() * (size - pieceSize) + 'px';
  piece.style.top = Math.random() * (size - pieceSize) + 'px';
  piece.style.backgroundImage = 'url("heart.jpg")';
  piece.style.backgroundSize = `${size}px ${size}px`;
  piece.style.backgroundPosition = `-${(i % grid) * pieceSize}px -${Math.floor(i / grid) * pieceSize}px`;
  piece.setAttribute('data-id', i);
  piece.setAttribute('data-placed', 'false');

  let offsetX, offsetY;

  piece.addEventListener('mousedown', dragStart);
  piece.addEventListener('touchstart', dragStart, {passive:false});

  function dragStart(e) {
    if (piece.getAttribute('data-placed') === 'true') return;
    e.preventDefault();
    const rect = piece.getBoundingClientRect();
    offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove, {passive:false});
    document.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
    if (piece.getAttribute('data-placed') === 'true') return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - offsetX - puzzleContainer.getBoundingClientRect().left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - offsetY - puzzleContainer.getBoundingClientRect().top;
    piece.style.left = Math.min(Math.max(0, x), size - pieceSize) + 'px';
    piece.style.top = Math.min(Math.max(0, y), size - pieceSize) + 'px';
  }

  function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', dragEnd);

    const id = parseInt(piece.getAttribute('data-id'));
    const correctX = (id % grid) * pieceSize;
    const correctY = Math.floor(id / grid) * pieceSize;
    const currentX = parseFloat(piece.style.left);
    const currentY = parseFloat(piece.style.top);

    if (Math.abs(currentX - correctX) < 20 && Math.abs(currentY - correctY) < 20) {
      piece.style.left = correctX + 'px';
      piece.style.top = correctY + 'px';
      piece.setAttribute('data-placed', 'true');
    }

    if (pieces.every(p => p.getAttribute('data-placed') === 'true')) {
      nextBtn.disabled = false;
    }
  }

  puzzleContainer.appendChild(piece);
  pieces.push(piece);
}
