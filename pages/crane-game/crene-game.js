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
  x: 160,
  y: 50,
  width: 80,          // 幅を広く
  height: 30,         // 高さを大きく
  speed: 4,
  dropping: false,
  lifting: false,
  dropY: 50,
  armOpen: true,
  armAngle: 0,        // アニメーション用の角度
  maxArmAngle: Math.PI / 4,  // 最大角度（開き具合）
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
function drawCrane() {
  // ワイヤー
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(crane.x + crane.width / 2, 0);
  ctx.lineTo(crane.x + crane.width / 2, crane.y);
  ctx.stroke();

  // 本体
  const grad = ctx.createLinearGradient(crane.x, crane.y, crane.x + crane.width, crane.y + crane.height);
  grad.addColorStop(0, '#aaa');
  grad.addColorStop(1, '#ddd');
  ctx.fillStyle = grad;
  ctx.fillRect(crane.x, crane.y, crane.width, crane.height);

  // 爪
  const baseX = crane.x + crane.width / 2;
  const baseY = crane.y + crane.height;
  const armLength = 40;
  const armWidth = 10;

  ctx.fillStyle = '#333';

  // 左の爪（スライドして閉じる動き）
  const leftOffset = crane.armOpen ? -20 : -5;
  ctx.beginPath();
  ctx.moveTo(baseX + leftOffset, baseY);
  ctx.lineTo(baseX + leftOffset - armWidth, baseY + armLength);
  ctx.lineTo(baseX + leftOffset, baseY + armLength);
  ctx.closePath();
  ctx.fill();

  // 右の爪（スライドして閉じる動き）
  const rightOffset = crane.armOpen ? 20 : 5;
  ctx.beginPath();
  ctx.moveTo(baseX + rightOffset, baseY);
  ctx.lineTo(baseX + rightOffset + armWidth, baseY + armLength);
  ctx.lineTo(baseX + rightOffset, baseY + armLength);
  ctx.closePath();
  ctx.fill();
}


function drawPrize() {
  ctx.fillStyle = 'gold';
  ctx.fillRect(prize.x, prize.y, prize.width, prize.height);
}

/*function update() {
  if (gameOver) return;

  if (!crane.dropping && !crane.lifting) {
    if (keys['ArrowLeft'] && crane.x > 0) crane.x -= crane.speed;
    if (keys['ArrowRight'] && crane.x + crane.width < canvas.width) crane.x += crane.speed;
  } else if (crane.dropping) {
  if (crane.y < prize.y - crane.height) {
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
}*/
function update() {
  if (gameOver) return;

  // 開閉アニメーション（徐々に角度が変わる）
  if (crane.armOpen && crane.armAngle > 0) {
    crane.armAngle -= 0.05;
  } else if (!crane.armOpen && crane.armAngle < crane.maxArmAngle) {
    crane.armAngle += 0.05;
  }

  // 横移動
  if (!crane.dropping && !crane.lifting) {
    if (keys['ArrowLeft'] && crane.x > 0) crane.x -= crane.speed;
    if (keys['ArrowRight'] && crane.x + crane.width < canvas.width) crane.x += crane.speed;
  } 
  // 落下中
  else if (crane.dropping) {
    if (crane.y < crane.dropY + 270) {  // 下まで届くように
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
  } 
  // 引き上げ中
  else if (crane.lifting) {
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