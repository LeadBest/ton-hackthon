function sendtext(estringa, name, row) {
  var chatid = estringa.message.chat.id.toFixed();
  var payload;

  if (estringa.message.text) {
    if (estringa.message.text === "/start") {
      keyboards(chatid)
    }
    if (estringa.message.text === "/help") {
      payload = {
        "method": "sendMessage",
        'chat_id': chatid,
        'text':" /start start mission\n" 
      }
      return payload;
    }
  }
}
