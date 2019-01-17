import subprocess
import socketio
import time
import sys

# Socket.io helpers
sio = socketio.Client()

sio.connect('http://192.168.0.15:5000', namespaces=['/client'])

# Socket.io functions
@sio.on('connect', namespace='/client')
def on_connect():
	print('Im connected to the server!')

@sio.on('disconnect', namespace='/client')
def on_disconnect():
	print('Im disconnected from the server!')

# Implementation functions

def get_mouse_coordinates():
	command = "xdotool getmouselocation".split(' ')
	return subprocess.check_output(command)

def get_mouse_state():
	command = "xinput --query-state 11".split(' ')

	ps = subprocess.Popen(command, stdout=subprocess.PIPE)

	return subprocess.check_output(('grep', 'button\['), stdin=ps.stdout)

def was_clicked(old_click_state):
	new_click_state = get_mouse_state()

	a = set(new_click_state.decode().split('\n'))
	b = set(old_click_state.decode().split('\n'))

	diff = ' '.join(b.difference(a))

	result = 'up' in diff

	return result, new_click_state
	
def get_screen_dimensions():
	width = int(sys.argv[1]) or 0
	height= int(sys.argv[2]) or 0
	inches = float(sys.argv[3]) or 0.0
	return width, height, inches

if __name__ == '__main__':
	click_state = get_mouse_state()

	screenWidth, screenHeight, screenInches = get_screen_dimensions()

	while True:
		time.sleep(0.01)
		coordinates = get_mouse_coordinates()

		clicked, click_state = was_clicked(click_state)

		sio.emit('coordinates', {'data': coordinates, 'screen': {'width': screenWidth, 'height': screenHeight, 'inches': screenInches}}, namespace='/client')

		if clicked:
			sio.emit('new_click', namespace='/client')




