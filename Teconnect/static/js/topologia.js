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
          ["Serial0/0/0", "Serial0/1/1", "192.168.4.2"],
          ["GigabitEthernet0/1/0", "GigabitEthernet0/0/0", "192.168.1.2"]
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
        "ips": [["Serial0/1", "192.168.4.2"]],
        "connections": [["Serial0/1/1", "Serial0/0/0", "192.168.1.1"]]
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
        "connections": [["GigabitEthernet0/0/1", "GigabitEthernet0/0/0", "192.168.1.1"],
        ["GigabitEthernet0/0/0", "GigabitEthernet0/1/0", "192.168.1.1"]]
      },
      {
        "device": {
          "device_type": "Switch",
          "hostname": "S2",
          "host": "192.168.1.3",
          "username": "gmedina",
          "password": "cisco",
          "port": 22,
          "secret": "cisco"
        },
        "ips": [["Vlan1", "192.168.1.3"]],
        "connections": [["GigabitEthernet0/0/1", "GigabitEthernet1/0/0", "192.168.1.2"],
        ["GigabitEthernet0/0/0", "GigabitEthernet0/1/0", "192.168.1.2"],["GigabitEthernet0/0/0", "GigabitEthernet0/1/0", "192.168.1.1"],["GigabitEthernet0/0/1", "GigabitEthernet0/0/0", "192.168.1.1"]]
      },
      {
        "device": {
          "device_type": "Router",
          "hostname": "R3",
          "host": "192.168.4.3",
          "username": "gmedina",
          "password": "cisco",
          "port": 22,
          "secret": "cisco"
        },
        "ips": [["Serial0/1", "192.168.4.3"]],
        "connections": [["Serial0/1/1", "Serial0/0/0", "192.168.1.3"],["Serial0/0/1", "Serial0/0/1", "192.168.1.2"]]
      },
    ];

  // Crear el diagrama
  const diagram = new go.Diagram("myDiagramDiv");
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


  let createdLinks = []; // Array para llevar un registro de los enlaces creados
  // Crear un layout Force-Directed
  var layout = make(go.ForceDirectedLayout);

  // Asignar el layout al diagrama
  diagram.layout = layout;
  
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