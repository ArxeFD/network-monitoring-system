from flask import Flask

app = Flask(__name__)

from Teconnect.routes import index 


#Aunque routes está en la misma carpeta, se tiene que importar desde la relación
#que tiene con otras carpetas para python, o sea no importa que routes esté
#dentro de Teconnect, de todos modos se ocupa mencionarle a python que se meta a 
#teconnect y luego a routes
