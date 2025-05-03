const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


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
      // クレーンが下まで到達したらアーム閉じる
      crane.armOpen = false;
      // 少し待ってから判定＆引き上げ開始
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
document.getElementById('catchButton').addEventListener('click', () => {
  if (!crane.dropping && !crane.lifting) {
    crane.dropping = true;
  }
});

const limitTime = 30; // 制限時間（秒）
let remainingTime = limitTime;

// タイマー表示要素とフォーム要素の取得
const timerElement = document.getElementById('timer');
const formElement = document.getElementById('restrictedForm');

//タイマーの更新と処理
function updateTimer() {
    timerElement.textContent = `残り時間: ${remainingTime}秒`;
    if (remainingTime <= 0) {
        // タイマーが0になったら時間切れ
        clearInterval(timerInterval);
        alert("時間切れ！");
    } else {
        remainingTime--;
    }
}
//タイマーを1秒ごとに更新
const timerInterval = setInterval(updateTimer, 1000);

gameLoop(); // ゲームループ

//フォームの送信処理
formElement.addEventListener('submit', (event) => {
    if(remainingTime > 0) {
       // 残り時間がある場合はフォームを送信
       alert('フォームが送信されました！');  
    }else {
       // 残り時間がない場合は送信をキャンセル
       event.preventDefault();
       alert('時間切れのため、フォームは送信できません。');
    }
});