const container = document.getElementById('infinity-container');
const message = document.getElementById('message');

const coords = [
  {x: 50, y: 120}, {x: 90, y: 50}, {x: 150, y: 30}, {x: 210, y: 50}, {x: 250, y: 120},
  {x: 210, y: 190}, {x: 150, y: 210}, {x: 90, y: 190}, {x: 50, y: 120}
];

let currentStep = 0;
let buttons = [];

const canvas = document.createElement('canvas');
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
container.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';
ctx.lineWidth = 3;

coords.forEach((pos, index) => {
  const btn = document.createElement('button');
  btn.classList.add('inf-btn');
  btn.style.left = pos.x + 'px';
  btn.style.top = pos.y + 'px';
  btn.textContent = index + 1;
  if (index !== 0) btn.classList.add('disabled');

  btn.addEventListener('click', () => {
    if (index !== currentStep) return;
    btn.style.backgroundColor = '#00c851';
    btn.classList.remove('disabled');
    currentStep++;

    if (currentStep < coords.length) {
      buttons[currentStep].classList.remove('disabled');
      drawLine(index, currentStep);
    } else {
      drawFullInfinity();
      setTimeout(() => {
        message.style.display = 'block';
      }, 2000);
    }
  });

  container.appendChild(btn);
  buttons.push(btn);
});

function drawLine(fromIndex, toIndex) {
  const from = coords[fromIndex];
  const to = coords[toIndex];
  ctx.beginPath();
  ctx.moveTo(from.x + 20, from.y + 20);
  ctx.lineTo(to.x + 20, to.y + 20);
  ctx.stroke();
}

function drawFullInfinity() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(coords[0].x + 20, coords[0].y + 20);
  for (let i = 1; i < coords.length; i++) {
    ctx.lineTo(coords[i].x + 20, coords[i].y + 20);
  }
  ctx.stroke();
}
