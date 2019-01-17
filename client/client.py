import subprocess
import socketio
import time

# Socket.io functions
@sio.on('connect')
def on_connect():
    print('I'm connected to the server!')

@sio.on('disconnect')
def on_disconnect():
    print('I'm disconnected from the server!')

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

	a = set(new_click_state.split('\n'))
	b = set(old_click_state.split('\n'))

	diff = ' '.join(b.difference(a))

	result = 'up' in diff

	return result, new_click_state
	


if __name__ == '__main__':
	sio = socketio.Client()

	sio.connect('http://192.168.0.15:5000')

	click_state = get_mouse_state()

	while True:
		time.sleep(0.01)
		coordinates = get_mouse_coordinates()

		clicked, click_state = was_clicked(click_state)

		sio.emit('coordinates', {'data': coordinates})

		if clicked:
			sio.emit('new_click')




