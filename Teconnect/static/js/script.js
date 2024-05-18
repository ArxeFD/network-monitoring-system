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


    document.getElementById("btnRestart").addEventListener('click', function(event) {
        event.preventDefault(); // Evita el comportamiento por defecto del botón

        // Obtiene los datos del formulario
        var formData = new FormData(document.getElementById("sshForm"));

        // Envía los datos al servidor usando Socket.IO
        socket.emit('restart_discovery', {
            ip: formData.get('ip'),
            username: formData.get('username'),
            password: formData.get('password')
        });

        console.log("Reiniciando descubrimiento");
    });
    //Cuando ya se haga la lógica de descubrimiento, python enviará la topología de vuelta a js
    //con el mensaje 'topology_data', y lo enviará junto con un diccionario de la topologia
    
    socket.on('topology_data', function(topologyData){ //Aquí espera q le llegue el mensaje 'topology_data' para hacer algo

        //document.getElementById("myDiagramDiv").style.width = "1100px";
        //document.getElementById("screen").innerHTML = "";

        var connectionsDict = topologyData.neighbors;
        var nodesDict = topologyData.nodes;

        console.log(connectionsDict)
     // Crear el diagrama
        const diagram = new go.Diagram("myDiagramDiv");
        const make = go.GraphObject.make;

        // Definir la plantilla para los nodos
        diagram.nodeTemplate =
        make(go.Node, "Vertical",
            { portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides, margin: new go.Margin(30,30,30,30) },
            make(go.Picture,
            { maxSize: new go.Size(50, 50) },
            new go.Binding("source", "img")),
            make(go.TextBlock,
            { margin: new go.Margin(3, 0, 0, 0),
                maxSize: new go.Size(100, 30),
                isMultiline: false },
            new go.Binding("text", "foot")),
        );

        diagram.addDiagramListener("ObjectSingleClicked", function(e){
            var part = e.subject.part;
            if(!(part instanceof go.Link)){
                showContextMenu(e, part);
            }
        });

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
    socket.on('new_topology_data', function(topologyData){ //Aquí espera q le llegue el mensaje 'topology_data' para hacer algo

        document.getElementById("myDiagramDiv").innerHTML = "";
        //document.getElementById("screen").innerHTML = "";

        var connectionsDict = topologyData.neighbors;
        var nodesDict = topologyData.nodes;

        console.log(connectionsDict)
     // Crear el diagrama
        const diagram = new go.Diagram("myDiagramDiv");
        const make = go.GraphObject.make;

        // Definir la plantilla para los nodos
        diagram.nodeTemplate =
        make(go.Node, "Vertical",
            { portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides, margin: new go.Margin(30,30,30,30) },
            make(go.Picture,
            { maxSize: new go.Size(50, 50) },
            new go.Binding("source", "img")),
            make(go.TextBlock,
            { margin: new go.Margin(3, 0, 0, 0),
                maxSize: new go.Size(100, 30),
                isMultiline: false },
            new go.Binding("text", "foot")),
        );

        diagram.addDiagramListener("ObjectSingleClicked", function(e){
            var part = e.subject.part;
            if(!(part instanceof go.Link)){
                showContextMenu(e, part);
            }
        });

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

var selectedNodeKey = "";

function showContextMenu(e, obj) {
    // Guarda la clave del nodo seleccionado
    selectedNodeKey = obj.data.key;
    selectedNodeFoot = obj.data.foot;
            
    // Verificamos si el clic fue con el botón izquierdo
    if (e.diagram.lastInput.left) {
        showIP(selectedNodeFoot, selectedNodeKey);
        // Evitar que el clic en el menú cierre el menú
    }
}

function showIP(selectedNodeFoot, selectedNodeKey){
    console.log(selectedNodeKey)
    div = document.getElementById("hostname");
    div.innerHTML = selectedNodeFoot;
    console.log(selectedNodeFoot, selectedNodeKey);
}

function mostrarHostname(){
    form = document.getElementById("hostName");
    form.style.display = "block";
}

function mandarHostname(){
    var socket = io();
    document.getElementById("hostName").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('hostname', {
            ip: selectedNodeKey,
            hostname: formData.get('hostname')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("hostName")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarBanner(){
    form = document.getElementById("Banner");
    form.style.display = "block";
}

function mandarBanner(){
    var socket = io();
    document.getElementById("Banner").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('BannerConf', {
            ip: selectedNodeKey,
            banner: formData.get('nombreBanner')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("Banner")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarNTPServer(){
    form = document.getElementById("ntp");
    form.style.display = "block";
}

function mandarNTPServer(){
    var socket = io();
    document.getElementById("ntp").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('ntpServer', {
            ip: selectedNodeKey,
            server: formData.get('ipNTP')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("ntp")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarVTPServer(){
    form = document.getElementById("vtp");
    form.style.display = "block";
}

function mandarVTPServer(){
    var socket = io();
    document.getElementById("vtp").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('vtpServer', {
            ip: selectedNodeKey,
            domain: formData.get('domVTP'),
            password: formData.get('passVTP')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("vtp")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarVTPClient(){
    form = document.getElementById("vtpC");
    form.style.display = "block";
}

function mandarVTPClient(){
    var socket = io();
    document.getElementById("vtpC").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('vtpClient', {
            ip: selectedNodeKey,
            domain: formData.get('domVTPC'),
            password: formData.get('passVTPC')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("vtpC")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarCrearVLAN(){
    form = document.getElementById("cVlan");
    form.style.display = "block";
}

function mandarCrearVLAN(){
    var socket = io();
    document.getElementById("cVlan").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('crearVlan', {
            ip: selectedNodeKey,
            num: formData.get('numVlan'),
            name: formData.get('nameVlan')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("cVlan")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarExcluirDHCP(){
    form = document.getElementById("exDHCP");
    form.style.display = "block";
}

function mandarExcluirDHCP(){
    var socket = io();
    document.getElementById("exDHCP").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('excluirDHCP', {
            ip: selectedNodeKey,
            excluded: formData.get('exclDHCP'),
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("exDHCP")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mostrarCrearPoolDHCPv4(){
    form = document.getElementById("pDHCP");
    form.style.display = "block";
}

function mandarCrearPoolDHCPv4(){
    var socket = io();
    document.getElementById("pDHCP").addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        var formData = new FormData(this);

        socket.emit('crearPoolV4', {
            ip: selectedNodeKey,
            nombre: formData.get('namePool'),
            router: formData.get('defRout'),
            dns: formData.get('dnsServer'),
            domain: formData.get('domainPool'),
            network: formData.get('net')
        });
        // Esperar 3 segundos antes de ocultar el elemento
        setTimeout(function() {
            form = document.getElementById("pDHCP")
            form.style.display = "none";
        }, 3000); // 3000 milisegundos = 3 segundos
    });
}

function mandarShVer(){
    var socket = io();
    socket.emit('show_version', {
        ip: selectedNodeKey
    });
    socket.on('showVersionOutput', function(versionData){
        outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML = versionData;
    });
}

function mandarShRunn(){
    var socket = io();
    socket.emit('show_running', {
        ip: selectedNodeKey
    });
    socket.on('showRunningOutput', function(runnData){
        outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML = runnData;
    });
}

function mandarShLicense(){
    var socket = io();
    socket.emit('show_license', {
        ip: selectedNodeKey
    });
    socket.on('showed_license', function(licenseData){
        outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML = licenseData;
    });
}

function mandarShIntBr(){
    var socket = io();
    socket.emit('show_int_br', {
        ip: selectedNodeKey
    });
    socket.on('showed_int_br', function(intData){
        outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML = intData;
    });
}

function mandarShProcesses(){
    var socket = io();
    socket.emit('show_proc', {
        ip: selectedNodeKey
    });
    socket.on('showed_proc', function(procData){
        outputDiv = document.getElementById("outputDiv");
        outputDiv.innerHTML = procData;
    });
}

function cifrarContraseñas(){
    var socket = io();
    socket.emit('service_password_encryption', {
        ip: selectedNodeKey
    });
    socket.on('service_password_encrypted', function(runnData) {
        var p = document.getElementById("passEncrypted");
        p.style.display = "block";

        // Esperar 4 segundos antes de ocultar el elemento
        setTimeout(function() {
            p.style.display = "none";
        }, 4000); // 4000 milisegundos = 4 segundos
    });
}

function sincronizarMensajes(){
    var socket = io();
    socket.emit('msg_sync', {
        ip: selectedNodeKey
    });
    socket.on('msg_synced', function(runnData) {
        var p = document.getElementById("msgSync");
        p.style.display = "block";

        // Esperar 4 segundos antes de ocultar el elemento
        setTimeout(function() {
            p.style.display = "none";
        }, 4000); // 4000 milisegundos = 4 segundos
    });
}



