const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        resize
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('frame', 'assets/frame.png');
    this.load.image('rogo', 'assets/rogo.png');

    this.load.image('kaba', 'assets/kaba.png');
    this.load.image('kabaDown','assets/kabaDown.png');

    this.load.image('result', 'assets/result.png');
}

function showHtmlCountdown(seconds, onComplete) {
  const el = document.getElementById('countdown');
  let count = seconds;
  el.style.display = 'flex';
  el.textContent = count;
  el.classList.add('pop');   // 最初のポップアニメ

  const intervalId = setInterval(() => {
    count--;
    if (count > 0) {
      el.textContent = count;
      el.classList.remove('pop');
      void el.offsetWidth;    // アニメ再トリガー
      el.classList.add('pop');
    } else {
      clearInterval(intervalId);
      el.textContent = 'START!';
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');  // ポップだけ

      setTimeout(() => {
        el.style.display = 'none';
        onComplete && onComplete();
      }, 800);
    }
  }, 1000);
}

function showTimer(seconds, onTimeout) {
  const el = document.getElementById('timer');
    const scoreEl = document.getElementById('score');  // スコア要素を取得
  let time = seconds;
  el.textContent = time;
  el.style.display = 'block';
  el.style.color = '#FFFFFF';

  const timerId = setInterval(() => {
    time--;
    if (time > 0) {
      el.textContent = time;
      if (time < 10) {
        el.style.color = '#FF4444';
        el.style.textShadow = '0 0 8px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.5)';
               scoreEl.style.display = 'none';
      }
    } else {
      clearInterval(timerId);
      el.style.display = 'none';

      // ● ここで終了メッセージを表示
      const endEl = document.getElementById('endMessage');
      endEl.style.display = 'flex';
      endEl.classList.remove('pop');
      void endEl.offsetWidth;       // アニメ再トリガー
      endEl.classList.add('pop');



      // 必要なら onTimeout() 呼び出し
      onTimeout && onTimeout();
    }
  }, 1000);
}



function create() {
    this.isGameOver = false;
this.hasShownResultScore = false;   // ← 追加
// スコア初期化
    this.score = 0;
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = this.score;
    this.resultSprite = null;  // ← 追加

    // 背景とフレームの追加
    this.bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.frame = this.add.image(0, 0, 'frame').setOrigin(0.5, 0.5);
    // this.rogo = this.add.image(this.frame.x, this.frame.y, 'rogo').setOrigin(0.5, 0.5);

    // コンテナを作って frame の位置に置く
    this.rogoContainer = this.add.container(this.frame.x, this.frame.y);
    this.rogo = this.add.image(0, 0, 'rogo').setOrigin(0.5, 0.5);

    // ロゴをコンテナに追加
    this.rogoContainer.add(this.rogo);

    // アニメーション（コンテナが上下に動く）
    this.tweens.add({
        targets: this.rogoContainer,
        y: '+=5',         // スクリーン上で上下に動く
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // デバッグ用Graphicsを用意しておく（常に最前面に描くならdepthも上げておく）
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(1000);

    // ボタン用のコンテナ作成
    this.startButtonContainer = this.add.container(0, 0);

    // 角丸ボックスを描画
    const buttonWidth = 100;
    const buttonHeight = 30;
    const buttonRadius = 7;

    const buttonBackground = this.add.graphics();
    buttonBackground.fillStyle(0xE33A26, 1); // 色と透明度
    buttonBackground.fillRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius);
    buttonBackground.lineStyle(2, 0xF87B0E, 1);
    buttonBackground.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius);
    buttonBackground.setOrigin?.(0.5); // 古いPhaserだと無視してOK

    // テキストを作成
    const buttonText = this.add.text(buttonWidth / 2, buttonHeight / 2, 'ゲームスタート！', {
        fontFamily: 'Arial',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#ffffff'
    }).setOrigin(0.5);

    // 当たり判定用の透明ゾーン
    const hitArea = this.add.zone(0, 0, buttonWidth, buttonHeight).setOrigin(0).setInteractive();

    // 最初は無効化
    hitArea.disableInteractive();

    // コンテナに追加（ヒットエリアを最初に追加することで下に配置）
    this.startButtonContainer.add([hitArea, buttonBackground, buttonText]);


    // 中心揃えのために調整
    this.startButtonContainer.setSize(buttonWidth, buttonHeight);
    this.startButtonContainer.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight),
        Phaser.Geom.Rectangle.Contains
    );

    function drawButton(graphics, fillColor, borderColor) {
        graphics.clear();
        graphics.fillStyle(fillColor, 1);
        graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius);
        graphics.lineStyle(2, borderColor, 1);
        graphics.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius);
    }

    this.hippoGroup = this.add.group();

