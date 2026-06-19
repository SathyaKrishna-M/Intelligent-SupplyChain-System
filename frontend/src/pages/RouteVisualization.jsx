import React, { useState, useEffect, useRef, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, Box, Share2, Map, Zap, Database, RotateCcw, Play, 
  MapPin, CheckCircle, AlertTriangle, Truck, Info, Settings, Compass, RefreshCw, Plus, X
} from 'lucide-react';
import api from '../services/api';

// No need to register dagre, using built-in concentric layout

export default function RouteVisualization() {
  const cyRef = useRef(null);
  
  // Data States
  const [warehouses, setWarehouses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [elements, setElements] = useState([]);
  
  // Selection & UI States
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [dijkstraResult, setDijkstraResult] = useState(null);
  
  // Add Route Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routeForm, setRouteForm] = useState({ src: '', dest: '', distance: 100, cost: 50 });
  const [addError, setAddError] = useState('');
  
  // Stats
  const stats = useMemo(() => {
    return {
      totalWarehouses: warehouses.length,
      totalRoutes: routes.length,
      avgDistance: routes.length ? (routes.reduce((acc, r) => acc + r.distance, 0) / routes.length).toFixed(1) : 0,
      longestRoute: routes.length ? Math.max(...routes.map(r => r.distance)) : 0,
      shortestRoute: routes.length ? Math.min(...routes.map(r => r.distance)) : 0,
    };
  }, [warehouses, routes]);

  // Stylesheet
  const cyStylesheet = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'shape': 'ellipse',
        'width': 45,
        'height': 45,
        'background-color': '#1e293b',
        'border-width': 4,
        'border-color': 'data(statusColor)',
        'color': '#f8fafc',
        'font-size': 12,
        'font-family': 'Inter, sans-serif',
        'font-weight': 'bold',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 10,
        'text-background-color': '#0f172a',
        'text-background-opacity': 0.8,
        'text-background-padding': 4,
        'text-background-shape': 'roundrectangle',
        'underlay-shape': 'ellipse',
        'underlay-padding': 20,
        'underlay-color': 'data(statusColor)',
        'underlay-opacity': 0.4,
        'transition-property': 'background-color, underlay-padding, underlay-opacity, width, height',
        'transition-duration': 300
      }
    },
    {
      selector: 'node:selected',
      style: {
        'width': 55,
        'height': 55,
        'underlay-padding': 30,
        'underlay-opacity': 0.8,
        'border-color': '#38bdf8',
        'underlay-color': '#38bdf8'
      }
    },
    {
      selector: 'node.path-node',
      style: {
        'border-color': '#10b981',
        'underlay-color': '#10b981',
        'underlay-padding': 40,
        'underlay-opacity': 0.9,
        'width': 50,
        'height': 50
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 5,
        'line-color': '#334155',
        'curve-style': 'bezier',
        'control-point-step-size': 60,
        'target-arrow-shape': 'none',
        'label': 'data(distanceLabel)',
        'font-size': 10,
        'font-weight': 'bold',
        'color': '#94a3b8',
        'text-background-color': '#0f172a',
        'text-background-opacity': 1,
        'text-background-padding': 3,
        'text-background-shape': 'roundrectangle',
        'transition-property': 'line-color, target-arrow-color, width, underlay-padding',
        'transition-duration': 300,
        'arrow-scale': 1.2
      }
    },
    {
      selector: 'edge:selected',
      style: {
        'width': 8,
        'line-color': '#38bdf8',
        'color': '#38bdf8',
        'z-index': 10
      }
    },
    {
      selector: 'edge.path-edge',
      style: {
        'width': 9,
        'line-color': '#10b981',
        'color': '#10b981',
        'underlay-padding': 10,
        'underlay-color': '#10b981',
        'underlay-opacity': 0.8,
        'z-index': 20
      }
    }
  ];

  // Data Fetching
  useEffect(() => {
    const loadGraph = async () => {
      try {
        const [whRes, rtRes] = await Promise.all([
          api.get('/warehouses'),
          api.get('/routes')
        ]);
        
        const wData = Array.isArray(whRes.data?.data) ? whRes.data.data : (Array.isArray(whRes.data) ? whRes.data : []);
        const rData = Array.isArray(rtRes.data?.data) ? rtRes.data.data : (Array.isArray(rtRes.data) ? rtRes.data : []);
        
        setWarehouses(wData);
        setRoutes(rData);
        
        const newElements = [];
        
        // Nodes
        const validWarehouseIds = new Set();
        wData.forEach(w => {
          validWarehouseIds.add(w.warehouseId);
          let statusColor = '#10b981'; // Green Active
          let status = 'ACTIVE';
          if (w.capacity < 1000) { statusColor = '#ef4444'; status = 'CRITICAL'; }
          else if (w.capacity < 5000) { statusColor = '#f59e0b'; status = 'LOW STOCK'; }
          
          newElements.push({
            group: 'nodes',
            data: {
              id: w.warehouseId,
              label: w.warehouseName,
              inventory: w.capacity,
              location: w.location,
              status,
              statusColor
            }
          });
        });
        
        // Edges
        rData.forEach(r => {
          // Crash Protection: Ignore corrupted routes pointing to deleted or nonexistent warehouses
          if (!validWarehouseIds.has(r.sourceWarehouseId) || !validWarehouseIds.has(r.destinationWarehouseId)) {
            console.warn(`Skipping corrupted edge: ${r.sourceWarehouseId} -> ${r.destinationWarehouseId}`);
            return;
          }

          const distKm = r.distance >= 1000 ? `${(r.distance/1000).toFixed(2)}k km` : `${r.distance} km`;
          // Primary Edge
          newElements.push({
            group: 'edges',
            data: {
              id: r.routeId || `${r.sourceWarehouseId}-${r.destinationWarehouseId}`,
              source: r.sourceWarehouseId,
              target: r.destinationWarehouseId,
              distance: r.distance,
              distanceLabel: distKm,
              cost: r.transportCost
            }
          });
        });
        
        setElements(newElements);
      } catch(e) {
        console.error(e);
      }
    };
    loadGraph();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setAddError('');
    if (routeForm.src === routeForm.dest) {
      setAddError("Source and Destination cannot be the same.");
      return;
    }
    try {
      const payload = {
        sourceWarehouseId: routeForm.src,
        destinationWarehouseId: routeForm.dest,
        distance: Number(routeForm.distance),
        transportCost: Number(routeForm.cost)
      };
      await api.post('/routes', payload);
      setIsAddModalOpen(false);
      setRouteForm({ src: '', dest: '', distance: 100, cost: 50 });
      // Full refresh to rebuild graph
      window.location.reload(); 
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add route");
    }
  };

  // Cytoscape Event Binding
  const handleCy = (cy) => {
    cyRef.current = cy;
    
    // Smooth zoom and pan bindings
    cy.on('tap', 'node', (evt) => {
      setSelectedNode(evt.target.data());
      setSelectedEdge(null);
    });
    
    cy.on('tap', 'edge', (evt) => {
      setSelectedEdge(evt.target.data());
      setSelectedNode(null);
    });
    
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    // Hover effects
    cy.on('mouseover', 'node', (e) => {
      document.body.style.cursor = 'pointer';
      if(!e.target.selected()) {
        e.target.style({'underlay-opacity': 0.8, 'underlay-padding': 25});
      }
    });
    cy.on('mouseout', 'node', (e) => {
      document.body.style.cursor = 'default';
      if(!e.target.selected() && !e.target.hasClass('path-node')) {
        e.target.style({'underlay-opacity': 0.4, 'underlay-padding': 20});
      }
    });
  };

  const resetPath = () => {
    if (!cyRef.current) return;
    cyRef.current.elements().removeClass('path-node path-edge');
    setDijkstraResult(null);
    setSelectedNode(null);
    setSelectedEdge(null);
    cyRef.current.fit(cyRef.current.elements(), 50);
  };

  const calculateShortestPath = async () => {
    if (!source || !destination || source === destination) return;
    setIsCalculating(true);
    resetPath();
    
    try {
      const res = await api.get(`/routes/shortest?sourceWarehouseId=${source}&destinationWarehouseId=${destination}`);
      const data = res.data?.data || res.data;
      
      if (data && data.path) {
        setDijkstraResult(data);
        const cy = cyRef.current;
        
        // Highlight nodes
        data.path.forEach(nodeId => {
          cy.getElementById(nodeId).addClass('path-node');
        });
        
        // Highlight edges
        const pathEdges = [];
        for (let i=0; i<data.path.length-1; i++) {
          const s = data.path[i];
          const t = data.path[i+1];
          // Find edge matching this undirected pair
          const edge = cy.edges(`[source="${s}"][target="${t}"], [source="${t}"][target="${s}"]`);
          if (edge.length > 0) {
            edge.addClass('path-edge');
            pathEdges.push(edge);
          }
        }
        
        // Animate Pan & Zoom to the path
        const pathElements = cy.collection().add(cy.nodes('.path-node')).add(cy.edges('.path-edge'));
        cy.animate({
          fit: { eles: pathElements, padding: 80 },
          duration: 1000,
          easing: 'ease-in-out-cubic'
        });
      }
    } catch(e) {
      console.error(e);
      alert("No path found between these hubs.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col -m-6 rounded-tl-3xl overflow-hidden bg-[#020617] text-slate-200 font-sans border-l border-t border-slate-800">
      
      {/* Top Header */}
      <div className="bg-[#0b1120] border-b border-slate-800 p-4 flex items-center justify-between shadow-lg relative z-20">
        <div className="flex items-center">
          <div className="bg-blue-500/20 p-2 rounded-lg mr-3 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Compass className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Logistics Command Center</h1>
            <p className="text-xs text-slate-400 font-medium">Cytoscape.js • Advanced Supply Chain Routing Matrix</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-xs font-semibold tracking-wider text-slate-400">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_#10b981]"></span> ACTIVE</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-[0_0_8px_#f59e0b]"></span> LOW STOCK</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_#e11d48]"></span> CRITICAL</div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors"
          >
            <Plus size={14} className="mr-1" /> Add Route
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar */}
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-80 bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-10 shadow-2xl overflow-y-auto custom-scrollbar"
        >
          {/* Form */}
          <div className="p-6 border-b border-slate-800/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center">
              <MapPin size={16} className="mr-2 text-blue-500" /> Route Matrix
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Origin Hub</label>
                <select 
                  value={source} onChange={e=>setSource(e.target.value)}
                  className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                >
                  <option value="">Select Origin...</option>
                  {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Destination Hub</label>
                <select 
                  value={destination} onChange={e=>setDestination(e.target.value)}
                  className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                >
                  <option value="">Select Destination...</option>
                  {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName}</option>)}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={calculateShortestPath}
                  disabled={!source || !destination || isCalculating}
                  className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 disabled:opacity-50 disabled:grayscale text-white font-bold py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex justify-center items-center"
                >
                  {isCalculating ? <RefreshCw className="animate-spin mr-2" size={16}/> : <Play className="fill-current mr-2" size={16} />}
                  Find Route
                </button>
                <button onClick={resetPath} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors">
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border-b border-slate-800/50 bg-[#0b1120]/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-5 flex items-center">
              <Database size={16} className="mr-2 text-indigo-500" /> Network Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-slate-700/30 group-hover:text-indigo-500/20 transition-colors"><Box size={60}/></div>
                <div className="text-2xl font-black text-white relative z-10">{stats.totalWarehouses}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">Hubs</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800/50 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-slate-700/30 group-hover:text-amber-500/20 transition-colors"><Share2 size={60}/></div>
                <div className="text-2xl font-black text-white relative z-10">{stats.totalRoutes}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">Routes</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-800/50 col-span-2 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Distance</div>
                  <div className="text-lg font-bold text-slate-200">{stats.avgDistance} km</div>
                </div>
                <Map size={24} className="text-slate-600" />
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="p-6 mt-auto">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-indigo-300">
              <div className="flex items-center font-bold text-sm mb-2 text-indigo-400">
                <Zap size={16} className="mr-2 fill-current" /> Algorithms Used
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                Routing uses <strong>Dijkstra's Algorithm</strong> operating on an Adjacency Matrix representing the active graph topology.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Center Canvas */}
        <div className="flex-1 relative bg-grid-pattern overflow-hidden">
          {/* Subtle Grid Background CSS inside Tailwind via class or inline */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', 
            backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none' 
          }}></div>
          
          {elements.length > 0 ? (
            <CytoscapeComponent
              elements={elements}
              stylesheet={cyStylesheet}
              style={{ width: '100%', height: '100%' }}
              layout={{ 
                name: 'concentric', 
                fit: true, 
                padding: 100,
                spacingFactor: 1.5,
                nodeDimensionsIncludeLabels: true,
                minNodeSpacing: 40
              }}
              cy={(cy) => handleCy(cy)}
              minZoom={0.3}
              maxZoom={2}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#0f172a]/80 backdrop-blur border border-slate-800 p-8 rounded-3xl text-center shadow-2xl">
                <RefreshCw className="animate-spin text-slate-600 mx-auto mb-4" size={32} />
                <h3 className="text-slate-300 font-bold">Initializing Matrix...</h3>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Contextual) */}
        <AnimatePresence>
          {(selectedNode || selectedEdge || dijkstraResult) && (
            <motion.div 
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-800 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 absolute right-0 top-0 bottom-0"
            >
              <div className="p-5 border-b border-slate-800/50 flex items-center justify-between bg-[#0b1120]/80">
                <h2 className="font-bold text-white flex items-center text-sm">
                  <Info size={16} className="mr-2 text-blue-500" /> Details
                </h2>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                
                {dijkstraResult && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center">
                      <CheckCircle size={14} className="mr-2" /> Shortest Path
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total Distance</div>
                        <div className="text-2xl font-black text-white">{dijkstraResult.distance.toFixed(1)} km</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Est. Transport Cost</div>
                        <div className="text-lg font-bold text-emerald-300">${dijkstraResult.cost.toFixed(2)}</div>
                      </div>
                      
                      <div className="pt-3 border-t border-emerald-500/20">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Routing Sequence</div>
                        <div className="bg-[#0b1120] p-3 rounded-lg border border-emerald-500/20 text-xs font-mono text-emerald-400 leading-relaxed shadow-inner">
                          {dijkstraResult.path.map((p, i) => (
                            <span key={i}>
                              {p}
                              {i < dijkstraResult.path.length-1 && <span className="text-slate-600 mx-2">→</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode && (
                  <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-5 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-slate-800 p-2.5 rounded-xl mr-3 shadow-inner">
                        <Box size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base leading-tight">{selectedNode.label}</h3>
                        <p className="text-slate-400 text-xs font-medium">{selectedNode.id}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-3 border-t border-slate-700/50">
                      <div className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventory</span>
                        <span className="text-sm font-black text-white">{selectedNode.inventory} <span className="text-slate-500 text-xs font-medium">units</span></span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm" style={{ backgroundColor: selectedNode.statusColor + '20', color: selectedNode.statusColor, border: `1px solid ${selectedNode.statusColor}40` }}>
                          {selectedNode.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</span>
                        <span className="text-sm font-semibold text-slate-300">{selectedNode.location || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEdge && (
                  <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-5 shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-slate-800 p-2.5 rounded-xl mr-3 shadow-inner">
                        <Share2 size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base leading-tight">Route Segment</h3>
                        <p className="text-slate-400 text-xs font-medium uppercase">{selectedEdge.source} → {selectedEdge.target}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-3 border-t border-slate-700/50">
                      <div className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distance</span>
                        <span className="text-sm font-black text-white">{selectedEdge.distanceLabel}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base Cost</span>
                        <span className="text-sm font-black text-emerald-400">${selectedEdge.cost?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Add Route Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#0f172a] rounded-xl shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0b1120]">
              <h2 className="font-bold text-lg text-white flex items-center">
                <Share2 size={18} className="mr-2 text-indigo-400" /> Create Network Link
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddRoute} className="p-6 space-y-4 text-slate-200">
              {addError && (
                <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                  {addError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source Hub</label>
                  <select 
                    required value={routeForm.src} onChange={e => setRouteForm({...routeForm, src: e.target.value})}
                    className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName} ({w.warehouseId})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dest Hub</label>
                  <select 
                    required value={routeForm.dest} onChange={e => setRouteForm({...routeForm, dest: e.target.value})}
                    className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select...</option>
                    {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName} ({w.warehouseId})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Distance (km)</label>
                  <input 
                    type="number" required min="1" value={routeForm.distance} onChange={e => setRouteForm({...routeForm, distance: e.target.value})}
                    className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Cost ($)</label>
                  <input 
                    type="number" required min="1" value={routeForm.cost} onChange={e => setRouteForm({...routeForm, cost: e.target.value})}
                    className="w-full bg-[#1e293b] text-sm text-slate-200 border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">Link Hubs</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
