function read_out() {
	var supportMsg = document.getElementById('speach-msg');
	if ('speechSynthesis' in window) {
	} else {
		supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="http://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
		supportMsg.className = "alert alert-danger";
	}

	if (window.speechSynthesis.paused) {
		window.speechSynthesis.resume();
		console.log("resuming");
		return;
	}
	if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
		console.log("Already talking");
		return;
	}
	var paragraphs = document.getElementById("content").children;
	for (var i=0, max=paragraphs.length; i < max; i++) {
  		say(paragraphs[i]);
	}
}

function say(my_element) {
	var sentences = my_element.textContent.match( /[^\.!\?]+[\.!\?]*/g );
	var text_snippets = [];
	var current_string = "";
	for (var i=0; i<sentences.length; i++) {
		current_string += sentences[i];
		if (i+1 == sentences.length || (current_string+sentences[i+1]).length > 250 ) {
			text_snippets.push(current_string);
			current_string = "";
		}
	}
	for (var i=0; i<text_snippets.length; i++) {
		var msg = new SpeechSynthesisUtterance();
		msg.text = text_snippets[i];
		msg.lang = "en-us";
		if (i == 0) {
			msg.onstart = function (event) {
				my_element.className += " highlighted";
			};
		}
		if (i+1 == text_snippets.length) {
			msg.onend = function (event) {
				my_element.className = my_element.className.substring(0, my_element.className.length - " highlighted".length);
			};
		}
		window.speechSynthesis.speak(msg);
	}
}
