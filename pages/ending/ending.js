// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            // 好感度をリセット
            localStorage.setItem("好感度", 50);
            // top.htmlに遷移
            window.location.href = '/index.html';
        });
    }
});
