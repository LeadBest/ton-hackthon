function keyboards(id) {
    var keyboard = [[{'text':'1'},{'text':'2'}],[{'text':'3'},{'text':'4'}]]
    var main_keyboard = [
      [{"text":"🚩 My page","url": `https://f37e-36-225-8-104.jp.ngrok.io/home?tgUserId=${id}`}],
      [{"text":"📜 Missions","callback_data": "/to_sub_kb"}],
      [{"text":"🧹 Bored wizard broom club ","url": "https://t.me/+w8UAT_qhNPw2NGU9"}],
      [{"text":"🛒 Buy NFT","url": "https://t.me/+w8UAT_qhNPw2NGU9"}]
    ]
    
    var InlineKeyboardMarkup = {
        'inline_keyboard': main_keyboard,
    }

    var payload = {
        "method": "sendMessage",
        'chat_id': id,
        'text': 'Dobby bot 清單',
        'reply_markup': JSON.stringify(InlineKeyboardMarkup)
    }
    start(payload);
}