this.diveAllHippos = () => {
  this.hippoGroup.getChildren().forEach(hippo => {
    // まだクリックされていないものにだけ処理
    if (!hippo.clicked) {
      // 既存ツイーン／タイマーをキャンセル
      this.tweens.killTweensOf(hippo);
      if (hippo.delayedDescent) hippo.delayedDescent.remove(false);


      // すぐ下降 → destroy
      this.tweens.add({
        targets: hippo,
        y: hippo.startY,
        duration: 500,
        ease: 'Power2',
        onComplete: () => hippo.destroy()
      });
    }
  });
};
 

this.showResult = () => {
  const frameX = this.frame.x;
  const frameY = this.frame.y;
  const frameW = this.frame.displayWidth;
  const frameH = this.frame.displayHeight;

  // result の表示幅をフレーム幅の 60% とした例
  const tex = this.textures.get('result').getSourceImage();
  const aspect = tex.width / tex.height;
  const displayW = frameW * 0.22;
  const displayH = displayW / aspect;

  // 画面外（上）からスタートする Y
  const startY = frameY - frameH/2 - displayH/2;

  // 最終停止位置をフレーム中心より 10% 上に
  const stopY = frameY - frameH * 0.021;

  const img = this.add.image(frameX, startY, 'result')
    .setOrigin(0.5)
    .setAlpha(0)
    .setDisplaySize(displayW, displayH);

  this.resultSprite = img;

  this.tweens.add({
    targets: img,
    y: stopY,    // ← ここを frameY から stopY に
    alpha: 1,
    duration: 1000,
    ease: 'Power2'
  });
};


