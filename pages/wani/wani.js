// Phaserゲームの基本設定をオブジェクトで定義
const config = {
  // レンダラーを自動選択（WebGL優先、fallbackでCanvas）
  type: Phaser.AUTO,
  // 画面サイズやリサイズ挙動の設定
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  // 背景色をダークグレーに設定
  backgroundColor: '#2d2d2d',
  // 使用するシーンのメソッドを指定

  scene: {
    preload,                                // アセットの読み込み
    create,                                 // ゲームオブジェクトの生成
    update                                  // フレームごとの更新処理
  }

};

// Phaserゲームインスタンスを生成
const game = new Phaser.Game(config);

// ---------- アセット読み込み ----------
function preload() {
  // 背景画像
  this.load.image('sceneBg', 'images/scene_bg.png');
  // アーケード筐体のフレーム
  this.load.image('frame', 'images/frame.png');
  // 画面領域の背景
  this.load.image('screenBg', 'images/screen_bg_1.png');
  // カバの通常状態画像
  this.load.image('kaba', 'images/kaba2.png');
  // カバを叩いた後の画像
  this.load.image('kabaDown', 'images/kabaDown.png');
  // スタートボタン
  this.load.image('startButton', 'images/start2.png');
  // ロゴテキスト（Kabakaba Panic）
  this.load.image('kabakabaPanic', 'images/kabakabaPanic2.png');
  // リザルトのフレーム
  this.load.image('result', 'images/result.png'); 
}


