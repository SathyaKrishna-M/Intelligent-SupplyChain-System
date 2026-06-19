import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Download, X } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { exportToCSV } from '../utils/export';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ warehouseId: '', warehouseName: '', location: '', capacity: '' });
  const [submitError, setSubmitError] = useState('');

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

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      const payload = {
        warehouseId: formData.warehouseId,
        warehouseName: formData.warehouseName,
        location: formData.location,
        capacity: parseInt(formData.capacity) || 0
      };
      await api.post('/warehouses', payload);
      setIsModalOpen(false);
      setFormData({ warehouseId: '', warehouseName: '', location: '', capacity: '' });
      fetchWarehouses(); // Refresh list
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to add warehouse');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'warehouseId' },
    { header: 'Name', cell: (row) => <span className="font-medium text-slate-800 dark:text-slate-100">{row.warehouseName}</span> },
    { 
      header: 'Location', 
      cell: (row) => (
        <div className="flex items-center text-slate-500 dark:text-slate-400">
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
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

      {/* Add Warehouse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-800">Add New Warehouse</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddWarehouse} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {submitError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Warehouse ID</label>
                <input 
                  type="text" required
                  value={formData.warehouseId}
                  onChange={e => setFormData({...formData, warehouseId: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. W4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input 
                  type="text" required
                  value={formData.warehouseName}
                  onChange={e => setFormData({...formData, warehouseName: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Tokyo Logistics Center"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
                <input 
                  type="text" required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Tokyo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity</label>
                <input 
                  type="number" required min="1"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 15000"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
