import { useState, useRef, useEffect, PointerEvent } from 'react';
import { Router, Server, Laptop, Cloud, Shield, Database, Trash2, Plus, Download, Undo, Redo, MousePointer2, Share2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NodeType = 'Router' | 'Switch' | 'PC' | 'Server' | 'Firewall' | 'Cloud' | 'Database';

interface Node {
  id: string;
  type: NodeType;
  name: string;
  ip?: string;
  x: number;
  y: number;
}

interface Link {
  id: string;
  from: string;
  to: string;
}

export default function TopologyViewer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', type: 'Cloud', name: 'Internet', x: 400, y: 50 },
    { id: '2', type: 'Firewall', name: 'Gateway', x: 400, y: 150 },
    { id: '3', type: 'Router', name: 'Main Router', x: 400, y: 250 },
  ]);
  const [links, setLinks] = useState<Link[]>([
    { id: 'l1', from: '1', to: '2' },
    { id: 'l2', from: '2', to: '3' },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const handlePointerDown = (e: PointerEvent, id: string) => {
    e.stopPropagation();
    if (connectingFrom) {
      if (connectingFrom !== id) {
        setLinks([...links, { id: `l-${Date.now()}`, from: connectingFrom, to: id }]);
      }
      setConnectingFrom(null);
    } else {
      setIsDragging(id);
      setSelectedNode(id);
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setNodes(nodes.map(n => n.id === isDragging ? { ...n, x, y } : n));
    }
  };

  const handlePointerUp = () => {
    setIsDragging(null);
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes(nodes.filter(n => n.id !== selectedNode));
      setLinks(links.filter(l => l.from !== selectedNode && l.to !== selectedNode));
      setSelectedNode(null);
    }
  };

  const downloadPNG = () => {
    alert('Feature in development. Use screen capture for now.');
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'Router': return <Router className="w-6 h-6" />;
      case 'Server': return <Server className="w-6 h-6" />;
      case 'PC': return <Laptop className="w-6 h-6" />;
      case 'Cloud': return <Cloud className="w-6 h-6" />;
      case 'Firewall': return <Shield className="w-6 h-6" />;
      case 'Database': return <Database className="w-6 h-6" />;
      default: return <Plus className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[700px] gap-4">
      {/* Sidebar Toolset */}
      <div className="lg:w-64 space-y-4 flex flex-col">
        <div className="tool-card p-4 space-y-4 flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Components</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['Router', 'Firewall', 'Server', 'PC', 'Database', 'Cloud'] as NodeType[]).map(type => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-network-teal transition-all text-slate-500 hover:text-network-teal"
              >
                {getNodeIcon(type)}
                <span className="text-[10px] mt-1 font-medium">{type}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Actions</h3>
            <button
              onClick={() => setConnectingFrom(selectedNode)}
              disabled={!selectedNode}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                connectingFrom
                  ? 'bg-network-teal text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-50'
              }`}
            >
              <Share2 className="w-4 h-4" /> {connectingFrom ? 'Click Target Node' : 'Connect Nodes'}
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedNode}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-sm hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete Item
            </button>
          </div>
        </div>

        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="tool-card p-4 space-y-4"
          >
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Node Properties</h3>
             <div className="space-y-3">
               <div>
                 <label className="text-[10px] text-slate-400 uppercase">Hostname</label>
                 <input
                   type="text"
                   className="input-field py-1 text-sm"
                   value={nodes.find(n => n.id === selectedNode)?.name || ''}
                   onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, name: e.target.value } : n))}
                 />
               </div>
               <div>
                 <label className="text-[10px] text-slate-400 uppercase">IP Address</label>
                 <input
                   type="text"
                   className="input-field py-1 text-sm font-mono"
                   value={nodes.find(n => n.id === selectedNode)?.ip || ''}
                   onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, ip: e.target.value } : n))}
                   placeholder="192.168.1.1"
                 />
               </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative tool-card bg-slate-50 dark:bg-[#0a0c14] overflow-hidden" ref={containerRef}>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button onClick={downloadPNG} className="p-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-lg shadow-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar Info */}
        <div className="absolute bottom-4 left-4 flex gap-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-white/80 dark:bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
          <span className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3" /> Drag to move</span>
          <span className="flex items-center gap-1.5"><Share2 className="w-3 h-3" /> Select + Connect to link</span>
        </div>

        <svg
          className="w-full h-full cursor-crosshair touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-white/5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Links */}
          {links.map(link => {
            const fromNode = nodes.find(n => n.id === link.from);
            const toNode = nodes.find(n => n.id === link.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={link.id}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-300 dark:text-white/20"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.x - 30}, ${node.y - 30})`}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              className="cursor-move group"
            >
              <rect
                width="60"
                height="60"
                rx="12"
                className={`transition-all duration-200 ${
                  selectedNode === node.id
                    ? 'fill-network-teal/10 stroke-network-teal stroke-2 shadow-lg'
                    : 'fill-white dark:fill-surface-dark stroke-slate-200 dark:stroke-white/10'
                }`}
              />
              <foreignObject width="60" height="60">
                <div className="w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-network-teal">
                  {getNodeIcon(node.type)}
                </div>
              </foreignObject>
              <text
                x="30"
                y="80"
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-wider"
              >
                {node.name}
              </text>
              {node.ip && (
                <text
                  x="30"
                  y="92"
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-network-blue opacity-80"
                >
                  {node.ip}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
