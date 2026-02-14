import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';

const HTTPNode = ({ data }: NodeProps) => {
  const { label, url, method } = data as any;

  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 shadow-md min-w-[220px]">
      <div className="bg-blue-500 text-white p-2 rounded-t-md flex items-center text-sm font-semibold">
        <Globe className="w-4 h-4 mr-2" />
        HTTP Request
      </div>
      
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">
            {method || 'GET'}
          </span>
          <span className="text-sm text-gray-800 font-medium truncate w-32" title={label || 'API Call'}>
            {label || 'API Call'}
          </span>
        </div>
        
        <div className="text-xs text-gray-500 font-mono truncate bg-gray-50 p-1.5 rounded border border-gray-100">
          {url || 'https://api.example.com/...'}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default memo(HTTPNode);
