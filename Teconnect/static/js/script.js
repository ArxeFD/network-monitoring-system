document.addEventListener("DOMContentLoaded", function() {
    
    var socket = io()
    
    //JavaScript le manda el mensaje 'start_discovery' a python, al recibirlo python, hará la lógica necesaria para descubrir la topología
    document.getElementById("btn").addEventListener('click', function(){
        socket.emit('start_discovery');
        console.log("Holaaa");
    });
    //Cuando ya se haga la lógica de descubrimiento, python enviará la topología de vuelta a js
    //con el mensaje 'topology_data', y lo enviará junto con un diccionario de la topologia
    
    socket.on('topology_data', function(topologyData){ //Aquí espera q le llegue el mensaje 'topology_data' para hacer algo
        
        console.log(topologyData);
        
        document.getElementById("chaifon").style.width = "1100px";

        
        var nodesDataSet = new vis.DataSet(topologyData.nodes);
        var edgesDataSet = new vis.DataSet(topologyData.edges);
        
        var container = document.getElementsByClassName('screen')[0];
        var data = {
            nodes: nodesDataSet,
            edges: edgesDataSet
        };

        var options = {};

        var network = new vis.Network(container, data, options);

    });

});