function init(){
    const make = go.GraphObject.make;
    const diagram = new go.Diagram("myDiagramDiv");

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

    diagram.linkTemplate =
  make(go.Link,
    make(go.Shape),
    make(go.TextBlock, "Se 0/0",
      { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Orientation.Upright }),
    make(go.TextBlock, "Gi 0/0/0",
      { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Orientation.Upright })
  );

    diagram.model = new go.GraphLinksModel(
        [{ key : 1, foot: "R1", img : "static/img/router-svgrepo-com.svg" },// two node data, in an Array
         { key : 2, foot: "R2", img : "static/img/router-svgrepo-com.svg" },
         { key : 3, foot: "S1", img : "static/img/switch.svg" }],
        [{ from : 1, to : 2 },
         { from : 1, to : 3}]
      );
    
}