import { setUpCanvas } from './client.js';

const canvas = document.getElementById('drawing-board');

var ctx = setUpCanvas(canvas);
const socket = io();

let isPainting = false;
let lineWidth = 3;
let startX;
let startY;

const draw = (e) => {
  if (!isPainting) {
    return;
  }
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  // console.log('e.clientX= ', e.clientX, ' e.clientY=', e.clientY);
  const bounds = canvas.getBoundingClientRect();
  // get the mouse coordinates, subtract the canvas top left and any scrolling

  let mouseX = e.pageX - bounds.left - scrollX;
  let mouseY = e.pageY - bounds.top - scrollY;
  // first normalize the mouse coordinates from 0 to 1 (0,0) top left
  // off canvas and (1,1) bottom right by dividing by the bounds width and height
  mouseX /= bounds.width;
  mouseY /= bounds.height;

  // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

  mouseX *= canvas.width;
  mouseY *= canvas.height;

  let data = {
    lineWidth: lineWidth,
    rang: ctx.strokeStyle,
    x: mouseX,
    y: mouseY,
  };
  socket.emit('draw', data);
  // ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
};

canvas.addEventListener('mousedown', (e) => {
  mouseDown(e);
});

canvas.addEventListener('mouseup', () => {
  mouseUp();
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseleave', () => {
  mouseLeave();
});

// mobile screen
canvas.addEventListener('pointerdown', (e) => {
  mouseDown(e);
});
canvas.addEventListener('pointerup', () => {
  mouseUp();
});
canvas.addEventListener('pointermove', (e) => {
  draw(e);
});
canvas.addEventListener('pointerleave', () => {
  mouseLeave();
});

function mouseLeave() {
  isPainting = false;
  ctx.beginPath();
}
function mouseUp() {
  //   console.log('e.clientX= ', e.clientX, ' e.clientY=', e.clientY);
  isPainting = false;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
}
function mouseDown(e) {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
  ctx.beginPath();
  socket.emit('mouse', { sx: startX, sy: startY });
}

// socket listning event
socket.on('mouse', (data) => {
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});

socket.on('draw', (data) => {
  ctx.lineWidth = data.lineWidth;
  ctx.strokeStyle = data.rang;
  ctx.lineCap = 'round';
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
});

// control actions
document.getElementById('green').onclick = () => {
  ctx.strokeStyle = 'green';
};
document.getElementById('red').onclick = () => {
  ctx.strokeStyle = 'red';
};
document.getElementById('yellow').onclick = () => {
  ctx.strokeStyle = 'yellow';
};
document.getElementById('blue').onclick = () => {
  ctx.strokeStyle = 'blue';
};
document.getElementById('black').onclick = () => {
  ctx.strokeStyle = 'black';
};

document.getElementById('mm-1').onclick = () => {
  // console.log('mm-1');
  lineWidth = 1;
};
document.getElementById('mm-2').onclick = () => {
  // console.log('mm-2');
  lineWidth = 3;
};
document.getElementById('mm-3').onclick = () => {
  // console.log('mm-3');
  lineWidth = 5;
};
document.getElementById('mm-4').onclick = () => {
  // console.log('mm-4');
  lineWidth = 7;
};
document.getElementById('mm-5').onclick = () => {
  // console.log('mm-5');
  lineWidth = 10;
};

const controlPanel = document.querySelector('.control-panel');
const strokeWidth = document.querySelector('.stroke-width');
const strokeWidthColor = document.querySelectorAll('.mm');

// strokeWidthColor.forEach((div) => console.log(div));
document.getElementById('moon').onclick = (e) => {
  console.log(e.target.id);
  if (e.target.id === 'moon') {
    strokeWidthColor.forEach((div) => (div.style.backgroundColor = '#343a40'));
    e.target.id = 'light';
    strokeWidth.style.color = '#343a40';
    e.target.src = './img/light.svg';
    controlPanel.style.backgroundColor = '#fff';
    ctx.strokeStyle = '#fff';
    canvas.style.backgroundColor = '#343a40';
  } else {
    strokeWidthColor.forEach((div) => (div.style.backgroundColor = '#fff'));
    e.target.id = 'moon';
    e.target.src = './img/free_icon_1.svg';
    strokeWidth.style.color = '#fff';
    controlPanel.style.backgroundColor = '#343a40';
    ctx.strokeStyle = '#343a40';
    canvas.style.backgroundColor = '#fff';
  }
};
