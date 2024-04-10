from flask import Flask, render_template
from flas_socketio import SocketIO, send

app = Flask(__name__)

@socketio.on("message")
def sendMessage(message):
    send(message, broadcast=True)


@app.route("/")
def message():
    return "ok"