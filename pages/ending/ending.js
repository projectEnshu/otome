// 会話データをオブジェクトの配列で用意

const scripts = [
  {
    min: 89,
    lines: [
      { speaker: "氷堂 蓮", message: "……なあ。今日、一番楽しかったのってさ、何だと思う？", type: "narration" },
      { speaker: "主人公", message: "え？　えっと……クレーンゲームでぬいぐるみ取れたとき？" },
      { speaker: "氷堂 蓮", message: "ちがうよ。……君と一緒に過ごした、この時間そのもの。" },
      { speaker: "", message: "（……！" },
      { speaker: "氷堂 蓮", message: "ゲームは昔から好きだけど、\nこんなふうに“誰かと一緒に楽しむ”ことが、こんなに嬉しいって、知らなかった。" },
      { speaker: "", message: "（彼の声は、いつもより少しだけ震えていた）" },
      { speaker: "氷堂 蓮", message: "俺……君のこと、本気で好きになった。" },
      { speaker: "氷堂 蓮", message: "よかったら、俺と付き合ってほしい。" },
      { speaker: "主人公", message: "……はい。わたしも、ユウタくんのことがずっと気になってた！" },
      { speaker: "", message: "――数日後――" },
      { speaker: "", message: "（休日のゲームセンター。並んで並んでゲーム機に座るふたり）" },
      { speaker: "氷堂 蓮", message: "じゃ、次は“カップル協力モード”な。……パートナー、頼むよ？" },
      { speaker: "主人公", message: "任せて。今日は絶対、ふたりでクリアしようね！" }

    ]
  },
  {
    min: 69,
    lines: [
      { speaker: "氷堂 蓮", message: "さっきのプレイ、マジで完璧だったな。あのコンボ、狙ってたの？", type: "narration" },
      { speaker: "主人公", message: "ううん、たぶん偶然。でもユウタくんがうまく合わせてくれたから！" },
      { speaker: "氷堂 蓮", message: "……あんなに息が合うとは思わなかった。ちょっと感動してる。" },
      { speaker: "主人公", message: "私、ユウタくんと一緒にゲームするの、すごく楽しい！" },
      { speaker: "氷堂 蓮", message: "君となら、どんなゲームも攻略できそうな気がする。\n……いや、ゲームだけじゃないかもな。" },
      { speaker: "", message: "（彼の言葉に、胸がぎゅっとなる）" },
      { speaker: "氷堂 蓮", message: "また一緒に遊ぼう。……できれば、これからもずっと。" }
    ]
  },

    {
    min: 49,
    lines: [
        { speaker: "氷堂 蓮", message: "なんだかんだ、君とゲームするのって楽しいよな。", type: "narration" },
        { speaker: "主人公", message: "ほんとに？　うれしい……私もすごく楽しかった！" },
        { speaker: "氷堂 蓮", message: "……普段、こんなに長く誰かと一緒にいること、滅多にないんだよな。" },
        { speaker: "主人公", message: "え？" },
        { speaker: "氷堂 蓮", message: "だから、ちょっと不思議な気分。……でも、悪くない。" },
        { speaker: "主人公", message: "（あれ……今の、ちょっと特別なこと言ってくれた気がする）" },
        { speaker: "氷堂 蓮", message: "今度は、もっと長く一緒にいよう。……君さえよければ、だけど。" },
        { speaker: "主人公", message: "もちろん。わたし、ユウタくんともっと一緒にいたいから。" }
    ]
  },
  {
    min: 29,
    lines: [
        { speaker: "氷堂 蓮", message: "へえ、思ってたより君、センスあるんじゃん。", type: "narration" },
        { speaker: "主人公", message: "ほんと？　なんかちょっと嬉しい……" },
        { speaker: "氷堂 蓮", message: "最初はどうなるかと思ったけど、まぁ、楽しかったよ。\n君といると、なんか気楽でいられるし。" },
        { speaker: "主人公", message: "それって……いいこと、なのかな？" },
        { speaker: "氷堂 蓮", message: "もちろん。……またゲーセン、行こうよ。気が向いたら連絡して。" },
        { speaker: "", message: "（優しい言葉。でも、それは“友達”に向けられるそれだった）" },
        { speaker: "主人公", message: "（この距離感が、今の私たちの精一杯なんだろうな……）" }
    ]
  },
  {
    min: 0,
    lines: [
      { speaker: "氷堂 蓮", message: "……そろそろ帰るわ。", type: "narration" },
      { speaker: "主人公", message: "う、うん。今日はありがとう……" },
      { speaker: "氷堂 蓮", message: "……ああ。" },
      { speaker: "", message: "（彼はスマホをいじりながら、目も合わせずに立ち去っていく）" },
      { speaker: "主人公", message: "（なんでだろう……話してても、ずっと距離を感じてた。\n笑いも噛み合わなかったし、ゲームもうまくいかなかったし……）" },
      { speaker: "主人公", message: "（……次は、もうないかもね）" }
    ]
  },
];

const currentAffection = parseInt(localStorage.getItem("好感度")) || 50;

// スクリプト配列を降順ソート（min が大きい順）
scripts.sort((a, b) => b.min - a.min);

// currentAffection >= min を満たす最初のものを選ぶ
const matched = scripts.find(s => currentAffection >= s.min);

// 存在しなければ一番下（min:0）のスクリプトをデフォルトに
const script = matched
  ? matched.lines
  : scripts[scripts.length - 1].lines;



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
    messageElem.textContent = '';
    nextButton.style.display = 'none';
    }
}

nextButton.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < script.length) {
    showLine(currentIndex);
  } else {
    // 好感度をリセット
    localStorage.setItem("好感度", 50);
    localStorage.setItem("disabledButtons", JSON.stringify([]));
    // 会話がすべて終わったらホームにリダイレクト
    window.location.href = '../../index.html';  // ← ここをあなたのホームページURLに書き換えてください
  }
});

// ページ読み込み時に最初の行を表示
window.addEventListener('load', () => {
    showLine(currentIndex);
});