this.showResultScore = () => {
  const img = this.resultSprite;
  if (!img) return;

  const scoreEl = document.getElementById('score');

  // --- 初回表示時だけ好感度を計算＆テキスト設定 ---
  if (!this.hasShownResultScore) {
    this.hasShownResultScore = true;

    // --- 好感度変化を計算 ---
    const score = this.score;
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
    this.affectionChange = affectionChange;

    // --- 現在の好感度を取得＆更新 ---
    let currentAffection = parseInt(localStorage.getItem("好感度"), 10);
    if (isNaN(currentAffection)) currentAffection = 50;
    currentAffection += affectionChange;
    localStorage.setItem("好感度", currentAffection);
    this.currentAffection = currentAffection;

    // --- ３行テキストを設定 ---
scoreEl.innerText =
  '叩けたカバの数：' + score + '\n\n' +
  '好感度の変化：' + (affectionChange > 0 ? '+' : '') + affectionChange + '\n\n' +
  '現在の好感度：' + currentAffection;

  scoreEl.style.fontSize = '36px';     // お好みのサイズで
scoreEl.style.lineHeight = '1.4';    // 行間も微調整すると見た目◎
    scoreEl.style.whiteSpace = 'pre-line';
    scoreEl.style.display    = 'block';

    // ポップイン演出は初回だけ
    scoreEl.classList.remove('pop');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('pop');
  }

  // --- 位置だけは毎回再計算して配置 ---
  // フレーム情報
  const frameH = this.frame.displayHeight;

  // canvas → 絶対座標
  const canvasBounds = this.game.canvas.getBoundingClientRect();
  const absX = canvasBounds.left + img.x;
  const absY = canvasBounds.top  + img.y;

  // HTML要素サイズ
  const scoreW = scoreEl.offsetWidth;
  const scoreH = scoreEl.offsetHeight;

  // オフセット割合（位置調整）
  const scoreOffsetY = frameH * 0.02; // 調整可

  // left/top 計算
  const left = absX - scoreW / 2;
  const top  = (absY - img.displayHeight / 2) + scoreOffsetY;

  Object.assign(scoreEl.style, {
    position: 'absolute',
    left:     `${left}px`,
    top:      `${top}px`,
  });

  // --- ホームへ戻るボタンを一度だけ追加 ---
  if (!this.homeButtonEl) {
    // 1) ボタン要素を作って基本スタイル
    const btn = document.createElement('div');
    btn.id = 'homeButton';
    btn.innerText = 'ホームへ戻る';
    Object.assign(btn.style, {
      position: 'absolute',
      fontFamily: 'Fredoka One, sans-serif',
      fontSize: '24px',
      color: '#ffffff',
      background: 'rgba(0,0,0,0.8)',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'center',
      zIndex: 2000,
    });

    // 2) クリックで遷移
    btn.addEventListener('click', () => {
      window.location.href = '../selection/selection.html';
    });

    // 3) DOM に追加
    document.getElementById('game-container').appendChild(btn);
    this.homeButtonEl = btn;
  }

  // --- ボタンの位置をスコア表示のすぐ下に合わせる ---
  const btn = this.homeButtonEl;
  const btnW = btn.offsetWidth;
  const btnH = btn.offsetHeight;

  // ボタンの top は score の下端 + 10px
  const btnLeft = left + (scoreW - btnW)/2;
  const btnTop  = top + scoreH + 40;

  Object.assign(btn.style, {
    left: `${btnLeft}px`,
    top:  `${btnTop}px`,
  });
  
};







    // カメラ初期設定
    const camera = this.cameras.main;
    camera.setZoom(1);
    camera.centerOn(this.scale.width / 2, this.scale.height / 2);

    // リサイズ対応
    this.scale.on('resize', resize, this);
    resize.call(this);

    // 一度だけズームさせる
    this.hasZoomed = false;

    this.input.on('pointerdown', () => {
        // if (this.hasZoomed) return; // すでにズーム済みなら無視

        this.hasZoomed = true;

        this.tweens.add({
            targets: camera,
            zoom: 3,
            duration: 1700,
            ease: 'Power2',
            onUpdate: () => {
                camera.centerOn(this.scale.width / 2, this.scale.height / 2);
            },
            onComplete: () => {

                hitArea.setInteractive();

                // ホバーイベントをズーム後に登録
                hitArea.on('pointerover', () => {
                    drawButton(buttonBackground, 0xff6347, 0xffffff);
                });
                hitArea.on('pointerout', () => {
                    drawButton(buttonBackground, 0xE33A26, 0xF87B0E);
                });
                this.startButtonContainer.setInteractive(
                    new Phaser.Geom.Rectangle(0, 0, this.startButtonContainer.width, this.startButtonContainer.height),
                    Phaser.Geom.Rectangle.Contains
                );
            }
        });
    });

    // クリック処理（hitAreaに移す）
    hitArea.on('pointerdown', () => {
        this.startButtonContainer.setVisible(false); // ボタンを非表示
        this.rogoContainer.setVisible(false);        // ロゴも非表示
        showHtmlCountdown(3, () => {
            
            showTimer(30, () => {
                this.isGameOver = true;
                this.hippoGroup.getChildren().forEach(hippo => {
                    hippo.disableInteractive();
                });
                this.diveAllHippos();

                  // 1秒後に結果画像をスライドイン
  this.time.delayedCall(1000, () => {
    document.getElementById('endMessage').style.display = 'none';
    this.showResult();


    
        this.time.delayedCall(1000, () => {
      this.showResultScore();
        resize.call(this);
    });
  });

            });

            const scoreEl = document.getElementById('score');
            scoreEl.style.display = 'block';
            scoreEl.style.opacity = '1'; 

            for (let i = 0; i < 5; i++) {
                // 0〜2000ms の間でランダムに遅延
                const delay = Phaser.Math.Between(0, 2000);
                this.time.delayedCall(delay, () => {
                    spawnRandomHippo.call(this);
                });
            }
        });
    });
}

