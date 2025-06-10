// 会話データをオブジェクトの配列で用意
    const script = [
      { speaker: '氷堂 蓮', message: 'おっ、来てくれたんだね。正直嬉しいよ。' },
      { speaker: '主人公', message: 'うん、誘ってくれてありがとう！ゲームあんまり得意じゃないけど…' },
      { speaker: '主人公', message: 'え、そうなんだ？なんで？' },
      { speaker: '氷堂 蓮', message: 'だって、一緒にゲーム楽しめるし、切磋琢磨できる相手ってカッコいいと思うから。俺、そういう子に惹かれちゃうんだよね。' },
      { speaker: '主人公', message: 'そっか…じゃあ私も、君に少しでも近づけるように頑張らなきゃ！' },
      { speaker: '氷堂 蓮', message: 'うん、それでいいんだよ。最初は誰でも下手だけど、一緒にやれば絶対うまくなるって。' },
      { speaker: '主人公', message: 'ありがとう。ちょっと不安だけど、君となら頑張れそう！' },
      { speaker: '氷堂 蓮', message: 'へへ、そんなに気合い入れてくれるなら、俺も全力で教えるよ！' },
      { speaker: '主人公（心の声）', message: 'ゲームが苦手な私でも、彼の前なら頑張れる。好きな人に認められたいって、こんなに力になるんだ…' },
      { speaker: '氷堂 蓮', message: 'じゃあ、まずはUFOキャッチャーから始めようか。君が好きそうな景品、狙ってみよう！' },
      { speaker: '主人公', message: 'うん！それにしても…君、真剣な顔してるね。' },
      { speaker: '氷堂 蓮', message: 'ゲームは勝負だからな。負けたくないんだよ、君の前じゃ特にね。' },
      { speaker: '主人公', message: 'もう…、意外と照れ屋なんだから。' },
      { speaker: '氷堂 蓮', message: 'バレた？' }
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