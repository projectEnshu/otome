const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const timerElement = document.getElementById('timer');
const gameOverElement = document.getElementById('gameOver');
const catchButton = document.getElementById('catchButton');
const prizeCountElement = document.getElementById('prizeCount'); // 景品カウント表示

let timerInterval; // タイマーのインターバルID
const limitTime = 30; // 制限時間（秒）
let remainingTime = limitTime;
let gameOver = false; // ゲームオーバーフラグ
let prizeCount = 0; // 景品カウント
let caughtPrizeCount = 0; // 取った景品数変数

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; // スタート画面を非表示
  gameScreen.style.display = 'block'; // ゲーム画面を表示
  
  const backButton = document.getElementById("back_button");
  prizeCountElement.textContent = `取った景品数: 0`;
  if (backButton) backButton.style.display = "none"; // ← 非表示にする

  remainingTime = limitTime; // 残り時間をリセット
  isGameOver = false; // ゲームオーバーフラグをリセット
  prizeCountElement.textContent = 0; // 景品カウントをリセット
  timerInterval = setInterval(updateTimer, 1000); // タイマーを開始
  gameLoop(); // ゲームを開始
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
  armOpen: true, // アーム開閉フラグ
};

const prize = {
  x: Math.random() * 300 + 50,
  y: 350,
  width: 30,
  height: 30,
  caught: false, // 景品を掴んでいるか
};

let keys = {};

function drawCrane() {
  ctx.fillStyle = 'gray';
  ctx.fillRect(crane.x, crane.y, crane.width, crane.height);
  ctx.fillRect(crane.x + crane.width/2 - 2, 0, 4, crane.y); // rope

  // アーム（開閉式）
  ctx.fillStyle = 'black';
  if (crane.armOpen) {
    ctx.fillRect(crane.x - 10, crane.y + crane.height, 10, 10); // 左アーム（開き）
    ctx.fillRect(crane.x + crane.width, crane.y + crane.height, 10, 10); // 右アーム（開き）
  } else {
    ctx.fillRect(crane.x + crane.width/2 - 10, crane.y + crane.height, 8, 10); // 左アーム（閉じ）
    ctx.fillRect(crane.x + crane.width/2 + 2, crane.y + crane.height, 8, 10); // 右アーム（閉じ）
  }
}

function drawPrize() {
  ctx.fillStyle = 'gold';
  ctx.fillRect(prize.x, prize.y, prize.width, prize.height);
}

function update() {
  if(gameOver){
    return; // ゲームオーバーの場合は更新しない
  }
  if (!crane.dropping && !crane.lifting) {
    if (keys['ArrowLeft'] && crane.x > 0) {
      crane.x -= crane.speed;
    }
    if (keys['ArrowRight'] && crane.x + crane.width < canvas.width) {
      crane.x += crane.speed;
    }
  } else if (crane.dropping) {
    if (crane.y < crane.dropY + 200) {
      crane.y += 4;
    } else {
      crane.armOpen = false; // アームを閉じる
      setTimeout(() => {
        if (
          crane.x + crane.width/2 > prize.x &&
          crane.x + crane.width/2 < prize.x + prize.width
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
        prize.x = crane.x + crane.width/2 - prize.width/2;
      }
    } else {
      if (prize.caught) {
        caughtPrizeCount++;
        prizeCountElement.textContent = `取った景品数: ${caughtPrizeCount}`; // 景品カウントを更新
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
  requestAnimationFrame(gameLoop);
}

// キー操作
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// ボタン押したら降下開始
catchButton.addEventListener('click', () => {
  if (!crane.dropping && !crane.lifting) {
    crane.dropping = true;
  }
});

// タイマーの更新と処理
function updateTimer() {
   const minutes = Math.floor(remainingTime / 60);
   const seconds = remainingTime % 60;

   // 分と秒を2桁表示
   const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
   const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

   timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

   if (remainingTime <= 0) {
     clearInterval(timerInterval);
     gameOverElement.style.display = 'block'; // ゲームオーバー画面を表示
     gameOver = true; // ゲームオーバー状態にする
     
     const backButton = document.getElementById("back_button");
     if (backButton) backButton.style.display = "block"; // ← 表示する

   } else {
     remainingTime--;
   }
}
