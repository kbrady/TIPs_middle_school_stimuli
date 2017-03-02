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
	var msg = new SpeechSynthesisUtterance(my_element.textContent);
	msg.lang = "en-us";
	msg.onstart = function (event) {
		my_element.className += " highlighted";
	};
	var end_fun = function (event) {
		my_element.className = my_element.className.substring(0, my_element.className.length - " highlighted".length);
	};
	msg.onend = end_fun;
	msg.onerror = end_fun;
	window.speechSynthesis.speak(msg);
}
