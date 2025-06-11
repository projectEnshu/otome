function goHome() {
  window.location.href = "../selection/selection.html";
}

let count = 0;
let isRunning = false;
let timer;
let countdownInterval;
const totalTime = 10;

const timerDiv = document.getElementById('timer');
const scoreValue = document.getElementById('scoreValue');
const punchPad = document.getElementById('punchPad');

function startGame() {
  count = 0;
  isRunning = true;
  let remaining = totalTime;
  scoreValue.textContent = "000";
  timerDiv.textContent = `残り時間: ${remaining}秒`;

  countdownInterval = setInterval(() => {
    remaining--;
    timerDiv.textContent = `残り時間: ${remaining}秒`;
    if (remaining <= 0) clearInterval(countdownInterval);
  }, 1000);

  timer = setTimeout(() => {
    isRunning = false;
    clearInterval(countdownInterval);
    timerDiv.textContent = "終了！";
    showResult();
  }, totalTime * 1000);
}

function handlePunch() {
  if (!isRunning) {
    startGame();
    return;
  }
  count++;
  scoreValue.textContent = String(count).padStart(3, '0');
  punchPad.classList.add('punched');
  setTimeout(() => punchPad.classList.remove('punched'), 80);
}

function showResult() {
  let evaluation;
  let affectionChange = 0;

  if (count <= 49) {
    evaluation = "まだ肩慣らしレベル！";
    affectionChange = -5;
  } else if (count <= 74) {
    evaluation = "そこそこパンチャー";
    affectionChange = 1;
  } else if (count <= 109) {
    evaluation = "鉄拳マスター！";
    affectionChange = 5;
  } else {
    evaluation = "人間やめました？";
    affectionChange = 30;
  }

  let currentAffection = parseInt(localStorage.getItem("好感度")) || 50;
  currentAffection += affectionChange;
  localStorage.setItem("好感度", currentAffection);

  document.getElementById('resultScreen').style.display = 'block';
  document.getElementById('finalScore').textContent = `連打数: ${count}`;
  document.getElementById('evaluation').innerHTML = `評価：${evaluation}<br>好感度の変化: ${affectionChange > 0 ? '+' : ''}${affectionChange}`;
  document.getElementById('affectionLevel').textContent = currentAffection;
}

function restartGame() {
  document.getElementById('resultScreen').style.display = 'none';
  scoreDiv.textContent = "連打数: 0";
  scoreValue.textContent = "000";
  timerDiv.textContent = "残り時間: 10秒";
  isRunning = false;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && !isRunning) {
    e.preventDefault();
    startGame();
  } else if (e.code === "Space" && isRunning && !e.repeat) {
    e.preventDefault();
    handlePunch();
  }
});
