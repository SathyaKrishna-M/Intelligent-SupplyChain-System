import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({ columns, data, keyField = 'id', onRowClick, emptyMessage = "No data available" }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col transition-colors duration-300 max-h-[600px]">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 relative border-collapse">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-300 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            <AnimatePresence>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3 shadow-inner">
                        <Inbox size={32} className="opacity-50" />
                      </div>
                      <p className="text-sm font-semibold">{emptyMessage}</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.03, duration: 0.2 }}
                    key={row[keyField] || rowIndex} 
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 group ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={`px-6 py-4 whitespace-nowrap ${colIndex === 0 ? 'font-medium text-slate-800 dark:text-slate-100' : ''}`}>
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Simple Pagination Placeholder */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Showing <span className="text-slate-700 dark:text-slate-200">1</span> to <span className="text-slate-700 dark:text-slate-200">{data.length}</span> of <span className="text-slate-700 dark:text-slate-200">{data.length}</span> entries
        </span>
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
