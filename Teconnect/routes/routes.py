from Teconnect import app, socketio
from flask import render_template

@app.route("/")
def index():
    return render_template("index.html")


 
@socketio.on('start_discovery')
def handle_start_discovery():
    topology_data = {
        'nodes': [
            {'id' : 1, 'label' : 'Router1', 'shape':'image', 'image': '../static/img/router-svgrepo-com.svg'},
            {'id' : 2, 'label' : 'Router2', 'shape':'image', 'image': '../static/img/router-svgrepo-com.svg'},
            {'id' : 3, 'label' : 'Switch1', 'shape':'image', 'image': '../static/img/switch.svg'}
        ],
        'edges' : [
            {'from': 1, 'to' : 2},
            {'from': 3, 'to' : 1}
        ]
    }
    socketio.emit('topology_data', topology_data)