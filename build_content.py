# A script to turn everything into static html
import os
# in order to write stuff with just markdown
import markdown

def delete_html_files():
	# this is a cleaning function
	for filename in os.listdir('.'):
		if filename.endswith('.html'):
			os.remove(filename)

def build_webpage(filename, include_voice=False):
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
	html_filename = '.'.join(filename.split('.')[:-1])+'.html'
	with open(html_filename, 'w') as output_file:
		# add the header
		html += filter_and_concat('templates'+os.sep+'header.html')
		# add voice if include_voice is selected
		if include_voice:
			html += filter_and_concat('templates'+os.sep+'voice.html')
		# add the body
		content_text = filter_and_concat('content'+os.sep+filename)
		# make sure the content div only wraps the content (this is important for readout)
		html += '<div id="content" class="container-fluid">'
		if filename.endswith('.md'):
			html += markdown.markdown(content_text)
		else:
			html += content_text
		html += '</div>'
		# add the footer
		html += filter_and_concat('templates'+os.sep+'footer.html')
		output_file.write(html)

delete_html_files()
build_webpage('womens_suffrage.md', include_voice=True)
build_webpage('womens_test.html')