import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Download } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { exportToCSV } from '../utils/export';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/warehouses');
      if (res.data) setWarehouses(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'warehouseId' },
    { header: 'Name', cell: (row) => <span className="font-medium text-slate-800">{row.warehouseName}</span> },
    { 
      header: 'Location', 
      cell: (row) => (
        <div className="flex items-center text-slate-500">
          <MapPin size={16} className="mr-1" />
          {row.location}
        </div>
      ) 
    },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Manager ID', accessor: 'managerId' },
  ];

  const filtered = warehouses.filter(w => 
    w.warehouseName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.warehouseId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouses</h1>
          <p className="text-sm text-slate-500 mt-1">Manage locations, capacity, and assignments.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => exportToCSV(warehouses, 'Warehouses_Report')}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={18} className="mr-2" />
            Add Warehouse
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border bg-slate-50"
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} keyField="warehouseId" />
      )}
    </div>
  );
};

export default Warehouses;
