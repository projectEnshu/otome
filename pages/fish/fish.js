document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const countdownElement = document.getElementById('countdown');
    const fishButton = document.getElementById('fish-button');
    const homeButton = document.getElementById('home-button');
    const h1Elements = document.querySelectorAll('h1:not(:first-child)');
    let countdownInterval;
    
    // 釣りゲーム用の変数
    let requiredClicks; // 釣るために必要なクリック回数
    let currentClicks = 0; // 現在のクリック回数
    let isFishing = false; // 釣り中かどうか
    let fishCaught = false; // 魚を釣ったかどうか

    // ランダムなクリック回数を生成する関数
    function getRandomClicks() {
        return Math.floor(Math.random() * 5) + 3; // 3から7の間のランダムな数
    }

    startButton.addEventListener('click', () => {
        let count = 3;
        countdownElement.style.display = 'block';
        countdownElement.textContent = count;
        startButton.style.display = 'none';
        homeButton.style.display = 'none';
        h1Elements.forEach(h1 => {
            h1.style.display = 'none';
        });
        fishButton.style.display = 'none';

        countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = count;

            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'GO!';
                fishButton.style.display = 'block';
                isFishing = true;
                currentClicks = 0;
                fishCaught = false;
                requiredClicks = getRandomClicks(); // ランダムなクリック回数を設定
            }
        }, 1000);
    });

    // 釣りボタンのクリックイベント
    fishButton.addEventListener('click', () => {
        if (!isFishing || fishCaught) return;

        currentClicks++;
        
        if (currentClicks >= requiredClicks) {
            fishCaught = true;
            countdownElement.textContent = '釣れた！';
            fishButton.style.display = 'none';
            homeButton.style.display = 'block';
            isFishing = false;
        } else {
            countdownElement.textContent = `${currentClicks}/${requiredClicks}`;
        }
    });
});
