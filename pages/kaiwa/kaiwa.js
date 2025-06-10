// 会話データをオブジェクトの配列で用意
    const script = [
      { speaker: "", message: "（ゲームセンター前。主人公が少し緊張しながら歩いてくる）", type: "narration" },
      { speaker: "氷堂 蓮", message: "……来たんだ。" },
      { speaker: "主人公", message: "うん……。誘ってくれてありがとう。" },
      { speaker: "氷堂 蓮", message: "別に。ヒマだったし。" },
      { speaker: "氷堂 蓮", message: "……そういえば、俺さ。ゲームが上手い子、ちょっと憧れるんだよね。" },
      { speaker: "主人公", message: "（やっぱり……そうなんだ。蓮くんは、同じレベルで楽しめるような子が好きなんだ）", type: "thought" },
      { speaker: "主人公", message: "あの……私、あんまり得意じゃないけど、今日は頑張ってみたいなって……思ってて。" },
      { speaker: "氷堂 蓮", message: "……へぇ。" },
      { speaker: "氷堂 蓮", message: "……そういうの、悪くないと思うよ。中途半端な気持ちじゃ続かないし。" },
      { speaker: "主人公", message: "……うん。私、もっと蓮くんのこと知りたいから。" },
      { speaker: "氷堂 蓮", message: "……ふふ。じゃあ、まずは俺のお気に入りのやつから教えてやる。" },
      { speaker: "", message: "（彼の背中を見つめながら、主人公は少しだけ拳を握る）", type: "narration" },
      { speaker: "主人公", message: "（今日、少しでも蓮くんに近づけたらいいな……）", type: "thought" }
        ];

    let currentIndex = 0;

    const speakerElem = document.getElementById('speaker');
    const messageElem = document.getElementById('message');
    const nextButton = document.getElementById('next-button');

    // 画面を初期化して最初のセリフを表示
    function showLine(index) {
      if (index < script.length) {
        speakerElem.textContent = script[index].speaker;
        messageElem.textContent = script[index].message;
      } else {
        // 会話が終わったらボタンを非表示にしておまけメッセージを表示
        speakerElem.textContent = '';
        messageElem.textContent = '次へを押して、ゲームをスタートしよう！彼からの好感度をあげよう！';
        nextButton.style.display = 'none';
      }
    }

    nextButton.addEventListener('click', () => {
      currentIndex++;
      showLine(currentIndex);
    });

    // ページ読み込み時に最初の行を表示
    window.addEventListener('load', () => {
      showLine(currentIndex);
    });