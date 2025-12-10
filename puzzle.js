const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");

const size = 100;
const grid = 3;
const pieces = [];
let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;
let imageLoaded = false;
let completed = 0;

const img = new Image();
img.src = "heart.jpg";

img.onload = () => {
    imageLoaded = true;
    initPuzzle();
    drawPuzzle();
};

function initPuzzle() {
    let id = 0;

    for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
            pieces.push({
                id: id++,
                correctX: x * size,
                correctY: y * size,
                x: Math.random() * 200,
                y: Math.random() * 200,
                fixed: false
            });
        }
    }
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(p.x, p.y, size, size);
        ctx.clip();
        ctx.drawImage(
            img,
            p.correctX, p.correctY,
            size, size,
            p.x, p.y,
            size, size
        );
        ctx.restore();

        if (!p.fixed) {
            ctx.strokeStyle = "rgba(255,255,255,0.7)";
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, size, size);
        }
    });

    requestAnimationFrame(drawPuzzle);
}

function getPieceAt(x, y) {
    for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        if (!p.fixed &&
            x >= p.x && x <= p.x + size &&
            y >= p.y && y <= p.y + size) {
            return p;
        }
    }
    return null;
}

function pointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const p = getPieceAt(cx, cy);
    if (p) {
        draggedPiece = p;
        offsetX = cx - p.x;
        offsetY = cy - p.y;

        // на вершину
        pieces.splice(pieces.indexOf(p), 1);
        pieces.push(p);
    }
}

function pointerMove(e) {
    if (!draggedPiece) return;

    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    draggedPiece.x = cx - offsetX;
    draggedPiece.y = cy - offsetY;
}

function pointerUp() {
    if (!draggedPiece) return;

    // проверяем попадание
    const dist = Math.hypot(
        draggedPiece.x - draggedPiece.correctX,
        draggedPiece.y - draggedPiece.correctY
    );

    if (dist < 35) {
        draggedPiece.x = draggedPiece.correctX;
        draggedPiece.y = draggedPiece.correctY;
        draggedPiece.fixed = true;
        completed++;

        if (completed === 9) {
            setTimeout(showSecondScreen, 800);
        }
    }

    draggedPiece = null;
}

canvas.addEventListener("mousedown", pointerDown);
canvas.addEventListener("mousemove", pointerMove);
canvas.addEventListener("mouseup", pointerUp);

canvas.addEventListener("touchstart", pointerDown);
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    pointerMove(e);
}, { passive: false });
canvas.addEventListener("touchend", pointerUp);


function showSecondScreen() {
    const screen = document.getElementById("secondScreen");
    screen.classList.add("show");

    // сердечки
    setInterval(() => {
        const h = document.createElement("div");
        h.classList.add("heart");
        h.innerHTML = "❤️";
        h.style.left = Math.random() * 90 + "%";
        h.style.animationDuration = 3 + Math.random() * 2 + "s";
        document.body.appendChild(h);

        setTimeout(() => h.remove(), 5000);
    }, 400);
}
