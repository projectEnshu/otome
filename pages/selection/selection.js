// 好感度の表示を更新する関数
function updateAffectionDisplay() {
    const affection = localStorage.getItem("好感度");
    const affectionDisplay = document.getElementById("affection-display");
    if (affectionDisplay) {
        affectionDisplay.textContent = `現在の好感度: ${affection}`;
    }
}

// ボタンを無効化して非表示にする関数
function disableButton(button) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    button.style.display = 'none';  // ボタンを非表示にする
}

// エンディングボタンのクリックイベント
document.addEventListener('DOMContentLoaded', function() {
    updateAffectionDisplay();
    
    const endingButton = document.getElementById('ending-button');
    if (endingButton) {
        endingButton.addEventListener('click', function() {
            disableButton(endingButton);
            setTimeout(() => {
                window.location.href = '../ending/ending.html';
            }, 100);
        });
    }

    const fishButton = document.getElementById('fish-button');
    if (fishButton) {
        fishButton.addEventListener('click', function() {
            disableButton(fishButton);
            setTimeout(() => {
                window.location.href = '../fish/index.html';
            }, 100);
        });
    }

    const craneButton = document.getElementById('crane-button');
    if (craneButton) {
        craneButton.addEventListener('click', function() {
            disableButton(craneButton);
            setTimeout(() => {
                window.location.href = '../crane-game/crane-game.html';
            }, 100);
        });
    }

    const punchingButton = document.getElementById('punching-button');
    if (punchingButton) {
        punchingButton.addEventListener('click', function() {
            disableButton(punchingButton);
            setTimeout(() => {
                window.location.href = '../punching-machine-game/punching machine.html';
            }, 100);
        });
    }

    const kabaButton = document.getElementById('kaba-button');
    if (kabaButton) {
        kabaButton.addEventListener('click', function() {
            disableButton(kabaButton);
            setTimeout(() => {
                window.location.href = '../wani/wani.html';
            }, 100);
        });
    }
});