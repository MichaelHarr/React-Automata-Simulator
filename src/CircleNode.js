import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';


export default memo(({ data, isConnectable }) => {

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div
            style={{
                width: "50px",
                height: "50px",
                borderRadius: "10em",
                borderWidth: "0.1em",
                borderColor: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: data.initialState ? 'lightGreen' : 'yellow'
            }}
        >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8em",
            borderColor: data.finalState ? 'black' : 'transparent',
            borderWidth: "0.1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          >
            {data.label}
          </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});