function spawnRandomHippo() {
    if (this.isGameOver) return;
    const region    = this.hippoRegion;
    const regionW   = region.xMax - region.xMin;
    const regionH   = region.yMax - region.yMin;

    // ランダム相対位置
    const relX = Math.random();
    const relY = Math.random();
    const finalX = region.xMin + relX * regionW;
    const finalY = region.yMin + relY * regionH;

    // scale 計算
    const baseScale  = Phaser.Math.Linear(0.04, 0.12, relY);
    const finalScale = baseScale * this.frameScale;
    const imgH = this.textures.get('kaba').getSourceImage().height * finalScale;
    const startY = finalY + imgH;

    // ① 水中 (y=startY) に配置
    const hippo = this.add.image(finalX, startY, 'kaba')
        .setOrigin(0.5, 1)
        .setScale(finalScale);

    // ② 水面マスク
    const maskG = this.make.graphics({ add: false });
    maskG.fillStyle(0xffffff);
    maskG.fillRect(0, 0, this.scale.width, finalY);
    hippo.setMask(maskG.createGeometryMask());

    // プロパティ保持
    hippo.startY        = startY;
    hippo.finalY        = finalY;
    hippo.maskGraphics  = maskG;
    hippo.clicked       = false;     // クリック済みフラグ
    hippo.delayedDescent= null;      // タイマー参照
    hippo.descentTween  = null;      // tween 参照

    // ③ 上昇 → 1s 待機 → 下降 → 再出現
    const riseTween = this.tweens.add({
      targets: hippo,
      y: finalY,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        // 1秒後に本来の下降ツイーンを開始
        hippo.delayedDescent = this.time.delayedCall(500, () => {
          hippo.descentTween = this.tweens.add({
            targets: hippo,
            y: hippo.startY,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
              hippo.destroy();
        if (!hippo.clicked) {
          spawnRandomHippo.call(this);
        }
            }
          });
        });
      }
    });


    // ④ クリックで即沈める
    hippo.setInteractive({ cursor: 'pointer' });
    hippo.on('pointerdown', () => {
      if (hippo.clicked) return;          // 二重実行ガード
      hippo.clicked = true;

      // 既存の待機／下降をキャンセル
      if (hippo.delayedDescent) hippo.delayedDescent.remove(false);
      if (hippo.descentTween)     this.tweens.killTweensOf(hippo);

      // ① テクスチャ差し替え
      hippo.setTexture('kabaDown');

    // ★ スコア加算＆ポップ演出
    this.score += 1;
    const scoreEl = document.getElementById('score');
    scoreEl.textContent = this.score;

  

      // ② 下降だけ再実行
      this.tweens.add({
        targets: hippo,
        y: hippo.startY,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          hippo.destroy();
          // クリック時は再出現不要ならここは不要、
          // もし再出現したいなら次行をアンコメント
          spawnRandomHippo.call(this);
        }
      });
    });

    // 深度を Y に合わせる
    hippo.setDepth(finalY);
    this.hippoGroup.add(hippo);
}


