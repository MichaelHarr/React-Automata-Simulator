import './App.css';
import 'reactflow/dist/style.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType, ReactFlowProvider, Background } from 'reactflow';
import { SmartBezierEdge, SmartStraightEdge, SmartStepEdge } from '@tisoap/react-flow-smart-edge'
import NodeType from "./CircleNode";
import ContextMenu from './ContextMenu'
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  circleNode: NodeType
};

const edgeTypes = {
  smart: SmartBezierEdge,
  smartStraight: SmartStraightEdge
}

const initialNodes = [
  { id: '1', position: { x: 200, y: 200 }, data: { label: 'q0', finalState: false, description: '', initialState: true }, type: "circleNode"},
  { id: '2', position: { x: 500, y: 195 }, data: { label: 'q1', finalState: true, description: '', initialState: false }, type: "circleNode" }
];
const initialEdges = [
  { id: 'e1-3', source: '1', target: '2', label: '1', markerEnd: {type: MarkerType.ArrowClosed, width: 20, height: 20}, style:  {strokeWidth: 2}},
];


const App = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  
  const [edgeName, setEdgeName] = useState("Edge 1");
  const [inputString, setInputString] = useState('');
  const [inputs, setInputs] = useState([]);
  const [nodeDescription, setNodeDescription] = useState('');

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
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
      type: params.source == params.target? "smart" : ""
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
    const node = nodes.filter((node) => {
      if (node.selected) return true;
      return false;
    });

    if (node[0]) {
      setSelectedNode(node[0]);
      setIsSelected(true);
      // setNode(node[0].label)
    } else {
      setSelectedNode("");
      setIsSelected(false);
      // setEdgeName("")
    }
  }, [nodes]);

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
        if (node.id == selectedNode?.id) {
          node.data.description = nodeDescription;
        }
  
        return node;
      })
    })
  }, [nodeDescription, setNodes])

  const addCircleNode = () => {
    const newNode = {
      // id: (nodes.length + 1).toString(),
      id: uuidv4(),
      data: { label: `q${nodes.length}`, finalState: false, description: nodeDescription, initialState: false },
      type: "circleNode",
      position: {
        x: 0,
        y: 200,
      },
      padding: "14px",
      borderRadius: "50%",
    };
    console.log("currentstateId")
    console.log(currentState.id)
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
      setOutputMessage("Pass");
    } else {
      setOutputMessage("Fail");
    }
  }, [isAccepted]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      setSelectedNode(node);

      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY - 50,
        left: event.clientX - 500,
        data: node.data,
        currentState: setCurrentState,
        getCurrentState: currentState
      });
      console.log(node.data);
    },
    [setMenu],
  );

  console.log("Initial State");
  console.log(currentState);

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
    <div style={{backgroundColor:'#EFFAFD'}}>
    <h1 class="text-5xl font-extrabold dark:text-white">Automata Simulator</h1>
    <p>A web application for creating and simulating finite state automata</p>
    <ReactFlowProvider>
    <div class="grid grid-cols-3 grid-rows-5 gap-1 items-top justify-center" style={{ display: 'flex', border: '1px solid black' }}>
      <div class="w-1/5" style={{ border: '1px solid black'}}>
        <label class="font-extrabold dark:text-white">Input String: </label>
        <div className="updatenode_checkboxwrapper flex" style={{ alignContent: 'center', dispaly: 'flex' }}>
          <input style={{ width: '70%'}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={inputString} onChange={(evt) => setInputString(evt.target.value)} />
          <div class="font-extrabold flex align-middle" style={{color: isAccepted? 'green' : 'red'}}>{outputMessage}</div>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => checkInputString(inputString)}>Check Input</button>
      </div>
      <div class="w-3/5 row-start-1" style={{ position: 'relative', width: '800px', height: '500px', border: '1px solid black' }}>
        <ReactFlow 
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeContextMenu={onNodeContextMenu}
        >
          <Background />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} setCurrentState={setCurrentState} />}
        </ReactFlow>
      </div>
     
      <div class="w-1/5 font-extrabold dark:text-white align-top row-start-1" style={{ border: '1px solid black'}}>
        {selectedNode? (
          <div class="" style={{ border: '1px solid black'}}>
            <div style={{ border: '1px solid black'}}>State: {selectedNode.data.label}</div>
            <div style={{ border: '1px solid black'}}>Description:
              <textarea class='outline-none' style={{width : '100%', backgroundColor:'#EFFAFD'}} value={selectedNode.data.description} onChange={(evt) => setNodeDescription(evt.target.value)}></textarea>
            </div>

          </div>
        ): null}

      </div>
    </div>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={() => addCircleNode()}>Add Node</button>
    <div className="updatenode_checkboxwrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <label class="font-extrabold dark:text-white">Edge Label: </label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={edgeName} onChange={(evt) => setEdgeName(evt.target.value)} />
    </div>
    <h3 class="pt-5 pb-3 text-3xl font-extrabold dark:text-white">Guide:</h3>
    <p class="font-bold">Add Node button above creates a new state</p>
    <p class="font-bold">Click on transition to edit it's symbol in text input above</p>
    <br></br>
    <p class="font-bold">Right Click a state to toggle what type of state it is:</p>
    <p class="font-normal">Green state = initial state</p>
    <p class="font-normal">Extra ring = final state</p>
    <br></br>
    <p class="font-bold">Clicking on state allows you to edit it's description on the right</p>
    <p class="font-bold">Left side allows for checking what inputs are accepted by the automaton</p>
    <br></br>
    <p class="font-bold pb-12">Non-Deterministic Automata not currently supported</p>
    <br></br>
    <br></br>
    </ReactFlowProvider>
    </div>
  )
}

export default App;
