// 好感度の表示を更新する関数
function updateAffectionDisplay() {
    const affection = localStorage.getItem("好感度");
    const affectionDisplay = document.getElementById("affection-display");
    if (affectionDisplay) {
        affectionDisplay.textContent = `現在の好感度: ${affection}`;
    }
}

// エンディングボタンのクリックイベント
document.addEventListener('DOMContentLoaded', function() {
    updateAffectionDisplay();
    
    const endingButton = document.getElementById('ending-button');
    if (endingButton) {
        endingButton.addEventListener('click', function() {
            window.location.href = '../ending/ending.html';
        });
    }
});