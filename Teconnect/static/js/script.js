document.addEventListener("DOMContentLoaded", function() {
    
    var socket = io();
    
    //JavaScript le manda el mensaje 'start_discovery' a python, al recibirlo python, hará la lógica necesaria para descubrir la topología
    document.getElementById("sshForm").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this); // Obtiene los datos del formulario
    
        // Envía los datos al servidor usando Socket.IO
        socket.emit('start_discovery', {
            ip: formData.get('ip'),
            username: formData.get('username'),
            password: formData.get('password')
        });
    
        console.log("Holaaa");
    });
    //Cuando ya se haga la lógica de descubrimiento, python enviará la topología de vuelta a js
    //con el mensaje 'topology_data', y lo enviará junto con un diccionario de la topologia
    
    socket.on('topology_data', function(topologyData){ //Aquí espera q le llegue el mensaje 'topology_data' para hacer algo
        var nodes = topologyData.nodes;
        var neighbors = topologyData.neighbors;

        console.log(nodes)
        console.log(neighbors)
    });
});