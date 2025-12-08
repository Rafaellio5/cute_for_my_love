const canvas = document.getElementById('infinity-canvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

let drawing = false;
let points = [];

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('touchstart', startDraw, {passive:false});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw, {passive:false});

canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchend', endDraw);

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  points = [];
  const pos = getPos(e);
  points.push(pos);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  points.push(pos);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function endDraw() {
  if (!drawing) return;
  drawing = false;
  if (points.length > 50) {
    message.style.display = 'block';
  }
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  } else {
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
}
