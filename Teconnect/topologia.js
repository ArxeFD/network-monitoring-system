function init() {
    var json = [
        {
          "device": {
            "device_type": "Router",
            "hostname": "R1",
            "host": "192.168.1.1",
            "username": "gmedina",
            "password": "cisco",
            "port": 22,
            "secret": "cisco"
          },
          "ips": [
            ["GigabitEthernet0/0/0", "192.168.1.1"],
            ["GigabitEthernet0/0/1", "192.168.4.1"]
          ],
          "connections": [
            ["GigabitEthernet0/0/0", "GigabitEthernet0/0/1", "192.168.1.2"],
            ["GigabitEthernet0/0/1", "Serial0/1", "192.168.1.2"]
          ]
        },
        {
          "device": {
            "device_type": "Router",
            "hostname": "R2",
            "host": "192.168.4.2",
            "username": "gmedina",
            "password": "cisco",
            "port": 22,
            "secret": "cisco"
          },
          "ips": [["GigabitEthernet0/0/1", "192.168.4.2"]],
          "connections": [["GigabitEthernet0/0/1", "Serial0/0", "192.168.1.2"]]
        },
        {
          "device": {
            "device_type": "Switch",
            "hostname": "S1",
            "host": "192.168.1.2",
            "username": "gmedina",
            "password": "cisco",
            "port": 22,
            "secret": "cisco"
          },
          "ips": [["Vlan1", "192.168.1.2"]],
          "connections": [["GigabitEthernet0/0/1", "GigabitEthernet0/0/0", "192.168.1.1"]]
        }
      ];

    // Crear el diagrama
    const diagram = new go.Diagram("myDiagramDiv");
    const make = go.GraphObject.make;
    diagram.layout = make(go.LayeredDigraphLayout, {
        layerSpacing: 250,
        columnSpacing: 250
    });

    // Definir la plantilla para los nodos
    diagram.nodeTemplate =
    make(go.Node, "Vertical",
        make(go.Picture,
        { maxSize: new go.Size(50, 50) },
        new go.Binding("source", "img")),
        make(go.TextBlock,
        { margin: new go.Margin(3, 0, 0, 0),
            maxSize: new go.Size(100, 30),
            isMultiline: false },
        new go.Binding("text", "foot"))
    );

    // Definir la plantilla para los enlaces
    diagram.linkTemplate =
    make(go.Link,
        { routing: go.Routing.Orthogonal,  // may be either Orthogonal or AvoidsNodes
          curve: go.Curve.Bezier },
        make(go.Shape),
        make(go.TextBlock,
        { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Orientation.Upright },
            new go.Binding("text", "startInterface")),
        make(go.TextBlock,
        { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Orientation.Upright },
            new go.Binding("text", "endInterface")),
    );

    let createdLinks = []; // Array para llevar un registro de los enlaces creados

    // Agregar nodos al diagrama
    json.forEach(element => {
        var deviceId = element.device.host;
        var deviceLabel = element.device.hostname; 
        var deviceType = element.device.device_type;
        var nodeData = {};
        if(deviceType == "Switch")
            nodeData = {key : deviceId, foot : deviceLabel, img : "static/img/switch.svg"};
        else {
            nodeData = {key : deviceId, foot : deviceLabel, img : "static/img/router-svgrepo-com.svg"};
        }
        diagram.model.addNodeData(nodeData);
    });

    // Agregar enlaces al diagrama
    json.forEach(element => {
        var fromDevice = element.device.host;
        var conexiones = element.connections;
        conexiones.forEach(conexion => {
            var localPort = conexion[0];
            var remotePort = conexion[1];
            var toDevice = conexion[2];
            var deviceIndex = -1; // Inicializamos el índice del dispositivo de destino

            // Iterar sobre los demás dispositivos
            json.forEach((otroElemento, index) => {
                // Ignorar el propio dispositivo
                if (index !== json.indexOf(element)) {
                    otroElemento.ips.forEach(ip => {
                        // Comparar la IP de la conexión con las IPs del otro dispositivo
                        if (ip[1] === toDevice) {
                            deviceIndex = index; // Si hay coincidencia, guardamos el índice del dispositivo
                        }
                    });
                }
            });

            // Si se encontró un dispositivo coincidente y no existe un enlace en la dirección opuesta, crear la conexión gráfica
            if (deviceIndex !== -1) {
                var linkKey = fromDevice + "-" + json[deviceIndex].device.host;
                var reverseLinkKey = json[deviceIndex].device.host + "-" + fromDevice;
                if (!createdLinks.includes(reverseLinkKey)) { // Verificar si el enlace en la dirección opuesta no ha sido creado
                    createdLinks.push(linkKey); // Registrar el enlace creado
                    var linkData = {
                        from: fromDevice,
                        to: json[deviceIndex].device.host,
                        startInterface: localPort,
                        endInterface: remotePort
                    };
                    diagram.model.addLinkData(linkData);
                }
            }
        });
    });
}
