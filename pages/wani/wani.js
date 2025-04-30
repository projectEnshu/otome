//クリックしたときのカーソルの座標（X, Y）を取得
document.addEventListener("click", function(event) {
    const x = event.clientX; // ビューポート内のX座標
    const y = event.clientY; // ビューポート内のY座標
    console.log("クリック座標: X =", x, ", Y =", y);
    alert(`クリック座標: X = ${x}, Y = ${y}`);
  });