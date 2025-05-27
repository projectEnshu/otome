// 好感度の表示を更新する関数
function updateAffectionDisplay() {
    const affection = localStorage.getItem("好感度");
    const affectionDisplay = document.getElementById("affection-display");
    if (affectionDisplay) {
        affectionDisplay.textContent = `現在の好感度: ${affection}`;
    }
}

// ページ読み込み時に好感度を表示
document.addEventListener('DOMContentLoaded', updateAffectionDisplay);