window.onload = function() {
    const gameContainer = document.querySelector("#game-container");
    const clickContainer = document.querySelector("#click-container");
    const fishingLine = document.querySelector("#line");
    const startScreen = document.querySelector("#start-screen");
    const startTitle = document.querySelector("#start-title");
    const infoWrapper = document.querySelector("#info-wrapper");
    const instructions = document.querySelector("#instructions");
    const startBtn = document.querySelector("#start-btn");
    const gameStats = document.querySelector("#game-stats");
    const gameGoal = document.querySelector("#game-goal");
    const gameTimer = document.querySelector("#game-timer");
    const gameTimerGauge = document.querySelector(".timer-gauge");
    const gameScore = document.querySelector("#game-score");
    var mousePosition = {
        x:0,
        y:0
    }
    var gameTimerInterval = null;
    var score = 0;
    var currentScore = 0;
    var fishTracker = [0,0,0,0] //first item is fish, second is rare fish, third is trash, fourth is jellyfish. no sharks as it will lead to autolose

    //initialise the create items interval variables
    var createFishInterval = null;
    var createRareFishInterval = null;
    var createTrashInterval = null;
    var createJellyfishInterval = null;
    var createSharkInterval = null;

    //music and sounds
    var bgm; //set bgm
    var blop; //fish sound
    var rareBlop; // rare fish sound
    var trashSound; // trash sound
    var bzzt; //jellyfish zapping sound
    var bite; //shark bite sound

    //event listeners
    startBtn.addEventListener("click", startGame);
    clickContainer.addEventListener("mousemove", checkCursor);

    function checkCursor (event){
        //update cursor co ordinates
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
        //set fishing line to follow cursor
        fishingLine.style.left= mousePosition.x+"px";
        fishingLine.style.top = mousePosition.y+"px";
    }

    //create audio element for playing music and sfx
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    }

    //start game function
    function startGame () {
        //initialise sounds
        blop = new sound('sfx/fish.mp3');
        rareBlop = new sound('sfx/rare-fish.mp3');
        trashSound = new sound('sfx/trash.mp3');
        bzzt = new sound('sfx/bzzt.mp3');
        bite = new sound('sfx/bite.mp3');
        bgm = new sound('sfx/Bug_Catching.mp3');
        bgm.play();
        fishTracker = [0,0,0,0];
        score = 0;
        currentScore = 0;
        infoWrapper.style.display = "none";
        startTitle.style.display = "none";
        clickContainer.style.display = "block";
        gameStats.style.display = "flex";
        gameGoal.style.display = "block";
        createItems();
    }

    //create items function
    function createItems() {
        createTimer();
        gameGoal.innerText = `Score: 0`;
        createFishInterval = setInterval(createFish, 250);
        createRareFishInterval = setInterval(createRareFish, 1000);
        createTrashInterval = setInterval(createTrash, 3000);
        createJellyfishInterval = setInterval(createJellyfish, 3000);
        createSharkInterval = setInterval(createShark, 3000);
    }

    //create timer function
    function createTimer () {
        gameTimer.innerText = "30s";
        gameScore.innerText = "Total Score: 0";
        let sec = 0;
        gameTimerInterval = setInterval(startGameTimer, 1000);
        function startGameTimer () {
            gameTimer.textContent = 30-sec+"s";
            if (sec === 30) {
                sec = 0;
                endDay(false);
                gameTimer.textContent = 30-sec+"s";
                gameTimer.classList.remove("warning");
                gameTimerGauge.classList.remove("ticking");
            }
            else {
                if (sec === 1) {
                    gameTimerGauge.classList.add("ticking");
                }
                if (sec > 9){
                    gameTimer.classList.add("warning");
                }
                sec++
            }
        }
    }
    //create fish function
    function createFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1000);
    }
    //create rare fish function
    function createRareFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("rare-fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);

        }, 650);
    }
    //create trash function
    function createTrash () {
        let trash = document.createElement("div");
        trash.classList.add("item");
        trash.classList.add("trash");
        clickContainer.appendChild(trash);
        setPosition(trash);
        trash.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!trash.classList.contains("caught")){
                trash.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(trash)){
                    clickContainer.removeChild(trash);
                }
            }, 350);
        }, 3000);
    }
    //create jellyfish function
    function createJellyfish () {
        let jellyfish = document.createElement("div");
        jellyfish.classList.add("item");
        jellyfish.classList.add("jellyfish");
        clickContainer.appendChild(jellyfish);
        setPosition(jellyfish);
        jellyfish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!jellyfish.classList.contains("caught")){
                jellyfish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(jellyfish)){
                    clickContainer.removeChild(jellyfish);
                }
            }, 350);
        }, 3000);
    }
    //create shark function
    function createShark () {
        let shark = document.createElement("div");
        shark.classList.add("item");
        shark.classList.add("shark");
        clickContainer.appendChild(shark);
        setPosition(shark);
        shark.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!shark.classList.contains("caught")){
                shark.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(shark)){
                    clickContainer.removeChild(shark);
                }
            }, 350);
        }, 3000);
    }

    function setPosition(item) {
        let leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth-100));
        let topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight/5*4)-100)+(clickContainer.offsetHeight/5));
        // if it a type of sea creature and is not trash
        if (!item.classList.contains("trash")) {
            let randomNum = Math.floor(Math.random()*2);
            //left side
            if (randomNum%2 === 0){
                if (!item.classList.contains("jellyfish")){
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100));
                }
                else {
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100));
                }
                setInterval(function(){
                    if (item.classList.contains("fish")) {
                        leftPos+=45;
                    }
                    else if (item.classList.contains("rare-fish")){
                        leftPos+=65;
                    }
                    else if (item.classList.contains("jellyfish")){
                        leftPos+=5;
                    }
                    else if (item.classList.contains("shark")){
                        leftPos+=15;
                        if (topPos>mousePosition.y) {
                            topPos-=10;
                        }
                        else {
                            topPos+=10;
                        }
                    }
                    item.style.left = leftPos+"px";
                    item.style.top = topPos+"px";
                }, 100);
                item.classList.add("left");
            }
            //right side
            else {
                if (!item.classList.contains("jellyfish")){
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100)+(clickContainer.offsetWidth/4*3));
                }
                else {
                    leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100)+(clickContainer.offsetWidth/2));
                }
                setInterval(function(){
                    if (item.classList.contains("fish")) {
                       leftPos-=45;
                    }
                    else if (item.classList.contains("rare-fish")){
                       leftPos-=65;
                    }
                    else if (item.classList.contains("jellyfish")){
                        leftPos-=5;
                    }
                    else if (item.classList.contains("shark")){
                        leftPos-=15;
                        if (topPos>mousePosition.y) {
                            topPos-=10;
                        }
                        else {
                            topPos+=10;
                        }
                    }
                    item.style.left = leftPos+"px";
                    item.style.top = topPos+"px";
                }, 100);
                item.classList.add("right");
            }
            item.style.left = leftPos+"px"
            item.style.top = topPos+"px";
        }
        //if it is trash
        else {
            item.style.left = leftPos+"px";
            item.style.top = topPos+"px";
        }
    }
    function hit(event) {
        if (!fishingLine.classList.contains("zapped")) {
            let type = event.target.classList;
            let hitText = document.createElement('span');
            hitText.setAttribute('class','hit-text');
            this.parentNode.insertBefore(hitText,this);
            hitText.style.left = this.style.left;
            hitText.style.top = this.style.top;
            if (!this.classList.contains("caught")){
                this.classList.add("caught");
                if (type.contains("fish")) {
                    hitText.innerText = "+1";
                    hitText.style.color = "#00ffcd";
                    blop.play();
                    score++;
                    currentScore++;
                    fishTracker[0]++;
                }
                else if (type.contains("rare-fish")) {
                    hitText.innerText = "+5";
                    hitText.style.color = "#9766d3";
                    rareBlop.play();
                    score+=5;
                    currentScore+=5;
                    fishTracker[1]++;
                }
                else if (type.contains("trash")){
                    hitText.innerText = "-3";
                    hitText.style.color = "#ff5252";
                    trashSound.play();
                    score-=3;
                    currentScore-3;
                    fishTracker[2]++;
                }
                else if (type.contains("jellyfish")){
                    fishingLine.classList.add("zapped");
                    clickContainer.classList.add("zapped");
                    hitText.innerText = "zap!";
                    bzzt.play();
                    hitText.style.color = "#ffff33";
                    fishTracker[2]++;
                    setTimeout(function() {
                        fishingLine.classList.remove("zapped");
                        clickContainer.classList.remove("zapped");
                    }, 2000);
                }
                else if (type.contains("shark")){
                    bite.play();
                    endDay(true);
                    sec = 0;
                }
                setTimeout(function() {
                    clickContainer.removeChild(hitText);
                }, 1000);
                gameScore.innerText = `Total Score: ${score}`;
                gameGoal.innerText = `Score: ${score}`;
            }
        }
    }
    function endDay(died) {
        bgm.stop();
        clearInterval(gameTimerInterval);
        clearInterval(createFishInterval);
        clearInterval(createRareFishInterval);
        clearInterval(createTrashInterval);
        clearInterval(createJellyfishInterval);
        clearInterval(createSharkInterval);
        let remainingItems = document.querySelectorAll(".item");
        for (var i=0;i<remainingItems.length;i++){
            clickContainer.removeChild(remainingItems[i]);
        }
        gameStats.style.display = "none";
        clickContainer.style.display = "none";
        gameGoal.style.display = "none";
        startBtn.style.display = "none";

        // 戻るボタンの作成
        const backButton = document.createElement("button");
        backButton.textContent = "選択画面に戻る";
        backButton.style.cssText = `
            position: absolute;
            top: 66%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        backButton.onclick = function() {
            // 好感度を保持したまま遷移
            const currentAffection = localStorage.getItem("好感度");
            if (currentAffection) {
                localStorage.setItem("好感度", currentAffection);
            }
            window.location.href = "../selection/selection.html";
        };
        document.body.appendChild(backButton);

        let currentAffection = parseInt(localStorage.getItem("好感度")) || 50;
        let affectionChange = 0;

        if (!died) {
            if (score >= 60) {
                affectionChange = 6;
                instructions.innerHTML = `<h2>ゲーム終了！</h2><p>素晴らしい！スコア${score}点！</p><p>好感度が+6上がりました！</p>`;
            } else if (score >= 50) {
                affectionChange = 5;
                instructions.innerHTML = `<h2>ゲーム終了！</h2><p>よくできました！スコア${score}点！</p><p>好感度が+5上がりました！</p>`;
            } else if (score >= 40) {
                affectionChange = 3;
                instructions.innerHTML = `<h2>ゲーム終了！</h2><p>頑張りました！スコア${score}点！</p><p>好感度が+3上がりました！</p>`;
            } else if (score >= 30) {
                affectionChange = 1;
                instructions.innerHTML = `<h2>ゲーム終了！</h2><p>スコア${score}点！</p><p>好感度が+1上がりました！</p>`;
            } else {
                affectionChange = -9;
                instructions.innerHTML = `<h2>ゲーム終了！</h2><p>残念...スコア${score}点でした。</p><p>好感度が-9下がりました...</p>`;
            }
        } else {
            instructions.innerHTML = `<h2>ゲームオーバー！</h2><p>サメに襲われてしまいました...</p><p>好感度が-9下がりました...</p>`;
            affectionChange = -9;
        }

        currentAffection += affectionChange;
        localStorage.setItem("好感度", currentAffection);

        const affectionDisplay = document.getElementById("affection-display");
        if (affectionDisplay) {
            affectionDisplay.textContent = `現在の好感度: ${currentAffection}`;
        }

        infoWrapper.style.display = "block";
        startTitle.style.display = "block";
        // 好感度の説明を非表示にする
        const affectionInfo = document.getElementById("affection-info");
        if (affectionInfo) {
            affectionInfo.style.display = "none";
        }
    }
    //Make bubbles
    var bubbles = document.getElementById('bubbles');
    var randomN = function(start, end){
        return Math.random()*end+start;
    };
    var bubbleNumber = 0,
    generateBubble = function(){
        if(bubbleNumber < 20){
            var bubble = document.createElement('div');
            var size = randomN(5, 10);
            bubble.setAttribute('style','width: '+size+'px; height: '+size+'px; left:'+randomN(1, bubbles.offsetWidth-(size+4) )+'px;');
            bubbles.appendChild(bubble);
            bubbleNumber++;
        }
        else {
          clearInterval(bubbleInterval);
        }
    };
    generateBubble();
    var bubbleInterval = setInterval(generateBubble, 500);

    instructions.innerHTML = `<p>ゲーム説明<br>カーソルで魚に触れると釣れるよ</p><p>Happy fishing!</p>`;
};