import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Warehouse as WarehouseIcon } from 'lucide-react';

const CustomNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-2xl rounded-2xl bg-slate-800 border-2 transition-all duration-300 min-w-[180px] ${selected ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'border-slate-600 hover:border-slate-500'}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-slate-400 border-none" />
      
      {/* For multiple incoming/outgoing connections, it's often better to just have them connect to the node border, but React Flow needs handles. */}
      {/* We can add handles on all sides to make routing look better */}
      <Handle type="target" position={Position.Left} id="left-target" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right-source" className="opacity-0" />
      <Handle type="target" position={Position.Right} id="right-target" className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left-source" className="opacity-0" />

      <div className="flex items-center mb-3 border-b border-slate-700 pb-2">
        <div className={`p-2 rounded-lg mr-3 ${data.isPath ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
          <WarehouseIcon size={18} />
        </div>
        <div className="font-bold text-slate-100 text-sm tracking-wide">{data.label}</div>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Inventory:</span>
          <span className="text-slate-200 font-semibold bg-slate-900 px-2 py-0.5 rounded">{data.inventory || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Status:</span>
          <span className="text-emerald-400 font-bold tracking-wider text-[10px] uppercase">{data.status || 'Active'}</span>
        </div>
      </div>
      
      {/* Glowing overlay if it's part of the shortest path */}
      {data.isPath && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] pointer-events-none animate-pulse"></div>
      )}
    </div>
  );
};

export default memo(CustomNode);
