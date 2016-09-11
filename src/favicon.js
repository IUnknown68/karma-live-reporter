import {
  READY, EXECUTING, DISCONNECTED
} from 'karma-browser-constants';

const YELLOW = 'yellow';
const GREY = 'grey';
const RED = 'red';
const GREEN = 'green';
const WHITE = 'white';

const SIZE = 32;

const canvas = document.createElement('canvas');
canvas.width = canvas.height = SIZE;
const ctx = canvas.getContext('2d');

let browserList = [];

function getIconElement() {
  return document.getElementById('favicon');
}

function getColor(browser) {
  switch(browser.state) {
    case EXECUTING:
      return YELLOW;
    case DISCONNECTED:
      return GREY;
    default:
      return (browser.lastResult.failed > 0)
        ? RED
        : (browser.lastResult.success > 0)
          ? GREEN
          : WHITE;
  }
}

function paint() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  if (0 === browserList.length) {
    return;
  }
  const height = SIZE / browserList.length;
  browserList.forEach((browser, index) => {
    const top = SIZE * index / browserList.length;
    ctx.fillStyle = getColor(browser);
    ctx.fillRect(0, top, SIZE, height);
    ctx.strokeRect(0, top, SIZE, height);
  });
}

const favIcon = {
  updateList: (list) => {
    browserList = list;
    paint();
    getIconElement().href = canvas.toDataURL();
  }
};

export default favIcon;
