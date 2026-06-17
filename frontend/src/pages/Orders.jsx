import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { exportToCSV } from '../utils/export';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data) setOrders(res.data.data || res.data);
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Supplier ID', accessor: 'supplierId' },
    { header: 'Warehouse ID', accessor: 'warehouseId' },
    { header: 'Order Date', accessor: 'orderDate' },
    { header: 'Total Cost', cell: (row) => `$${row.totalCost?.toFixed(2)}` },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  const filtered = orders.filter(o => 
    o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.supplierId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage procurement orders.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => exportToCSV(orders, 'Orders_Report')}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={18} className="mr-2" />
            Create Order
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
            placeholder="Search Orders..."
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
        <DataTable columns={columns} data={filtered} keyField="orderId" />
      )}
    </div>
  );
};

export default Orders;
