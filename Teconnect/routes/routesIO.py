from Teconnect import app, socketio
from Teconnect import topology_discovery as td
 
@socketio.on('start_discovery')
def handle_start_discovery(data):
    ip = data['ip']
    username = data['username']
    password = data['password']
    td.initQueue(ip)
    td.startDiscovery(username, password)
    td.addNodes()
    td.updateLinksWithRelatedIPs()
    nodes = td.returnNodes()
    neighbors = td.returnNeighbors()
    socketio.emit("topology_data", {'nodes' : nodes, 'neighbors' : neighbors})

@socketio.on('test')
def testSocket(data):
    socketio.emit("messageTest", "response from server" )
