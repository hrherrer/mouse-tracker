import socketio
from flask import Flask
import logging


sio = socketio.Server(async_mode='threading')
app = Flask(__name__)
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

@sio.on('coordinates', namespace='/client')
def coordinates(sid, data):
		sio.emit('coordinates', data, namespace='/web')

	
@sio.on('new_click', namespace='/client')
def new_click(sid):
		sio.emit('new_click', namespace='/web')

if __name__ == '__main__':
	app.run(host='0.0.0.0')