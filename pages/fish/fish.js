document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const countdownElement = document.getElementById('countdown');
    let countdownInterval;

    startButton.addEventListener('click', () => {
        let count = 3;
        countdownElement.style.display = 'block';
        countdownElement.textContent = count;
        startButton.disabled = true;

        countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = count;

            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                startButton.disabled = false;
                // ここにゲーム開始の処理を追加できます
            }
        }, 1000);
    });
});
