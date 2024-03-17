import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({
  id,
  top,
  left,
  data,
  setCurrentState,
  getCurrentState,
  
  ...props
}) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const setfinalState = useCallback(() => {
    setNodes((nodes) => {
        const updatedNodes = nodes.map((node) =>
            node.id === id ? { ...node, data: {...node.data, finalState : !node.data.finalState}}: node
        );

        console.log("Updated nodes:", updatedNodes);
        return updatedNodes;
    }); 

  }, [id, setNodes])


  const setInitialState = useCallback(() => {
    setCurrentState(getNode(id));
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        // Check if the node id matches the id of the current state
        if (node.id === id) {
          // Update the data object of the node to set initialState
          return {
            ...node,
            data: {
              ...node.data,
              initialState: true // Assuming you want to set initialState to true
            }
          } 
        }
        return {
          ...node,
          data: {
            ...node.data,
            initialState: false // Assuming you want to set initialState to true
          }
        }
      });
  
      return updatedNodes;
    });
  }, [id, getCurrentState, setNodes, setCurrentState]);

  console.log("Hi");

  return (
    <div
      style={{ top, left, position: 'absolute' }}
      class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute"
      {...props}
    >
      <p class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" style={{ margin: '0.5em' }}>
        State: {data.label}
      </p>
      <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={deleteNode}>delete</button>
      <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={setfinalState}>Toggle Final State</button>
      <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={setInitialState}>Toggle Initial State</button>
    </div>
  );
}
