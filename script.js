var targetLang = 'fr';

/*Function that handles click on the second button*/
function translateAndSpeak() {
  var textInput = document.getElementById("textInput");
  var text = textInput.value;
  var url = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyBsj362-xU5nMLzBQiTSJ6aTg8uJ_zYR88";
  var fullRequestUrl = url + "&q=" + text + "&target=" + targetLang;
  ajaxRequest("GET", fullRequestUrl, handleTranslationResponse);
}

/*Function that handles the response from the web service request*/
function handleTranslationResponse() {
  if (successfulRequest(this)) {
    var response = JSON.parse(this.responseText);
    var translatedText = response.data.translations[0].translatedText;
    speak(translatedText, targetLang);
  }
  else {
    console.log("Ready state: " + this.readyState);
    console.log("Status: " + this.status);
    console.log("Status text: " + this.statusText);
  }
}

/*Function that handles click on the first button*/
function speakOriginal() {
  var textInput = document.getElementById("textInput");
  var text = textInput.value;
  speak(text, 'en-US');
}

/*Function that makes the browser speak a text in a given language*/
function speak(text, lang) {
  /*Check that your browser supports test to speech*/
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log("Your browser supports " + voices.length + " voices");
      console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang == lang; })[1];
    }
    msg.voiceURI = 'native';
    msg.volume = 0.8; // 0 to 1
    msg.rate = 0.6; // 0.1 to 10
    msg.pitch = 0.6; //0 to 2
    msg.text = text;
    msg.lang = lang;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' milliseconds.');
    };
    speechSynthesis.speak(msg);
  }
}

/*Helper function: sends an XMLHTTP request*/
function ajaxRequest(method, url, handlerFunction, content) {
  var xhttp = new XMLHttpRequest();
  xhttp.open(method, url);
  xhttp.onreadystatechange = handlerFunction;
  if (method == "POST") {
    xhttp.send(content);
  }
  else {
    xhttp.send();
  }
}

/*Helper function: checks if the response to the request is ready to process*/
function successfulRequest(request) {
  return request.readyState === 4 && request.status == 200;
}
