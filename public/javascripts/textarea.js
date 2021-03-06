let keymap = { 17: false, 83: false };

function tabstring(event, object) {
    var keyCode = event.keyCode;
    // カーソル位置
    var cursorPosition = object.selectionStart;
    // カーソルの左右の文字列値
    var leftString = object.value.substr(0, cursorPosition);
    var rightString = object.value.substr(cursorPosition, object.value.length);

    // タブキーの場合
    if (keyCode === 9) {
        event.preventDefault();  // 元の挙動を止める
        // textareaの値をカーソル左の文字列 + タブスペース + カーソル右の文字列にする
        object.value = leftString + "\t" + rightString;
        // カーソル位置をタブスペースの後ろにする
        object.selectionEnd = cursorPosition + 1;
    }

}


// テキストエリアのキー入力時の関数を設定
document.getElementById("body").onkeydown = function (event) { tabstring(event, this); }
// document.getElementById("body").onkeyup = function(){readhtml();}
document.getElementById("body").addEventListener('keydown', async e => {
    if (e.ctrlKey && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        let data = { body: document.getElementById("body").value }
        fetch('/posts/presave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            document.getElementById("markdown-article").innerHTML = data.html;
        })

    }
});