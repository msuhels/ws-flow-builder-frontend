import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

const InputNode = ({ data }: NodeProps) => {
  const { label } = data as any;

  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 shadow-md min-w-[200px]">
      <div className="bg-blue-500 text-white p-2 rounded-t-md flex items-center text-sm font-semibold">
        <MessageSquare className="w-4 h-4 mr-2" />
        Input
      </div>
      
      <div className="p-3">
        <div className="text-sm text-gray-800 whitespace-pre-wrap">
          {label || 'Enter message text...'}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default memo(InputNode);
