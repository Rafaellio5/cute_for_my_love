const puzzleContainer = document.getElementById('puzzle-container');
const nextBtn = document.getElementById('next-btn');

const size = puzzleContainer.offsetWidth;
const grid = 3; // 3x3 пазл
const pieceSize = size / grid;

let pieces = [];

// Создаём кусочки пазла
for (let i = 0; i < grid * grid; i++) {
  const piece = document.createElement('div');
  piece.classList.add('puzzle-piece');
  piece.style.width = pieceSize + 'px';
  piece.style.height = pieceSize + 'px';
  piece.style.position = 'absolute';
  piece.style.left = Math.random() * (size - pieceSize) + 'px';
  piece.style.top = Math.random() * (size - pieceSize) + 'px';
  piece.style.backgroundImage = 'url("heart.jpg")';
  piece.style.backgroundSize = `${size}px ${size}px`;
  piece.style.backgroundPosition = `-${(i % grid) * pieceSize}px -${Math.floor(i / grid) * pieceSize}px`;
  piece.style.borderRadius = '10px';
  piece.style.cursor = 'grab';
  piece.setAttribute('data-id', i);

  // Драг-н-дроп
  let offsetX, offsetY;

  piece.addEventListener('mousedown', dragStart);
  piece.addEventListener('touchstart', dragStart);

  function dragStart(e) {
    e.preventDefault();
    const rect = piece.getBoundingClientRect();
    offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
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

    // если близко к правильной позиции — притягиваем
    const currentX = parseFloat(piece.style.left);
    const currentY = parseFloat(piece.style.top);
    if (Math.abs(currentX - correctX) < 20 && Math.abs(currentY - correctY) < 20) {
      piece.style.left = correctX + 'px';
      piece.style.top = correctY + 'px';
      piece.setAttribute('data-placed', 'true');
    }

    // проверяем, собран ли весь пазл
    if (pieces.every(p => p.getAttribute('data-placed') === 'true')) {
      nextBtn.disabled = false;
    }
  }

  puzzleContainer.appendChild(piece);
  pieces.push(piece);
}
