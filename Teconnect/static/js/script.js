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

        document.getElementById("myDiagramDiv").style.width = "1100px";
        document.getElementById("screen").innerHTML = "";

        var connectionsDict = topologyData.neighbors;
        var nodesDict = topologyData.nodes;

     // Crear el diagrama
        const diagram = new go.Diagram("screen");
        const make = go.GraphObject.make;

        // Definir la plantilla para los nodos
        diagram.nodeTemplate =
        make(go.Node, "Vertical",
            { portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides },
            make(go.Picture,
            { maxSize: new go.Size(50, 50) },
            new go.Binding("source", "img")),
            make(go.TextBlock,
            { margin: new go.Margin(3, 0, 0, 0),
                maxSize: new go.Size(100, 30),
                isMultiline: false },
            new go.Binding("text", "foot")),
        );

        // Función para obtener la versión abreviada de la interfaz
        function obtenerInterfazAbreviada(interfazCompleta) {
        // Definir un objeto para mapear los prefijos completos a sus versiones abreviadas
        const abreviaciones = {
            "GigabitEthernet": "Gi",
            "FastEthernet": "Fa",
            "Serial": "Se"
        };

        // Iterar sobre las claves del objeto
        for (let prefix in abreviaciones) {
            // Verificar si la interfaz comienza con alguna de las claves
            if (interfazCompleta.startsWith(prefix)) {
            // Reemplazar el prefijo completo con su versión abreviada
            return abreviaciones[prefix] + interfazCompleta.slice(prefix.length);
            }
        }
        // Si no se encuentra ninguna coincidencia, devolver la interfaz completa sin cambios
        return interfazCompleta;
        }

        // Luego, en la definición de la plantilla de enlaces, puedes usar esta función para obtener la versión abreviada de las interfaces:
        diagram.linkTemplate =
        make(go.Link,
            make(go.Shape),
            //{curve: go.Link.Bezier},
            make(go.TextBlock,
            { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                segmentOrientation: go.Orientation.Upright },
            new go.Binding("text", "startInterface", function(interfaz) {
                return obtenerInterfazAbreviada(interfaz); // Obtener la versión abreviada de la interfaz de inicio
            })),
            make(go.TextBlock,
            { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                segmentOrientation: go.Orientation.Upright },
            new go.Binding("text", "endInterface", function(interfaz) {
                return obtenerInterfazAbreviada(interfaz); // Obtener la versión abreviada de la interfaz de fin
            })),
        );

        // Agregar nodos al diagrama
        nodesDict.forEach(node => {
        var nodeData = { key: node.key, foot: node.foot, img: node.img };
        diagram.model.addNodeData(nodeData);
        });

        let createdLinks = []; // Array para llevar un registro de los enlaces creados

        // Agregar enlaces al diagrama
        connectionsDict.forEach(connection => {
        var from = connection.from;
        var to = connection.to;
        var fromInt = connection.fromInt;
        var toInt = connection.toInt;

        // Verificar si ya existe un enlace entre los nodos from y to
        var exists = createdLinks.some(link => {
            return (link.from === from && link.to === to) || (link.from === to && link.to === from);
        });

        // Si no existe, agregar el enlace
        if (!exists) {
            var linkData = {
            from: from,
            to: to,
            startInterface: fromInt,
            endInterface: toInt
            };
            diagram.model.addLinkData(linkData);
            // Registrar el enlace creado
            createdLinks.push({ from: from, to: to });
        }
        });

        // Crear un layout Force-Directed
        var layout = make(go.ForceDirectedLayout);
        // Asignar el layout al diagrama
        diagram.layout = layout;
    });
});