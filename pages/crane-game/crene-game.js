const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const timerElement = document.getElementById('timer');
const gameOverElement = document.getElementById('gameOver');
const catchButton = document.getElementById('catchButton');
const prizeCountElement = document.getElementById('prizeCount');

let timerInterval;
const limitTime = 30;
let remainingTime = limitTime;
let gameOver = false;
let caughtPrizeCount = 0;

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  const backButton = document.getElementById("back_button");

  remainingTime = limitTime;
  gameOver = false;
  caughtPrizeCount = 0;
  prizeCountElement.textContent = `取った景品数: 0`;
  gameOverElement.style.display = 'none';

  timerInterval = setInterval(updateTimer, 1000);
  gameLoop();
});

const crane = {
  x: 180,
  y: 50,
  width: 40,
  height: 20,
  speed: 4,
  dropping: false,
  lifting: false,
  dropY: 50,
  armOpen: true,
};

const prize = {
  x: Math.random() * 300 + 50,
  y: 350,
  width: 30,
  height: 30,
  caught: false,
};

let keys = {};

function drawCrane() {
  ctx.fillStyle = 'gray';
  ctx.fillRect(crane.x, crane.y, crane.width, crane.height);
  ctx.fillRect(crane.x + crane.width/2 - 2, 0, 4, crane.y);

  ctx.fillStyle = 'black';
  if (crane.armOpen) {
    ctx.fillRect(crane.x - 10, crane.y + crane.height, 10, 10);
    ctx.fillRect(crane.x + crane.width, crane.y + crane.height, 10, 10);
  } else {
    ctx.fillRect(crane.x + crane.width/2 - 10, crane.y + crane.height, 8, 10);
    ctx.fillRect(crane.x + crane.width/2 + 2, crane.y + crane.height, 8, 10);
  }
}

function drawPrize() {
  ctx.fillStyle = 'gold';
  ctx.fillRect(prize.x, prize.y, prize.width, prize.height);
}

function update() {
  if (gameOver) return;

  if (!crane.dropping && !crane.lifting) {
    if (keys['ArrowLeft'] && crane.x > 0) crane.x -= crane.speed;
    if (keys['ArrowRight'] && crane.x + crane.width < canvas.width) crane.x += crane.speed;
  } else if (crane.dropping) {
    if (crane.y < crane.dropY + 200) {
      crane.y += 4;
    } else {
      crane.armOpen = false;
      setTimeout(() => {
        if (
          crane.x + crane.width / 2 > prize.x &&
          crane.x + crane.width / 2 < prize.x + prize.width
        ) {
          prize.caught = true;
        }
        crane.dropping = false;
        crane.lifting = true;
      }, 500);
    }
  } else if (crane.lifting) {
    if (crane.y > 50) {
      crane.y -= 4;
      if (prize.caught) {
        prize.y = crane.y + crane.height + 10;
        prize.x = crane.x + crane.width / 2 - prize.width / 2;
      }
    } else {
      if (prize.caught) {
        caughtPrizeCount++;
        prizeCountElement.textContent = `取った景品数: ${caughtPrizeCount}`;
        alert("ゲット成功！🎉");
        resetGame();
      } else {
        alert("失敗！もう一回💦");
      }
      crane.lifting = false;
      crane.armOpen = true;
      crane.y = 50;
    }
  }
}

function resetGame() {
  prize.x = Math.random() * 300 + 50;
  prize.y = 350;
  prize.caught = false;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrane();
  drawPrize();
  update();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  //Enterキーでアームを降ろす
  if(e.key === 'Enter'){
    if (!crane.dropping && !crane.lifting && !gameOver) {
      crane.dropping = true;
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

catchButton.addEventListener('click', () => {
  if (!crane.dropping && !crane.lifting && !gameOver) {
    crane.dropping = true;
  }
});

function updateTimer() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerElement.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    gameOver = true;
    gameOverElement.style.display = 'block';
    /*const backButton = document.getElementById("back_button");
    if (backButton) backButton.style.display = "block";*/
  } else {
    remainingTime--;
  }
}
  // 説明ボタンとモーダル制御
const howToPlayButton = document.getElementById('howToPlayButton');
const howToPlayModal = document.getElementById('howToPlayModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');

howToPlayButton.addEventListener('click', () => {
  howToPlayModal.style.display = 'block';
});

closeHowToPlay.addEventListener('click', () => {
  howToPlayModal.style.display = 'none';
});