function resize() {
    const width = this.scale.width;
    const height = this.scale.height;

    // --- フレームの再配置・リサイズ処理 ---
    this.bg.setDisplaySize(width, height);
    this.frame.setPosition(width / 2, height / 2 + 20);

    const frameRatio = this.frame.width / this.frame.height;
    let frameDisplayWidth, frameDisplayHeight;
    if (width / height > frameRatio) {
        frameDisplayWidth  = height * frameRatio;
        frameDisplayHeight = height;
    } else {
        frameDisplayWidth  = width;
        frameDisplayHeight = width / frameRatio;
    }
    this.frame.setDisplaySize(frameDisplayWidth, frameDisplayHeight);

    // const padX = frameDisplayWidth  * 0.23;
    // const padY = frameDisplayHeight * 0.450;
    const padX = frameDisplayWidth  * 0.266;
    const padY = frameDisplayHeight * 0.425;

    // ここでセンターを下にずらすオフセットを定義
    const offsetCenterY = frameDisplayHeight * 0.066; // フレーム高さの5%だけ下に

    this.hippoRegion = {
      xMin: this.frame.x - frameDisplayWidth  / 2 + padX,
      xMax: this.frame.x + frameDisplayWidth  / 2 - padX,
      yMin: this.frame.y - frameDisplayHeight / 2 + padY + offsetCenterY,
      yMax: this.frame.y + frameDisplayHeight / 2 - padY + offsetCenterY
    };

    // // --- デバッグ：赤い枠を描く ---
    // const g = this.debugGraphics;
    // g.clear();
    // g.lineStyle(2, 0xff0000, 1);  // 線幅2, 赤
    // const w = this.hippoRegion.xMax - this.hippoRegion.xMin;
    // const h = this.hippoRegion.yMax - this.hippoRegion.yMin;
    // g.strokeRect(
    //   this.hippoRegion.xMin,
    //   this.hippoRegion.yMin,
    //   w, h
    // );




  
    // --- フレームのスケール値を保存 ---
    const frameScaleX = frameDisplayWidth  / this.frame.width;
    const frameScaleY = frameDisplayHeight / this.frame.height;
    // どちらか一方、または平均を取ってもよい
    this.frameScale = (frameScaleX + frameScaleY) / 2;

    // ロゴの位置をフレーム中心に（高さに応じてオフセット）
    const logoYOffset = this.frame.displayHeight * 0.13;  // ← 高さの15%分上にずらす
    this.rogo.setPosition(this.frame.x, this.frame.y - logoYOffset);

    // フレームのスケールに合わせてロゴを相対スケーリング（25%）
    const scaleFactor = 0.25;
    this.rogo.setScale(frameScaleX * scaleFactor, frameScaleY * scaleFactor);

    // フレームのスケール値からスケーリング
    const frameScale = (frameScaleX + frameScaleY) / 2;

    // ボタンの位置をフレーム下あたりに配置
    this.startButtonContainer.setPosition(
        this.frame.x - (this.startButtonContainer.width * frameScale) / 2,
        this.frame.y + this.frame.displayHeight * 0.09
    );

    // スケーリングでズームに対応
    this.startButtonContainer.setScale(frameScale);



// --- 既存のフレームリサイズ処理 ---
  const frameX = this.frame.x;
  const frameY = this.frame.y;
  const frameW = this.frame.displayWidth;
  const frameH = this.frame.displayHeight;

  // オフセット割合（上で定義したもの）
  const timerOffsetX = -0.25;
  const timerOffsetY = 0.01;
  const scoreOffsetX = -0.22;
  const scoreOffsetY = 0.01;

  // タイマー（左上寄せ）
  const timerEl = document.getElementById('timer');
  timerEl.style.left = 
    `${frameX - frameW/2 + frameW * timerOffsetX}px`;
  timerEl.style.top  = 
    `${frameY - frameH/2 + frameH * timerOffsetY}px`;

  // スコア（右上寄せ）
  const scoreEl = document.getElementById('score');
  const scoreW  = scoreEl.offsetWidth;
  scoreEl.style.left = 
    `${frameX + frameW/2 - scoreW - frameW * scoreOffsetX}px`;
  scoreEl.style.top  = 
    `${frameY - frameH/2 + frameH * scoreOffsetY}px`;

    // --- 全カバを再配置・再スケール ---
  const region = this.hippoRegion;
  const regionW = region.xMax - region.xMin;
  const regionH = region.yMax - region.yMin;

  this.hippoGroup.getChildren().forEach(hippo => {
    // 再計算：ワールド座標
    hippo.x = region.xMin + hippo.relX * regionW;
    hippo.finalY = region.yMin + hippo.relY * regionH;

    // 再スケール
    const baseScale = Phaser.Math.Linear(0.04, 0.12, hippo.relY);
    hippo.setScale(baseScale * this.frameScale);

    // 再配置：もしまだ上昇中なら tween が override してくれるので、完了済みなら直接セット
    if (!hippo._tween || hippo._tween.isPlaying() === false) {
      hippo.y = hippo.finalY;
    }

    // マスクも更新（水面 = hippo.finalY）
    const mg = hippo.maskGraphics;
    mg.clear();
    mg.fillStyle(0xffffff);
    mg.fillRect(0, 0, this.scale.width, hippo.finalY);
  });
  
  if (this.resultSprite) {
    const img      = this.resultSprite;
    const frameX   = this.frame.x;
    const frameY   = this.frame.y;
    const frameW   = this.frame.displayWidth;
    const frameH   = this.frame.displayHeight;
    const tex      = this.textures.get('result').getSourceImage();
    const aspect   = tex.width / tex.height;

    // 再計算：表示サイズをフレーム幅の60%
    const displayW = frameW * 0.22;
    const displayH = displayW / aspect;

    const stopY = frameY - frameH * 0.021;

    // 上端からスタート位置も再計算
    const startY = frameY - frameH/2 - displayH/2;

    // 位置とサイズを更新
    img.x = frameX;
    // tween中は y を壊さないように、フェードイン完了後だけ再センター：
    if (!img._tweenIsRunning) {
      img.y = stopY;
    } else {
      img.y = Math.max(img.y, startY);
    }
    img.setDisplaySize(displayW, displayH);
  }

  if (this.resultSprite && this.hasShownResultScore) {
    this.showResultScore();
  }
}
