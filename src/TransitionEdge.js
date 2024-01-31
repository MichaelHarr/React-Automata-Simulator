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
      <article
            style={{
                width: "50px",
                height: "50px",
                borderRadius: "10em",
                backgroundColor: "#055C9D",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >{data.label}</article>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});