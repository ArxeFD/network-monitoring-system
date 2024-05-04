function init() {
  const make = go.GraphObject.make;
  const diagram = new go.Diagram("myDiagramDiv");

  // Establecer el diseño del diagrama como un diagrama de capas
  diagram.layout = make(go.LayeredDigraphLayout, {
      layerSpacing: 100, // ajustar la distancia vertical entre las capas de nodos
      columnSpacing: 100 // ajustar la distancia horizontal entre los nodos en la misma capa
  });

  // Definir la plantilla de nodo
  diagram.nodeTemplate = make(go.Node, "Vertical", // nodo apilado verticalmente
      {
          click: showContextMenu // Agrega un evento de clic para mostrar el menú
      },
      make(go.Picture, // elemento de imagen
          { maxSize: new go.Size(50, 50) }, // tamaño máximo de la imagen
          new go.Binding("source", "img") // enlace dinámico a la propiedad "img" de los datos del nodo
      ),
      make(go.TextBlock, // bloque de texto
          { margin: new go.Margin(3, 0, 0, 0), // margen superior
              maxSize: new go.Size(100, 30), // tamaño máximo
              isMultiline: false }, // texto de una sola línea
          new go.Binding("text", "foot") // enlace dinámico a la propiedad "foot" de los datos del nodo
      )
  );

  // Definir la plantilla de enlace
  diagram.linkTemplate = make(go.Link,
      make(go.Shape), // forma del enlace
      make(go.TextBlock,
          { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN), segmentOrientation: go.Orientation.Upright },
          new go.Binding("text", "startInterface")), // etiqueta de texto del primer segmento
      make(go.TextBlock,
          { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN), segmentOrientation: go.Orientation.Upright },
          new go.Binding("text", "endInterface")) // etiqueta de texto del último segmento
  );

  // Definir el modelo de datos del diagrama, que incluye nodos y enlaces
  diagram.model = new go.GraphLinksModel(
      [
          { key: 1, foot: "R1", img: "static/img/router-svgrepo-com.svg", IP: "192.168.10.1" }, // datos del nodo router
          { key: 2, foot: "R2", img: "static/img/router-svgrepo-com.svg", IP: "192.168.20.1" }, // datos del nodo router
          { key: 3, foot: "S1", img: "static/img/switch.svg" },
          { key: 4, foot: "R3", img: "static/img/router-svgrepo-com.svg", IP: "192.168.10.1" }, // datos del nodo router
          { key: 5, foot: "R4", img: "static/img/router-svgrepo-com.svg", IP: "192.168.20.1" }, // datos del nodo router
          { key: 6, foot: "S2", img: "static/img/switch.svg" } // datos del nodo switch
      ],
      [
          { from: 6, to: 1, startInterface: "Se 0/0/0", endInterface: "Gi 0/0/0" }, // enlace del nodo 1 al nodo 2
          { from: 1, to: 3, startInterface: "Se 0/0/1", endInterface: "Gi 0/0/1" }, // enlace del nodo 1 al nodo 3
          { from: 3, to: 2 },
          { from: 1, to: 4 }, // enlace del nodo 1 al nodo 3
          { from: 3, to: 5 },
          { from: 3, to: 6 } // enlace del nodo 3 al nodo 2
      ]
  );
}

// Función para mostrar el menú contextual
function showContextMenu(e, obj) {
  // Si el clic no fue sobre un nodo, no muestra el menú
  if (!obj){
    return;
  }
    
  // Si se hizo clic izquierdo
  if (e.diagram.lastInput.left) {
      var contextMenu = document.getElementById("contextMenu");
      contextMenu.style.display = "block";
      contextMenu.style.left = (document.getElementById("myDiagramDiv").offsetWidth + 10) + "px"; // Ajusta 10px a la derecha
      contextMenu.style.top = e.diagram.lastInput.viewPoint.y + "px";

      // Event listener para cerrar el menú al hacer clic en cualquier lugar fuera del menú
      document.addEventListener("click", closeContextMenu);
  }
}

// Ejecutar la función init cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", init);