function callbackQuery(estringa) {
  var callback_chatid = estringa.callback_query.message.chat.id.toFixed();
  var callback_messageid = estringa.callback_query.message.message_id.toFixed();
  var payload;
    var mission_keyboard = [
      [{"text":"1.Connect Wallet","url": `https://f37e-36-225-8-104.jp.ngrok.io/home?tgUserId=${callback_chatid}`}],
      [{"text":"2.Reply massage","url":"https://1025-1-34-206-105.ngrok.io/api/tasks/1/users"}],
      [{"text":"3.Join Bored wizard broom club","url": "https://t.me/+w8UAT_qhNPw2NGU9"}],
      [{"text":"Mission Status","url": `https://f37e-36-225-8-104.jp.ngrok.io/mission?tgUserId=${callback_chatid}`}],
      [{"text":"<< Back","callback_data": "/back"}]
    ]
    var main_keyboard = [
      [{"text":"🚩 My page","url": `https://f37e-36-225-8-104.jp.ngrok.io/home?tgUserId=${callback_chatid}`}],
      [{"text":"📜 Missions","callback_data": "/to_sub_kb"}],
      [{"text":"🧹 Bored wizard broom club ","url": "https://t.me/+w8UAT_qhNPw2NGU9"}],
      [{"text":"🛒 Buy NFT","url": "https://t.me/+w8UAT_qhNPw2NGU9"}]
    ]
  var missionKeyboardMarkup = {
    'inline_keyboard': mission_keyboard,
  }
  var mainKeyboardMarkup = {
    'inline_keyboard': main_keyboard,
  }
  if (estringa.callback_query) {

    payload = {
      "method": "sendMessage",
      'chat_id': callback_chatid,
      'text': '測試callback',
    };
    if (estringa.callback_query.data.indexOf("/to_sub_kb") === 0) {
      payload = {
        "method": "editMessageText",
        "chat_id": callback_chatid,
        "message_id": callback_messageid,
        "text": "",
        "parse_mode": "markdown",
        "disable_web_page_preview": false,
        'reply_markup': JSON.stringify(missionKeyboardMarkup)
      };
      payload.text = "Missions";
    }
    if (estringa.callback_query.data.indexOf("/back") === 0) {
      payload = {
        "method": "editMessageText",
        "chat_id": callback_chatid,
        "message_id": callback_messageid,
        "text": "",
        "parse_mode": "markdown",
        "disable_web_page_preview": false,
        'reply_markup': JSON.stringify(mainKeyboardMarkup)
      };
      payload.text = "Dobby bot 清單";
    }
    return payload;
  }
}
