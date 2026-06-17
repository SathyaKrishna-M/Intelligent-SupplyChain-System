import { Code, GitBranch, Layers, Zap, CheckCircle2 } from 'lucide-react';

const AboutSystem = () => {
  const dsaStructures = [
    { name: 'AVL Tree', use: 'Indexes products by Name for O(log N) fast lookups and exact match prefixing.' },
    { name: 'Binary Search Tree', use: 'Indexes products by ID. Foundational structure for sequential ID lookups.' },
    { name: 'B-Tree', use: 'High-performance disk-friendly indexing for massive Order datasets. Minimizes I/O.' },
    { name: 'Segment Tree', use: 'O(log N) range queries for Inventory analytics (Max/Min stock levels across warehouse ranges).' },
    { name: 'Fenwick Tree (BIT)', use: 'O(log N) prefix sum queries for real-time Revenue calculations over date ranges.' },
    { name: 'Adjacency List Graph', use: 'Models the entire Logistics Network (Warehouses as Nodes, Routes as Edges).' },
    { name: 'Priority Queue (Min-Heap)', use: 'Core component driving Dijkstra\'s Algorithm for greedy shortest-path extraction.' }
  ];

  const algorithms = [
    { name: 'Dijkstra\'s Shortest Path', use: 'Calculates the most cost-effective and shortest distance route between Source and Destination warehouses.' },
    { name: 'Simple Moving Average (SMA)', use: 'Powers the Demand Forecasting module to predict necessary stock reorders based on historical sales velocity.' },
    { name: 'In-order Traversal', use: 'Used across all tree structures to generate sorted tabular views of data for the frontend.' },
    { name: 'Tree Rotations (LL, RR, LR, RL)', use: 'Maintains strict O(log N) height balancing within the Product AVL Tree during heavy inserts/deletes.' }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Architecture & DSA</h1>
          <p className="text-sm text-slate-500 mt-1">Evaluation cheat sheet detailing core algorithmic implementations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center bg-blue-50/50">
            <Layers className="text-blue-500 mr-3" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Custom Data Structures ({dsaStructures.length})</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-5">
              {dsaStructures.map((dsa, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 size={18} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{dsa.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{dsa.use}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center bg-purple-50/50">
            <Zap className="text-purple-500 mr-3" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Core Algorithms ({algorithms.length})</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-5">
              {algorithms.map((algo, idx) => (
                <li key={idx} className="flex items-start">
                  <GitBranch size={18} className="text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{algo.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{algo.use}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-xl p-8 text-white mt-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <Code className="text-blue-400 mr-3" size={28} />
            <h2 className="text-xl font-bold">Tech Stack</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-6">
            This project completely bypasses external enterprise libraries (No Spring Boot, No Hibernate, No MySQL). 
            Every single Data Structure is built from scratch in pure Core Java 17, implementing custom memory models and file-based persistence. 
            The Frontend is powered by React 18 and Tailwind CSS, fetching data via a custom lightweight Java HTTP API Server.
          </p>
          <div className="flex space-x-4">
             <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700">Java 17</span>
             <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700">React 18</span>
             <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700">Tailwind CSS</span>
             <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700">Custom API Server</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;
