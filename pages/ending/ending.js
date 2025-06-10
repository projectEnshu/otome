
// 会話データをオブジェクトの配列で用意
const script = [
    { speaker: 'ユウタ', message: 'おっ、来てくれたんだね。正直嬉しいよ。' },
    { speaker: '主人公', message: 'うん、誘ってくれてありがとう！ゲームあんまり得意じゃないけど…' },
    { speaker: 'ユウタ', message: 'そうだよね。でも実は、俺さ、ゲーム上手な女の子が結構好きなんだ。' },
    { speaker: '主人公', message: 'え、そうなんだ？なんで？' },
    { speaker: 'ユウタ', message: 'だって、一緒にゲーム楽しめるし、切磋琢磨できる相手ってカッコいいと思うから。俺、そういう子に惹かれちゃうんだよね。' },
    { speaker: '主人公', message: 'そっか…じゃあ私も、君に少しでも近づけるように頑張らなきゃ！' },
    { speaker: 'ユウタ', message: 'うん、それでいいんだよ。最初は誰でも下手だけど、一緒にやれば絶対うまくなるって。' },
    { speaker: '主人公', message: 'ありがとう。ちょっと不安だけど、君となら頑張れそう！' },
    { speaker: 'ユウタ', message: 'へへ、そんなに気合い入れてくれるなら、俺も全力で教えるよ！' },
    { speaker: '主人公（心の声）', message: 'ゲームが苦手な私でも、彼の前なら頑張れる。好きな人に認められたいって、こんなに力になるんだ…' },
    { speaker: 'ユウタ', message: 'じゃあ、まずはUFOキャッチャーから始めようか。君が好きそうな景品、狙ってみよう！' },
    { speaker: '主人公', message: 'うん！それにしても…君、真剣な顔してるね。' },
    { speaker: 'ユウタ', message: 'ゲームは勝負だからな。負けたくないんだよ、君の前じゃ特にね。' },
    { speaker: '主人公', message: 'もう…、意外と照れ屋なんだから。' },
    { speaker: 'ユウタ', message: 'バレた？' }
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
    messageElem.textContent = '――これで導入部分の会話は終わりです。続きは実装に合わせて追加してください。';
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

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            // 好感度をリセット
            localStorage.setItem("好感度", 50);
            // top.htmlに遷移
            window.location.href = '/index.html';
        });
    }
});
