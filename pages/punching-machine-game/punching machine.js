function goHome() {
    window.location.href = "../selection/selection.html";
  }
  
  let count = 0;
  let isRunning = false;
  let timer;
  let countdownInterval;
  const totalTime = 10;
  
  const scoreDiv = document.getElementById('score');
  const timerDiv = document.getElementById('timer');
  const resultDiv = document.getElementById('result');
  
  function startGame() {
    count = 0;
    isRunning = true;
    let remaining = totalTime;
    scoreDiv.textContent = "連打数: 0";
    timerDiv.textContent = `残り時間: ${remaining}秒`;
    resultDiv.textContent = "";
  
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
  
  const gameContainer = document.getElementById('gameContainer');
  
  function handlePunch() {
    if (!isRunning) {
      startGame();
      return;
    }
    count++;
    scoreDiv.textContent = `連打数: ${count}`;
    gameContainer.style.transform = "scale(1.05)";
    setTimeout(() => {
      gameContainer.style.transform = "scale(1)";
    }, 80);
  }
  
  function showResult() {
    let evaluation;
    let affectionChange = 0;
  
    if (count <= 30) {
      evaluation = "まだ肩慣らしレベル！";
      affectionChange = -5;
    } else if (count <= 49) {
      evaluation = "そこそこパンチャー";
      affectionChange = 1;
    } else if (count <= 74) {
      evaluation = "鉄拳マスター！";
      affectionChange = 5;
    } else {
      evaluation = "人間やめました？";
      affectionChange = 30;
    }
  
    let currentAffection = parseInt(localStorage.getItem("好感度")) || 50;
    currentAffection += affectionChange;
    localStorage.setItem("好感度", currentAffection);
  
    scoreDiv.style.display = "none";
    timerDiv.style.display = "none";
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('startMessage').style.display = 'none';
  
    document.getElementById('resultScreen').style.display = 'block';
    document.getElementById('finalScore').textContent = `連打数: ${count}`;
    document.getElementById('evaluation').textContent = `評価：${evaluation}`;
    document.getElementById('evaluation').innerHTML += `<br>好感度の変化: ${affectionChange > 0 ? '+' : ''}${affectionChange}`;
  
    document.body.className = "";
  }
  
  function restartGame() {
    document.getElementById('gameContainer').style.display = 'inline-block';
    document.getElementById('startMessage').style.display = 'block';
    document.getElementById('resultScreen').style.display = 'none';
  
    count = 0;
    isRunning = false;
    scoreDiv.textContent = "連打数: 0";
    timerDiv.textContent = "残り時間: 10秒";
    scoreDiv.style.display = "block";
    timerDiv.style.display = "block";
  
    document.body.className = "game";
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
  