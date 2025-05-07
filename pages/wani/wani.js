const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#2d2d2d',
    scene: {
      preload,
      create,
      update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image('sceneBg', 'images/scene_bg.png');
    this.load.image('frame', 'images/frame.png');
    this.load.image('screenBg', 'images/screen_bg_1.png');
    this.load.image('kaba', 'images/kaba2.png');
    this.load.image('kabaDown', 'images/kabaDown.png');
    this.load.image('startButton', 'images/start2.png');
    this.load.image('kabakabaPanic', 'images/kabakabaPanic2.png');
  }
  
  function create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'sceneBg')
      .setOrigin(0.5)
      .setDisplaySize(this.scale.width, this.scale.height);
  
    const arcadeFrameWidth = this.scale.width * 0.7 * 1.2;
    const arcadeFrameHeight = this.scale.height * 1.2;
    const arcadeFrameX = this.scale.width / 2;
    const arcadeFrameY = this.scale.height / 2 + 60;
  
    const frame = this.add.image(arcadeFrameX, arcadeFrameY, 'frame')
      .setOrigin(0.5)
      .setDisplaySize(arcadeFrameWidth, arcadeFrameHeight);
  
    const screenBgWidth = arcadeFrameWidth * 0.57;
    const screenBgHeight = arcadeFrameHeight * 0.397;
  
    const screenBg = this.add.image(arcadeFrameX, arcadeFrameY, 'screenBg')
      .setOrigin(0.5, 0.56)
      .setDisplaySize(screenBgWidth, screenBgHeight)
      .setInteractive();
  
    const margin = {
      top: this.scale.height * 0.5,
      bottom: this.scale.height * 0.15,
      left: this.scale.width * 0.1,
      right: this.scale.width * 0.1
    };
  
    const topY = margin.top;
    const bottomY = this.scale.height - margin.bottom;
    const leftX = margin.left;
    const rightX = this.scale.width - margin.right;
  
    const minSize = 60;
    const maxSize = 200;
    const maxKabas = 1;
    const kabaSprites = [];
    let zoomed = false;
    let gameOver = false;
    let score = 0;
  
    const scoreText = this.add.text(this.scale.width - 160, 20, `スコア: 0`, {
      fontSize: '28px',
      fill: '#0f0'
    }).setVisible(false);
  
    function getRandomPositionAndSize() {
      const randX = Phaser.Math.Between(leftX, rightX);
      const randY = Phaser.Math.Between(topY, bottomY);
      const ratio = (randY - topY) / (bottomY - topY);
      const size = minSize + (maxSize - minSize) * ratio;
      const hiddenY = bottomY + (size - minSize) * 5.2;
      return { randX, randY, size, hiddenY };
    }
  
    function updateMask(kaba) {
      const maskShape = this.make.graphics({ x: 0, y: 0, add: false });
      maskShape.fillStyle(0xffffff);
      maskShape.fillRect(kaba.randX - kaba.size / 2, kaba.randY - kaba.size / 2, kaba.size, kaba.size);
      const mask = maskShape.createGeometryMask();
      kaba.setMask(mask);
    }
  
    function animateKaba(kaba) {
      if (kaba.clicked || gameOver) return;
      this.tweens.add({
        targets: kaba,
        y: kaba.randY,
        duration: 1000,
        ease: 'Sine.easeOut',
        onStart: () => kaba.setDepth(kaba.displayHeight),
        onComplete: () => {
          if (gameOver) return;
          this.time.delayedCall(1000, () => {
            if (kaba.clicked || gameOver) return;
            this.tweens.add({
              targets: kaba,
              y: kaba.hiddenY,
              duration: 800,
              ease: 'Sine.easeIn',
              onComplete: () => {
                if (gameOver) return;
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
  
    for (let i = 0; i < maxKabas; i++) {
      const { randX, randY, size, hiddenY } = getRandomPositionAndSize();
      const kaba = this.add.image(randX, hiddenY, 'kaba')
        .setOrigin(0.5)
        .setDisplaySize(size, size)
        .setInteractive()
        .setDepth(size);
  
      Object.assign(kaba, { randX, randY, size, hiddenY, clicked: false });
      updateMask.call(this, kaba);
  
      kaba.on('pointerdown', () => {
        if (kaba.clicked || gameOver) return;
        kaba.clicked = true;
        score++;
        scoreText.setText(`スコア: ${score}`);
        kaba.setTexture('kabaDown');
        this.tweens.add({
          targets: kaba,
          y: kaba.hiddenY,
          duration: 500,
          ease: 'Sine.easeIn',
          onComplete: () => {
            this.time.delayedCall(1000, () => {
              if (gameOver) return;
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
  
    const startButton = this.add.image(this.scale.width / 2, this.scale.height - 220, 'startButton')
      .setOrigin(0.5)
      .setDisplaySize(130, 50)
      .disableInteractive();
  
    const kabakabaPanic = this.add.image(this.scale.width / 2, this.scale.height - 470, 'kabakabaPanic')
      .setOrigin(0.5)
      .setDisplaySize(460 * 1, 234 * 1);
  
    screenBg.on('pointerdown', () => {
      if (zoomed) return;
      zoomed = true;
      this.tweens.add({ targets: screenBg, x: this.scale.width / 2, y: this.scale.height / 2 + 48, displayWidth: this.scale.width, displayHeight: this.scale.height, duration: 1200, ease: 'Power2' });
      this.tweens.add({ targets: frame, x: this.scale.width / 2, y: this.scale.height / 2 + 48, displayWidth: this.scale.width * 1.75, displayHeight: this.scale.height * 2.5, duration: 1200, ease: 'Power2' });
      this.tweens.add({ targets: startButton, x: this.scale.width / 2, y: this.scale.height / 2 + 294, displayWidth: 300, displayHeight: 120, duration: 1200, ease: 'Power2', onComplete: () => {
        startButton.setInteractive({ useHandCursor: true });
      }});
      this.tweens.add({ targets: kabakabaPanic, x: this.scale.width / 2, y: this.scale.height / 2 - 224, displayWidth: 460 * 2.1, displayHeight: 234 * 2.1, duration: 1200, ease: 'Power2' });
    });
  
    startButton.on('pointerdown', () => {
      startButton.setVisible(false);
      kabakabaPanic.setVisible(false);
  
      const countdownText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
        fontSize: '80px', fill: '#fff'
      }).setOrigin(0.5);
  
      const countdownNumbers = ['3', '2', '1', ''];
      let index = 0;
  
      const showCountdown = () => {
        countdownText.setText(countdownNumbers[index]);
        if (index < countdownNumbers.length - 1) {
          index++;
          this.time.delayedCall(1000, showCountdown);
        } else {
          countdownText.destroy();
          scoreText.setVisible(true);
  
          let remainingTime = 10;
          const timerText = this.add.text(20, 20, `残り: ${remainingTime} 秒`, {
            fontSize: '28px', fill: '#ff0'
          });
  
          this.time.addEvent({
            delay: 1000,
            repeat: remainingTime - 1,
            callback: () => {
              remainingTime--;
              timerText.setText(`残り: ${remainingTime} 秒`);
              if (remainingTime === 0) {
                gameOver = true;
                kabaSprites.forEach(kaba => {
                  this.tweens.add({
                    targets: kaba,
                    y: kaba.hiddenY,
                    duration: 800,
                    ease: 'Sine.easeIn'
                  });
                });
              }
            }
          });
  
          kabaSprites.forEach(kaba => {
            this.time.delayedCall(Phaser.Math.Between(500, 1000), () => {
              animateKaba.call(this, kaba);
            });
          });
        }
      };
  
      showCountdown();
    });
  }
  
  function update() {}
  