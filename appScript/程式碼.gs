var token = ""

function doPost(e) {
  var estringa = JSON.parse(e.postData.contents);

  if (estringa.message) {
    var payload = sendtext(estringa);
  }
  if (estringa.callback_query) {
    var payload = callbackQuery(estringa);
  }

  start(payload);
}

function start(payload) {
  var data = {
    "method": "post",
    "payload": payload
  }
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
  Logger.log(response.getContentText());
}

function identificar(e) {

  if (e.callback_query) { var message = callbackQuery(e); }
  if (e.message) { var message = sendtext(e); }
  return message;
}
