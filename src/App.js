import './App.css';
import 'reactflow/dist/style.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType, ReactFlowProvider, Background } from 'reactflow';
import NodeType from "./CircleNode";
import ContextMenu from './ContextMenu'

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

  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onConnect = (params) => {
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
      setEdgeName(edge[0].label)
    } else {
      setSelectedEdge("");
      setIsSelected(false);
      setEdgeName("")
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

  useEffect(() => {

    setNodes((nds) => {
      return nds.map((node) => {

        if (node.finalState) {
          node.style = {
            ...node.style,
            backgroundColor: 'green',
          };
        } else {
          node.style = {
            width: "50px",
            height: "50px",
            borderRadius: "10em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'red',
          }
        }
        return node;
      })
    })

  }, [nodes, setNodes])
  

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
      finalState: false
    };
    setNodes((prevElements) => [...prevElements, newNode]);
  }

  const checkInputString = (inputString) => {
    let currentStateCopy = currentState;

    for (const symbol of inputString) {

      const transition = edges.find((edge) => edge.source === currentStateCopy && edge.label === symbol);

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

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <>
    <h1 class="text-5xl font-extrabold dark:text-white">Automata Simulator</h1>
    <ReactFlowProvider>
    <div style={{ position: 'relative', width: '1000px', height: '500px', border: '1px solid black' }}>
      <ReactFlow 
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeContextMenu={onNodeContextMenu}
      >
        <Background />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => addCircleNode()}>Add Node</button>
    <div className="updatenode_checkboxwrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <label class="font-extrabold dark:text-white">Label: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={edgeName} onChange={(evt) => setEdgeName(evt.target.value)} />
    </div>
    <div className="updatenode_checkboxwrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <label class="font-extrabold dark:text-white">Input String: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" id="inputString"></input>
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(document.getElementById('inputString').value)}>Check Input</button>
    <div>{outputMessage}</div>
    </ReactFlowProvider>
    </>
  )
}

export default App;
