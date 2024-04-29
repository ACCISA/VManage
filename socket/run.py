from server import create_app, socketio
import logging


logging.debug("starting dev flask app")
print("sss")

app = create_app()
if __name__ == "__main__":
    socketio.run(app)