import './App.css';
import 'reactflow/dist/style.css';
import { useCallback, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType, ReactFlowProvider } from 'reactflow';
import NodeType from "./CircleNode";

const nodeTypes = {
  circleNode: NodeType
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'q0' }, type: "circleNode" },
  { id: '2', position: { x: 0, y: 0 }, data: { label: 'q1' }, type: "circleNode" }
];
const initialEdges = [
  { id: 'e1-3', source: '1', target: '2', label: 'choose', markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, style:  {strokeWidth: 2} },
];


const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  
  const [edgeName, setEdgeName] = useState("Edge 1");

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  const [currentState, setCurrentState] = useState("1");
  const [isAccepted, setIsAccepted] = useState(false);
  const [outputMessage, setOutputMessage] = useState("");

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [],
  // );

  const onConnect = (params) => {
    // Customize the edge properties here
    const newEdge = {
      ...params,
      id: (edges.length + 1).toString(),
      markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, 
      style:  {strokeWidth: 2},
    };

    setEdges((prevElements) => [...prevElements, newEdge]);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  useEffect(() => {
    const edge = edges.filter((edge) => {
      if (edge.selected) return true;
      return false;
    });

    if (edge[0]) {
      setSelectedEdge(edge[0]);
      setIsSelected(true);
    } else {
      setSelectedEdge("");
      setIsSelected(false);
    }
  }, [edges]);

   useEffect(() => {
    setEdges((eds) => {
      return eds.map((edge) => {
        if (edge.id === selectedEdge?.id) {
          edge.label = edgeName;
        }

        return edge;
      })
    })
  }, [edgeName, setEdges]);
  

  const addCircleNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `q${nodes.length}` },
      type: "circleNode",
      position: {
        x: 0,
        y: 200,
      },
      padding: "14px",
      borderRadius: "50%",
    };
    setNodes((prevElements) => [...prevElements, newNode]);
  }

  const checkInputString = (inputString) => {
    let currentStateCopy = currentState;

    for (const symbol of inputString) {

      console.log(edges);
      console.log(symbol);
      console.log(currentStateCopy);

      const transition = edges.find((edge) => edge.source === currentStateCopy && edge.label === symbol);

      console.log(transition);

      if (transition) {
        currentStateCopy = transition.target;
      }
    }

    setIsAccepted(currentStateCopy === "2")
  }

  useEffect(() => {
    if (isAccepted) {
      setOutputMessage("Input accepted!");
    } else {
      setOutputMessage("Input not accepted!");
    }
  }, [isAccepted]);

  return (
    <>
    <h1>Automata Simulator</h1>
    <ReactFlowProvider>
    <div style={{ position: 'relative', width: '1000px', height: '500px', border: '1px solid black' }}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
    <button onClick={() => addCircleNode()}>Add Node</button>
    <div className="updatenode_checkboxwrapper">
      <label>label: </label>
      <input value={edgeName} onChange={(evt) => setEdgeName(evt.target.value)} />
    </div>
    <label>Input String: </label>
    <input id="inputString"></input>
    <button onClick={() => checkInputString(document.getElementById('inputString').value)}>Check Input</button>
    <div>{outputMessage}</div>
    </ReactFlowProvider>
    </>
  )
}

export default App;
