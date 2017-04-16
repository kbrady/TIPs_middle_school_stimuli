function on_load_methods() {
	var paragraphs = document.getElementsByTagName('p');
	for (var i=0; i < paragraphs.length; i++) {
		if (paragraphs[i].getElementsByTagName('small').length > 0) {
			paragraphs[i].className += " centered";
			continue;
		}
		if (paragraphs[i].getElementsByTagName('img').length > 0) {
			paragraphs[i].className += " centered";
			continue;
		}
		if (paragraphs[i].textContent.startsWith("Did you know:")) {
			paragraphs[i].className += " boxed";
			continue;
		}
	}
	var GET_parts = window.location.search.substr(1).split("=");
	var s_id = "";
	for (var i = 0; i < GET_parts.length-1; i++) {
		if (GET_parts[i] == "s_id") {
			s_id = GET_parts[i+1];
			add_s_id(s_id);
		}
	}
}

function update_s_id() {
	var s_id = document.getElementById("s_id_setter").value
	add_s_id(s_id);
}

function add_s_id(s_id) {
	var frames = document.getElementsByTagName('iframe');
	if (frames.length == 2) {
		frames[1].src += "?s_id="+s_id.toString();
	}
	var links = document.getElementsByTagName('a');
	for (var i=0; i < links.length; i++) {
		if (links[i].href.indexOf("?") > -1) {
			links[i].href = links[i].href.substr(0, links[i].href.indexOf("?")) + "?s_id="+s_id.toString();
		} else {
			links[i].href += "?s_id="+s_id.toString();
		}
	}
}

function hide_last_link() {
	var frames = document.getElementsByTagName('iframe');
	if (frames.length == 2) {
		var links = frames[1].contentDocument.getElementsByTagName('a');
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
