var rate = 1;

function hide_last_link() {
	var frames = document.getElementsByTagName('iframe');
	if (frames.length == 2) {
		links = frames[1].contentDocument.getElementsByTagName('a');
		for (var i=0; i < links.length; i++) {
			var alt = links[i].getAttribute('alt');
			if (alt == "") {
				links[i].className += " hidden";
			} else {
				links[i].href = alt;
			}
		}
	}
}

function read_out() {
	var supportMsg = document.getElementById('speach-msg');
	if ('speechSynthesis' in window) {
	} else {
		supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="http://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
		supportMsg.className = "alert alert-danger";
	}

	if (window.speechSynthesis.paused || window.speechSynthesis.speaking || window.speechSynthesis.pending) {
		window.speechSynthesis.resume();
		console.log("resuming");
		return;
	}
	window.speechSynthesis.cancel();
	var paragraphs = document.getElementById("content").children;
	for (var i=0, max=paragraphs.length; i < max; i++) {
		if (paragraphs[i].textContent.length > 0) {
  		say(paragraphs[i]);
		}
	}
}

function change_rate(move_up) {
	var rate_values = [0.1, 0.2, 0.4, 0.8, 1, 2, 4, 8, 10];
	if (move_up && rate < 10) {
		var current_position = rate_values.indexOf(rate);
		rate = rate_values[current_position + 1];
	}
	if (!move_up && rate > 0.1) {
		var current_position = rate_values.indexOf(rate);
		rate = rate_values[current_position - 1];
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
				msg.rate = rate;
			};
		} else {
			msg.onstart = function (event) {
				msg.rate = rate;
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
