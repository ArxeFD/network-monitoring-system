from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

from Teconnect.routes import routes 


#Aunque routes está en la misma carpeta, se tiene que importar desde la relación
#que tiene con otras carpetas para python, o sea no importa que routes esté
#dentro de Teconnect, de todos modos se ocupa mencionarle a python que se meta a 
#teconnect y luego a routes
