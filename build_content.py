# A script to turn everything into static html
import os
# in order to write stuff with just markdown
import markdown

def delete_html_files():
	# this is a cleaning function
	for filename in os.listdir('.'):
		if filename.endswith('.html'):
			os.remove(filename)

# helper functions for building webpages
def to_html_name(filename, version):
	if type(filename) == list:
		filename = filename[0]
	return '.'.join(filename.split('.')[:-1])+'_'+version+'.html'

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

class FrameContent:
	def __init__(self, src, width=640, height=650):
		self.src = src
		self.width = str(width)
		self.height = str(height)

def build_iframes(frame_list):
	def fill_frame(raw, frame, first):
		number = '1' if first else '2'
		raw = raw.replace('SRC_'+number, frame.src)
		raw = raw.replace('WIDTH_'+number, frame.width)
		raw = raw.replace('HEIGHT_'+number, frame.height)
		return raw
	# build a split screen if two frames are provided
	if len(frame_list) == 1:
		html = filter_and_concat('templates'+os.sep+'single_iframe.html')
	else:
		html = filter_and_concat('templates'+os.sep+'split_screen.html')
	for i in range(min(len(frame_list), 2)):
		frame = frame_list[i]
		html = fill_frame(html, frame, i==0)
	return html

def build_content(filename):
	html = ''
	html += '<div id="content" class="container-fluid">\n'
	# add the body
	content_text = filter_and_concat('content'+os.sep+filename)
	if filename.endswith('.md'):
		html += markdown.markdown(content_text)
	else:
		html += content_text
	html += '</div>\n'
	return html

def build_webpage(filename, version, include_voice=False, next_page="", prev_page="", alt_next=None, alt_prev=None, frames=None):
	html = ''
	html_filename = to_html_name(filename, version)
	with open(html_filename, 'w') as output_file:
		# add the header
		html += filter_and_concat('templates'+os.sep+'header.html')
		# add voice if include_voice is selected
		if include_voice:
			html += filter_and_concat('templates'+os.sep+'voice.html')
		if prev_page != "":
			alt_prev = prev_page if alt_prev is None else alt_prev
			html += '<a alt="'+alt_prev+'" href="'+prev_page+'">Prev</a>\n'
		# make sure the content div only wraps the content (this is important for readout)
		html += '<div class="container-fluid">\n'
		if frames is None:
			html += build_content(filename)
		else:
			html += build_iframes(frames)
		html += '</div>\n'
		if next_page != "":
			alt_next = next_page if alt_next is None else alt_next
			html += '<a alt="'+alt_next+'" href="'+next_page+'">Next</a>\n'
		# add the footer
		html += filter_and_concat('templates'+os.sep+'footer.html')
		output_file.write(html)

def build_set(content_list, version):
	prev = ""
	alt_prev = None
	for i in range(len(content_list)):
		content = content_list[i]
		next = "" if i+1 == len(content_list) else to_html_name(content_list[i+1], version)
		if next.find('test') == -1:
			alt_next = None
		else:
			alt_next = "" if i+2 >= len(content_list) else to_html_name(content_list[i+2], version)
		if type(content) == str:
			build_webpage(content, version, include_voice=True, next_page=next, prev_page=prev, alt_next=alt_next, alt_prev=alt_prev)
		else:
			build_webpage(content[0], version, include_voice=False, next_page=next, prev_page=prev, alt_next=alt_next, alt_prev=alt_prev, frames=content[1])
		prev = to_html_name(content, version)
		if prev.find('test') == -1:
			alt_prev = None
		else:
			alt_prev = "" if i-1 < 0 else to_html_name(content_list[i-1], version)

#delete_html_files()
pre_test_frame = FrameContent("https://docs.google.com/forms/d/e/1FAIpQLSdHGh1VHoIoAQbN85aAIwA6htcAE-aR4aHH5hKKgXaQuyXPqg/viewform?embedded=true")
post_test_frame = FrameContent("https://docs.google.com/forms/d/e/1FAIpQLSf2VYGp9fczxeVcq7PAG39TbxgFyprx7D-lwxWMWS0TEE6k3w/viewform?embedded=true")
womens_pre_test = ['womens_pre_test.html', [pre_test_frame]]
womens_post_test_A = ['womens_post_test.html', [post_test_frame, FrameContent('womens_suffrage_2_A.html')]]
womens_post_test_B = ['womens_post_test.html', [post_test_frame, FrameContent('womens_suffrage_1_B.html')]]
build_set(['womens_suffrage_0.md', 'paper.md', 'womens_suffrage_2.md', womens_post_test_A], 'A')
build_set(['womens_suffrage_0.md', 'womens_suffrage_1.md', 'paper.md', womens_post_test_B], 'B')
