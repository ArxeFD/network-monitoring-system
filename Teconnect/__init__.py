from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database.db'
app.config['SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
socketio = SocketIO(app, port=11000)  # Cambia el puerto según sea necesario

# Importa rutas después de crear app, db y login_manager
from Teconnect.routes.routes import *

# Ahora importa modelos después de crear db
from Teconnect.models.models import User
from Teconnect.routes import routesIO

#Aunque routes está en la misma carpeta, se tiene que importar desde la relación
#que tiene con otras carpetas para python, o sea no importa que routes esté
#dentro de Teconnect, de todos modos se ocupa mencionarle a python que se meta a 
#teconnect y luego a routes
