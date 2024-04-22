from Teconnect import app, socketio

if __name__ == "__main__":
    socketio.run(app, port=11000, debug=True)