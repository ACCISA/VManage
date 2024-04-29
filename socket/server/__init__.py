from flask import Flask
from flask_cors import CORS

from .routes import main
from .events import socketio


def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = True
    app.config["SECRET_KEY"] = "secret"
    CORS(app, resources={r"/*":{"origins":"*"}})
    app.register_blueprint(main)

    socketio.init_app(app)

    return app
