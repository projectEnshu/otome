document.getElementById("start-button").addEventListener("click", function () {
    const titleScreen = document.getElementById("title-screen");
    
    // フェードアウトアニメーション
    titleScreen.style.animation = "fadeOut 1s forwards";

    // 1秒後にページ遷移
    setTimeout(() => {
        window.location.href = "pages/kaiwa/kaiwa.html";
      }, 1000);
    });
  