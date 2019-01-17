import socketio
from flask import Flask

sio = socketio.Server(async_mode='threading')
app = Flask(__name__)
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)

@sio.on('coordinates', namespace='/client')
def my_custom_event(sid, data):
		print(sid)
		print(data)

if __name__ == '__main__':
	app.run()