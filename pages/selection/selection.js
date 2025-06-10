// 好感度の表示を更新する関数
function updateAffectionDisplay() {
    const affection = localStorage.getItem("好感度");
    const affectionDisplay = document.getElementById("affection-display");
    if (affectionDisplay) {
        affectionDisplay.textContent = `現在の好感度: ${affection}`;
    }
}

// ボタンを無効化する関数
function disableButton(button) {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
}

// ボタンの状態を保存する関数
function saveButtonState(buttonId) {
    const disabledButtons = JSON.parse(localStorage.getItem("disabledButtons") || "[]");
    if (!disabledButtons.includes(buttonId)) {
        disabledButtons.push(buttonId);
        localStorage.setItem("disabledButtons", JSON.stringify(disabledButtons));
    }
}

// ボタンの状態を復元する関数
function restoreButtonStates() {
    const disabledButtons = JSON.parse(localStorage.getItem("disabledButtons") || "[]");
    disabledButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            disableButton(button);
        }
    });
}

// エンディングボタンのクリックイベント
document.addEventListener('DOMContentLoaded', function() {
    updateAffectionDisplay();
    restoreButtonStates(); // ボタンの状態を復元
    
    const endingButton = document.getElementById('ending-button');
    if (endingButton) {
        endingButton.addEventListener('click', function() {
            saveButtonState('ending-button');
            disableButton(endingButton);
            setTimeout(() => {
                window.location.href = '../ending/ending.html';
            }, 100);
        });
    }

    const fishButton = document.getElementById('fish-button');
    if (fishButton) {
        fishButton.addEventListener('click', function() {
            saveButtonState('fish-button');
            disableButton(fishButton);
            setTimeout(() => {
                window.location.href = '../fish/index.html';
            }, 100);
        });
    }

    const craneButton = document.getElementById('crane-button');
    if (craneButton) {
        craneButton.addEventListener('click', function() {
            saveButtonState('crane-button');
            disableButton(craneButton);
            setTimeout(() => {
                window.location.href = '../crane-game/crane-game.html';
            }, 100);
        });
    }

    const punchingButton = document.getElementById('punching-button');
    if (punchingButton) {
        punchingButton.addEventListener('click', function() {
            saveButtonState('punching-button');
            disableButton(punchingButton);
            setTimeout(() => {
                window.location.href = '../punching-machine-game/punching machine.html';
            }, 100);
        });
    }

    const kabaButton = document.getElementById('kaba-button');
    if (kabaButton) {
        kabaButton.addEventListener('click', function() {
            saveButtonState('kaba-button');
            disableButton(kabaButton);
            setTimeout(() => {
                window.location.href = '../wani/wani.html';
            }, 100);
        });
    }
});