# A script to turn everything into static html
import os
# in order to write stuff with just markdown
import markdown

def delete_html_files():
	# this is a cleaning function
	for filename in os.listdir('.'):
		if filename.endswith('.html'):
			os.remove(filename)

def to_html_name(filename):
	return '.'.join(filename.split('.')[:-1])+'.html'

def build_set(content_list):
	prev = ""
	for i in range(len(content_list)):
		content = content_list[i]
		next = "" if i+1 == len(content_list) else to_html_name(content_list[i+1])
		if content.endswith('.md'):
			build_webpage(content, include_voice=True, next_page=next, prev_page=prev)
		else:
			build_webpage(content, include_voice=False, next_page=next, prev_page=prev)
		prev = to_html_name(content)

def build_webpage(filename, include_voice=False, next_page="", prev_page=""):
	def filter_and_concat(reader_file):
		def filter(line):
			for c in line:
				# cannot currently handle non-ascii characters
				if ord(c) >= 128:
					print line
					raise Exception('Non ascii character found in line: '+str(ord(c)))
			return line
		with open(reader_file, 'r') as reader:
			output = ''.join([filter(line) for line in reader])
		return output

	html = ''
	html_filename = to_html_name(filename)
	with open(html_filename, 'w') as output_file:
		# add the header
		html += filter_and_concat('templates'+os.sep+'header.html')
		# add voice if include_voice is selected
		if include_voice:
			html += filter_and_concat('templates'+os.sep+'voice.html')
		if prev_page != "":
			html += '<a href="'+prev_page+'">Prev</a>\n'
		# add the body
		content_text = filter_and_concat('content'+os.sep+filename)
		# make sure the content div only wraps the content (this is important for readout)
		html += '<div id="content" class="container-fluid">\n'
		if filename.endswith('.md'):
			html += markdown.markdown(content_text)
		else:
			html += content_text
		html += '</div>\n'
		if next_page != "":
			html += '<a href="'+next_page+'">Next</a>\n'
		# add the footer
		html += filter_and_concat('templates'+os.sep+'footer.html')
		output_file.write(html)

delete_html_files()
build_set(['womens_suffrage_1.md', 'womens_suffrage_2.md', 'womens_test.html'])
build_set(['climate_change_1.md', 'climate_change_today.md', 'climate_concepts_quiz.html', 'climate_change_pre.html'])