// ---------- ゲーム生成 ----------
function create() {
  // 背景を画面全体に表示
  this.add.image(this.scale.width / 2, this.scale.height / 2, 'sceneBg')
    .setOrigin(0.5)
    .setDisplaySize(this.scale.width, this.scale.height);

  // アーケードフレームのサイズ・位置を計算
  const arcadeFrameWidth = this.scale.width * 0.7 * 1.2;
  const arcadeFrameHeight = this.scale.height * 1.2;
  const arcadeFrameX = this.scale.width / 2;
  const arcadeFrameY = this.scale.height / 2 + 60;

  // アーケードフレームを表示
  const frame = this.add.image(arcadeFrameX, arcadeFrameY, 'frame')
    .setOrigin(0.5)
    .setDisplaySize(arcadeFrameWidth, arcadeFrameHeight);

  // 画面領域（カバが出現する部分）のサイズを計算
  const screenBgWidth = arcadeFrameWidth * 0.57;
  const screenBgHeight = arcadeFrameHeight * 0.397;

  // 画面領域背景を表示し、クリックを検知可能に設定
  const screenBg = this.add.image(arcadeFrameX, arcadeFrameY, 'screenBg')
    .setOrigin(0.5, 0.56)
    .setDisplaySize(screenBgWidth, screenBgHeight)
    .setInteractive();


  const resultImage = this.add.image(this.scale.width/2, -200, 'result')
  .setOrigin(0.5)
  .setAlpha(0)
  .setDisplaySize(700, 800)  
  .setDepth(1000);

  // カバを出現させる範囲の余白を定義
  const margin = {
    top: this.scale.height * 0.5,
    bottom: this.scale.height * 0.15,
    left: this.scale.width * 0.1,
    right: this.scale.width * 0.1
  };

  // 出現範囲の座標を定義
  const topY = margin.top;
  const bottomY = this.scale.height - margin.bottom;
  const leftX = margin.left;
  const rightX = this.scale.width - margin.right;

  // カバの最小・最大サイズと最大表示数を設定
  const minSize = 60;
  const maxSize = 200;
  const maxKabas = 7;
  const kabaSprites = [];
  let zoomed = false;     // 画面拡大済みフラグ
  let gameOver = false;   // ゲーム終了フラグ
  let score = 0;          // スコア管理

  // スコアテキスト（ゲーム開始前は非表示）
  const scoreText = this.add.text(this.scale.width - 160, 20, `スコア: 0`, {
    fontSize: '28px', fill: '#0f0', fontStyle: 'bold', padding: { top: 6, bottom: 6 } 
  }).setVisible(false);

  // ランダムな位置とサイズを計算して返すヘルパー関数
  function getRandomPositionAndSize() {
    // X座標とY座標をランダム決定
    const randX = Phaser.Math.Between(leftX, rightX);
    const randY = Phaser.Math.Between(topY, bottomY);
    // Y位置に応じて大きさを変える（遠近感）
    const ratio = (randY - topY) / (bottomY - topY);
    const size = minSize + (maxSize - minSize) * ratio;
    // 画面下に隠れるY座標を計算
    const hiddenY = bottomY + (size - minSize) * 5.2;
    return { randX, randY, size, hiddenY };
  }

  // マスクを更新してカバの出現領域を制限する関数
  function updateMask(kaba) {
    const maskShape = this.make.graphics({ x: 0, y: 0, add: false });
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(kaba.randX - kaba.size / 2, kaba.randY - kaba.size / 2, kaba.size, kaba.size);
    const mask = maskShape.createGeometryMask();
    kaba.setMask(mask);
  }

  // カバをアニメーションさせる関数
  function animateKaba(kaba) {
    // 既にクリック済みまたはゲーム終了なら処理しない
    if (kaba.clicked || gameOver) return;
    // 上昇アニメーション
    this.tweens.add({
      targets: kaba,
      y: kaba.randY,
      duration: 1000,
      ease: 'Sine.easeOut',
      onStart: () => kaba.setDepth(kaba.displayHeight),
      onComplete: () => {
        if (gameOver) return;
        // 少し待ってから下降アニメーション
        this.time.delayedCall(1000, () => {
          if (kaba.clicked || gameOver) return;
          this.tweens.add({
            targets: kaba,
            y: kaba.hiddenY,
            duration: 800,
            ease: 'Sine.easeIn',
            onComplete: () => {
              if (gameOver) return;
              // 隠れきったら再配置して再度アニメーション
              this.time.delayedCall(1000, () => {
                if (kaba.clicked || gameOver) return;
                const newPos = getRandomPositionAndSize();
                Object.assign(kaba, newPos);
                kaba.setPosition(kaba.randX, kaba.hiddenY);
                kaba.setDisplaySize(kaba.size, kaba.size);
                kaba.setDepth(kaba.size);
                kaba.setTexture('kaba');
                updateMask.call(this, kaba);
                animateKaba.call(this, kaba);
              });
            }
          });
        });
      }
    });
  }

  // カバのスプライトを最大数分生成し、配列に追加
  for (let i = 0; i < maxKabas; i++) {
    const { randX, randY, size, hiddenY } = getRandomPositionAndSize();
    const kaba = this.add.image(randX, hiddenY, 'kaba')
      .setOrigin(0.5)
      .setDisplaySize(size, size)
      .setInteractive()
      .setDepth(size);

    // カスタムプロパティをspriteに追加
    Object.assign(kaba, { randX, randY, size, hiddenY, clicked: false });
    updateMask.call(this, kaba);

    // クリック時の処理
    kaba.on('pointerdown', () => {
      if (kaba.clicked || gameOver) return;
      kaba.clicked = true;            // 一度だけ処理する
      score++;                       // スコア加算
      scoreText.setText(`スコア: ${score}`);
      kaba.setTexture('kabaDown');   // 叩いた画像に切替
      // 叩いた後に隠れるアニメーション
      this.tweens.add({
        targets: kaba,
        y: kaba.hiddenY,
        duration: 500,
        ease: 'Sine.easeIn',
        onComplete: () => {
          this.time.delayedCall(1000, () => {
            if (gameOver) return;
            // 再配置して再度アニメーション
            const newPos = getRandomPositionAndSize();
            Object.assign(kaba, newPos);
            kaba.setPosition(kaba.randX, kaba.hiddenY);
            kaba.setDisplaySize(kaba.size, kaba.size);
            kaba.setDepth(kaba.size);
            kaba.setTexture('kaba');
            updateMask.call(this, kaba);
            kaba.clicked = false;
            animateKaba.call(this, kaba);
          });
        }
      });
    });

    kabaSprites.push(kaba);
  }

  // スタートボタンを配置（最初は非インタラクト）
  const startButton = this.add.image(this.scale.width / 2, this.scale.height - 220, 'startButton')
    .setOrigin(0.5)
    .setDisplaySize(130, 50)
    .disableInteractive();

  // ロゴテキストを配置
  const kabakabaPanic = this.add.image(this.scale.width / 2, this.scale.height - 470, 'kabakabaPanic')
    .setOrigin(0.5)
    .setDisplaySize(460 * 1, 234 * 1);

  const ruleText = this.add.text(this.scale.width / 2 , this.scale.height / 2 + 40, '30秒以内にカバをクリック！！', {
    fontSize: '24px',
    fill: '#f90',
    fontStyle: 'bold',
    padding: { top: 6, bottom: 6 } 
  })
    .setOrigin(0.5) 


  // ホームへ戻るボタンを右下に配置
  const homeText = this.add.text(this.scale.width - 20, this.scale.height - 20, 'ホームへ戻る', {
    fontSize: '24px',
    fill: '#fff',
    fontStyle: 'bold'
  })
    .setOrigin(1, 1)                      // 右下基準に配置
    .setInteractive({ useHandCursor: true });

  // クリックで別ページへ遷移
  homeText.on('pointerdown', () => {
    window.location.href = '../selection/selection.html';  // 遷移先URLを適宜変更
  });

  // 画面クリックでズームインアニメーション＆スタートボタンを有効化
  screenBg.on('pointerdown', () => {
    if (zoomed) return;        // 既にズーム済みなら無視
    zoomed = true;
    // 画面領域を拡大
    this.tweens.add({ targets: screenBg, x: this.scale.width/2, y: this.scale.height/2 + 48, displayWidth: this.scale.width, displayHeight: this.scale.height, duration: 1200, ease: 'Power2' });
    // フレームも拡大
    this.tweens.add({ targets: frame,       x: this.scale.width/2, y: this.scale.height/2 + 48, displayWidth: this.scale.width*1.75, displayHeight: this.scale.height*2.5, duration:1200, ease:'Power2' });
    // スタートボタンを中央へ移動＆サイズ拡大後、クリック可能に
    this.tweens.add({ targets: startButton, x: this.scale.width/2, y: this.scale.height/2 +294, displayWidth:300, displayHeight:120, duration:1200, ease:'Power2', onComplete: () => {
      startButton.setInteractive({ useHandCursor: true });
    }});
    // ロゴも拡大
    this.tweens.add({ targets: kabakabaPanic, x: this.scale.width/2, y: this.scale.height/2 -224, displayWidth:460*2.1, displayHeight:234*2.1, duration:1200, ease:'Power2' });

    this.tweens.add({
    targets: ruleText,
    // 中心位置はそのまま、scaleX/Y でサイズを倍に
    scaleX: 2,
    scaleY: 2,
    // 必要に応じて y 座標を少しずらす場合は uncomment
     y: this.scale.height/2 + 15,
    duration: 1200,
    ease: 'Power2'
  });
  });

                  

  // スタートボタン押下時の処理
  startButton.on('pointerdown', () => {
    homeText.setVisible(false);
    startButton.setVisible(false);    // スタートボタン非表示
    kabakabaPanic.setVisible(false); // ロゴ非表示
    ruleText.setVisible(false)

    // カウントダウンテキストを中央に表示
    const countdownText = this.add.text(this.scale.width/2, this.scale.height/2, '', { fontSize:'80px', fill:'#fff', fontStyle: 'bold' }).setOrigin(0.5);
    const countdownNumbers = ['3','2','1',''];
    let index = 0;

    // カウントダウンを順番に表示する関数
    const showCountdown = () => {
      countdownText.setText(countdownNumbers[index]);
      if (index < countdownNumbers.length -1) {
        index++;
        this.time.delayedCall(1000, showCountdown);
      } else {
        // カウント終了後、ゲーム開始処理
        countdownText.destroy();
        scoreText.setVisible(true);    // スコア表示

        let remainingTime = 30;       // 制限時間
        const timerText = this.add.text(20,20, `残り: ${remainingTime} 秒`, { fontSize:'28px', fill:'#ff0',  fontStyle: 'bold', padding: { top: 6, bottom: 6 } });

        // タイマーイベント（1秒ごとにカウントダウン）
        this.time.addEvent({
          delay:1000,
          repeat: remainingTime -1,
          callback: ()=>{
            remainingTime--;
            timerText.setText(`残り: ${remainingTime} 秒`);
            if (remainingTime === 10){
              scoreText.setVisible(false);
            }
            if (remainingTime === 0) {
              gameOver = true;


              // かば下がらないバグ修正：予約されている別のTween／タイマーが動いてしまい、位置を元に戻してしまっているのが原因
              // すべてのカバのTweenを停止
              kabaSprites.forEach(kaba => {
                this.tweens.killTweensOf(kaba);
              });
                //すべての未実行のタイマーをキャンセル
              this.time.removeAllEvents();



              // 全カバを強制的に穴に戻す
              kabaSprites.forEach(kaba => {
                this.tweens.add({ targets:kaba, y:kaba.hiddenY, duration:800, ease:'Sine.easeIn' });
              });

              timerText.setVisible(false);
              scoreText.setVisible(false);

              // 「ゲーム終了」テキストを画面中央に生成して透明状態から表示
              const gameOverText=this.add.text(this.scale.width/2,this.scale.height/2,'ゲーム終了',{fontSize:'64px',fill:'#000',fontStyle: 'bold', padding: { top: 6, bottom: 6 } }).setOrigin(0.5); 
              this.time.delayedCall(1500, () => {
                gameOverText.destroy()
              // 制限時間が 0 になった瞬間のブロック内に追加
              this.tweens.add({
                targets: resultImage,
                y: this.scale.height/2,
                alpha: 1,
                duration: 1000,
                ease: 'Power2'
              });
              this.time.delayedCall(1000, () => {
                // 好感度の計算
                let affectionChange = 0;
                if (score >= 80) {
                  affectionChange = 30;
                } else if (score >= 70) {
                  affectionChange = 18;
                } else if (score >= 60) {
                  affectionChange = 6;
                } else {
                  affectionChange = -6;
                }

                // 現在の好感度を取得して更新
                let currentAffection = parseInt(localStorage.getItem("好感度")) || 50;
                currentAffection += affectionChange;
                localStorage.setItem("好感度", currentAffection);

                // スコアと好感度の変化を表示
                this.add.text(this.scale.width/2, this.scale.height/2 - 130, `叩けたカバの数：${score}匹`, {fontSize:'32px', fill:'#000', fontStyle: 'bold', padding: { top: 6, bottom: 6 } })
                .setOrigin(0.5)
                .setDepth(1001);

                this.add.text(this.scale.width/2, this.scale.height/2 - 30, `好感度の変化：${affectionChange > 0 ? '+' : ''}${affectionChange}`, {fontSize:'32px', fill:'#000',fontStyle: 'bold', padding: { top: 6, bottom: 6 } })
                .setOrigin(0.5)
                .setDepth(1001);

                this.add.text(this.scale.width/2, this.scale.height/2 + 70, `現在の好感度：${currentAffection}`, {fontSize:'32px', fill:'#000',fontStyle: 'bold', padding: { top: 6, bottom: 6 } })
                .setOrigin(0.5)
                .setDepth(1001);

                const gameOverHomeText = this.add.text(this.scale.width/ 2, this.scale.height / 2 + 250, 'ホームへ戻る', {
                  fontSize: '24px', fill: '#000',fontStyle: 'bold', padding: { top: 6, bottom: 6 } 
                })
                .setOrigin(0.5).setDepth(1002)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => window.location.href = '../selection/selection.html');
              });

              });

  
            }
          }
        });

        // 各カバの最初の出現アニメーションをランダムなタイミングで開始
        kabaSprites.forEach(kaba => {
          this.time.delayedCall(Phaser.Math.Between(200,5000), ()=>{
            animateKaba.call(this, kaba);
          });
        });
      }
    };

    showCountdown();  // カウントダウン開始
  });
}

// 未使用
function update() {}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
