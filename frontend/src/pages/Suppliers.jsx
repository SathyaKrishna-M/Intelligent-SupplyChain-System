import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { exportToCSV } from '../utils/export';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/suppliers');
      if (res.data) setSuppliers(res.data.data || res.data);
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'supplierId' },
    { header: 'Supplier Name', cell: (row) => <span className="font-medium text-slate-800">{row.supplierName}</span> },
    { header: 'Contact', accessor: 'contactInfo' },
    { header: 'Rating', cell: (row) => <span className="text-amber-500 font-medium">★ {row.rating}/5.0</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage vendor directory and performance ratings.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => exportToCSV(suppliers, 'Suppliers_Report')}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={18} className="mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={suppliers} keyField="supplierId" />
      )}
    </div>
  );
};

export default Suppliers;
