// crane-game.js
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

const crane = {

  x: 180,
  y: 50,
  width: 60,
  height: 40,
  speed: 4,
  dropping: false,
  lifting: false,
  dropY: 50,
  armOpen: true,
  armAngle: 0,
  maxArmAngle: Math.PI / 6,
  currentPrize: null
};

let prizes = [];
const PRIZE_COUNT = 4;

const prizeImages = [
  new Image(),
  new Image(),
  new Image(),
  new Image()
];

prizeImages[0].src = './images/image1.PNG';
prizeImages[1].src = './images/image2.PNG';
prizeImages[2].src = './images/image3.PNG';
prizeImages[3].src = './images/image4.PNG';


/*function createPrizes() {
  prizes = [];
  for (let i = 0; i < PRIZE_COUNT; i++) {
    prizes.push({
      x: Math.random() * (canvas.width - 50),
      y:  canvas.height - 10 - 80,  // 80は prize.height,
      width: 100,
      height: 100,
      image: prizeImages[Math.floor(Math.random() * prizeImages.length)],
      caught: false
    });
  }
}*/
function createPrizes() {
  prizes = [];

  const prizeWidth = 80;
  const prizeHeight = 80;
  const count = 4;

  const totalWidth = prizeWidth * count;
  const spacing = (canvas.width - totalWidth) / (count + 1); // 両端含めて余白分配

  for (let i = 0; i < count; i++) {
    const x = spacing + i * (prizeWidth + spacing);
    const y = canvas.height - 10 - prizeHeight;

    prizes.push({
      x,
      y,
      width: prizeWidth,
      height: prizeHeight,
      image: prizeImages[i % prizeImages.length], // 画像を順番に割り当て
    });
  }
}


 function drawCrane() {
  ctx.fillStyle = '#555';
  ctx.fillRect(crane.x, crane.y, crane.width, crane.height);

  // ロープ
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(crane.x + crane.width / 2, 0);
  ctx.lineTo(crane.x + crane.width / 2, crane.y);
  ctx.stroke();

  const armBaseY = crane.y + crane.height;
  const armBaseWidth = 30; // アームのベース（水平バー）
  const armBaseHeight = 20;
  const clawLength = 30;

  // アームベース（水平）
  ctx.fillStyle = '#888';
  ctx.fillRect(
    crane.x + crane.width / 2 - armBaseWidth / 2,
    armBaseY,
    armBaseWidth,
    armBaseHeight
  );
  
  // 爪の描画
  ctx.fillStyle = '#333';
  if (crane.armOpen) {
    // 左爪（開き）
    ctx.beginPath();
    ctx.moveTo(crane.x + crane.width / 2 - 12, armBaseY + armBaseHeight);
    ctx.lineTo(crane.x + crane.width / 2 - 28, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2 - 22, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2 - 6, armBaseY + armBaseHeight);
    ctx.fill();

    // 右爪（開き）
    ctx.beginPath();
    ctx.moveTo(crane.x + crane.width / 2 + 12, armBaseY + armBaseHeight);
    ctx.lineTo(crane.x + crane.width / 2 + 28, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2 + 22, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2 + 6, armBaseY + armBaseHeight);
    ctx.fill();
  } else {
    // 閉じた状態（左右爪を重ねる）
    ctx.beginPath();
    ctx.moveTo(crane.x + crane.width / 2 - 6, armBaseY + armBaseHeight);
    ctx.lineTo(crane.x + crane.width / 2 - 6, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2, armBaseY + armBaseHeight + clawLength + 6);
    ctx.lineTo(crane.x + crane.width / 2 + 6, armBaseY + armBaseHeight + clawLength);
    ctx.lineTo(crane.x + crane.width / 2 + 6, armBaseY + armBaseHeight);
    ctx.fill();
  }
}



function drawPrizes() {
  prizes.forEach(prize => {
      if (prize.image.complete) {
      ctx.drawImage(prize.image, prize.x, prize.y, prize.width, prize.height);
    }
    });
}

function update() {
  if (gameOver) return;

  // アームアニメーション（省略可）
  if (crane.armOpen && crane.armAngle > 0) {
    crane.armAngle -= 0.05;
  } else if (!crane.armOpen && crane.armAngle < crane.maxArmAngle) {
    crane.armAngle += 0.05;
  }

  if (!crane.dropping && !crane.lifting) {
    if (keys['ArrowLeft'] && crane.x > 0) crane.x -= crane.speed;
    if (keys['ArrowRight'] && crane.x + crane.width < canvas.width) crane.x += crane.speed;
  } else if (crane.dropping) {
    if (crane.y < 270) {
      crane.y += 4;
    } else {
      crane.armOpen = false;
      setTimeout(() => {
        for (const prize of prizes) {
          if (
            !prize.caught &&
            crane.x + crane.width / 2 > prize.x &&
            crane.x + crane.width / 2 < prize.x + prize.width
          ) {
            //prize.caught = true;
            crane.currentPrize = prize;
            break;
          }
        }
        crane.dropping = false;
        crane.lifting = true;
      }, 500);
    }
  } else if (crane.lifting) {
    if (crane.y > 50) {
      crane.y -= 4;
      if (crane.currentPrize) {
        crane.currentPrize.y = crane.y + crane.height + 10;
        crane.currentPrize.x = crane.x + crane.width / 2 - crane.currentPrize.width / 2;
      }
    } else {
      if (crane.currentPrize) {
        caughtPrizeCount++;
        prizeCountElement.textContent = `取った景品数: ${caughtPrizeCount}`;
        alert("ゲット成功！🎉");

        //crane.currentPrize.x = Math.random() * (canvas.width - 50);
        // ⬇️ 景品を床の位置（y = 350）に戻す
        //crane.currentPrize.y = 350;
        crane.currentPrize.x = Math.random() * (canvas.width - crane.currentPrize.width);
        crane.currentPrize.y = canvas.height - 10 - crane.currentPrize.height;


        crane.currentPrize = null;
      } else {
        alert("失敗！もう一回💦");
      }
      crane.lifting = false;
      crane.armOpen = true;
      crane.y = 50;
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrane();
  drawPrizes();
  update();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function updateTimer() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerElement.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    gameOver = true;
    gameOverElement.style.display = 'block';
  } else {
    remainingTime--;
  }
}

function resetGame() {
  createPrizes();
  crane.currentPrize = null;
}

const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'Enter' && !crane.dropping && !crane.lifting && !gameOver) {
    crane.dropping = true;
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

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  remainingTime = limitTime;
  gameOver = false;
  caughtPrizeCount = 0;
  prizeCountElement.textContent = `取った景品数: 0`;
  gameOverElement.style.display = 'none';
  createPrizes();
  timerInterval = setInterval(updateTimer, 1000);
  gameLoop();
});

const howToPlayButton = document.getElementById('howToPlayButton');
const howToPlayModal = document.getElementById('howToPlayModal');
const closeHowToPlay = document.getElementById('closeHowToPlay');

howToPlayButton.addEventListener('click', () => {
  howToPlayModal.style.display = 'block';
});
closeHowToPlay.addEventListener('click', () => {
  howToPlayModal.style.display = 'none';
});

