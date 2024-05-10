from Teconnect import app, socketio
from Teconnect.models.models import db 

if __name__ == "__main__":
    app_context = app.app_context()  
    app_context.push()  
    db.create_all()  
    socketio.run(app, port=11000, debug=True)
    app_context.pop()  
