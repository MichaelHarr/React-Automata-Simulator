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
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'q0', finalState: false }, type: "circleNode"},
  { id: '2', position: { x: 0, y: 0 }, data: { label: 'q1', finalState: false }, type: "circleNode" }
];
const initialEdges = [
  { id: 'e1-3', source: '1', target: '2', label: 'choose', markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, style:  {strokeWidth: 2} },
];


const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  
  const [edgeName, setEdgeName] = useState("Edge 1");
  const [inputString, setInputString] = useState('');
  const [inputList, setInputList] = useState([]);

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  const [currentState, setCurrentState] = useState(nodes.find(node => node.id === '1'));
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
  

  const addCircleNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `q${nodes.length}`, finalState: false },
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

    let transitionFound = true

    for (const symbol of inputString) {

      const transition = edges.find((edge) => edge.source === currentStateCopy.id && edge.label === symbol);

      if (transition) {
        currentStateCopy = nodes.find(node => node.id === transition.target);
      } else {
        console.log("No Transition Found");
        transitionFound = false
      }
      console.log("CurrentStateCopy: ", currentStateCopy);
    }


    setIsAccepted(transitionFound && currentStateCopy.data.finalState);
  }

  /*const addInputBtnClick = () => {
    setInputList(inputList.concat(<Input key={inputList.length} />));
  }*/

  useEffect(() => {
    if (isAccepted) {
      setOutputMessage("Input accepted!");
    } else {
      setOutputMessage("Input not accepted!");
    }
  }, [isAccepted]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();

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

  /*const Input = () => {
    return (
      <div style={{display: 'flex'}}>
      <label class="font-extrabold dark:text-white">Label: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={inputString} onChange={(evt) => setInputString(evt.target.value)} />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(inputString)}>Test</button>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(inputString)}>Step</button>
      </div>
    )
  }*/

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <>
    <h1 class="text-5xl font-extrabold dark:text-white">Automata Simulator</h1>
    <ReactFlowProvider>
    <div style={{ display: 'flex' }}>
      <div style={{ position: 'relative', width: '800px', height: '500px', border: '1px solid black' }}>
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
      <div className="updatenode_checkboxwrapper" style={{ display: 'absolute', alignItems: 'top' }}>
      </div>
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => addCircleNode()}>Add Node</button>
    <div className="updatenode_checkboxwrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <label class="font-extrabold dark:text-white">Label: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={edgeName} onChange={(evt) => setEdgeName(evt.target.value)} />
    </div>
    <div className="updatenode_checkboxwrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <label class="font-extrabold dark:text-white">Input String: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={inputString} onChange={(evt) => setInputString(evt.target.value)} />
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(inputString)}>Check Input</button>
    <div>{outputMessage}</div>
    </ReactFlowProvider>
    </>
  )
}

export default App;
