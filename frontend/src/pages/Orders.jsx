import { useState, useEffect } from 'react';
import { Plus, Search, Download, CheckCircle, XCircle, Truck, PackageCheck, Clock } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { exportToCSV } from '../utils/export';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Form Data Lookups
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    supplierId: '', warehouseId: '', orderDate: new Date().toISOString().split('T')[0], deliveryDate: '',
    productId: '', quantity: 100, unitPrice: 10.0
  });

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Load lookup data for form
    api.get('/suppliers?limit=100').then(res => setSuppliers(res.data?.data || res.data)).catch(console.error);
    api.get('/warehouses').then(res => setWarehouses(res.data?.data || res.data)).catch(console.error);
  }, []);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/orders?page=${page}&limit=${limit}`);
      if (res.data) {
        setOrders(res.data.data || res.data);
        if (res.data.meta) {
          setTotalPages(res.data.meta.totalPages);
          setTotalItems(res.data.meta.totalItems || 0);
          setCurrentPage(res.data.meta.currentPage || 1);
        }
      }
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        supplierId: orderForm.supplierId,
        warehouseId: orderForm.warehouseId,
        orderDate: orderForm.orderDate,
        deliveryDate: orderForm.deliveryDate,
        items: [{
          productId: orderForm.productId,
          quantity: Number(orderForm.quantity),
          unitPrice: Number(orderForm.unitPrice)
        }]
      };
      await api.post('/orders', payload);
      setIsModalOpen(false);
      fetchOrders(currentPage);
    } catch (error) {
      alert("Error creating order: " + (error.response?.data?.error || error.message));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      fetchOrders(currentPage);
    } catch (error) {
      alert("Error updating order: " + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Supplier ID', accessor: 'supplierId' },
    { header: 'Warehouse ID', accessor: 'warehouseId' },
    { header: 'Order Date', accessor: 'orderDate' },
    { header: 'Total Cost', cell: (row) => `$${row.totalCost?.toFixed(2)}` },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2 justify-end">
          {row.status === 'PENDING' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); updateStatus(row.orderId, 'APPROVED'); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Approve"><CheckCircle size={16} /></button>
              <button onClick={(e) => { e.stopPropagation(); updateStatus(row.orderId, 'REJECTED'); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject"><XCircle size={16} /></button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <button onClick={(e) => { e.stopPropagation(); updateStatus(row.orderId, 'PROCESSING'); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Start Processing"><Clock size={16} /></button>
          )}
          {row.status === 'PROCESSING' && (
            <button onClick={(e) => { e.stopPropagation(); updateStatus(row.orderId, 'SHIPPED'); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Mark Shipped"><Truck size={16} /></button>
          )}
          {row.status === 'SHIPPED' && (
            <button onClick={(e) => { e.stopPropagation(); updateStatus(row.orderId, 'DELIVERED'); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Mark Delivered"><PackageCheck size={16} /></button>
          )}
        </div>
      )
    }
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
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
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
        <DataTable 
          columns={columns} 
          data={filtered} 
          keyField="orderId" 
          pagination={{ currentPage, totalPages, totalItems, itemsPerPage: limit }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
        <form onSubmit={handleCreateOrder} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
              <select required value={orderForm.supplierId} onChange={e => setOrderForm({...orderForm, supplierId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border">
                <option value="">Select...</option>
                {suppliers.map(s => <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Warehouse</label>
              <select required value={orderForm.warehouseId} onChange={e => setOrderForm({...orderForm, warehouseId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border">
                <option value="">Select...</option>
                {warehouses.map(w => <option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Order Date</label>
              <input type="date" required value={orderForm.orderDate} onChange={e => setOrderForm({...orderForm, orderDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
              <input type="date" required value={orderForm.deliveryDate} onChange={e => setOrderForm({...orderForm, deliveryDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase">Order Item</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product ID</label>
              <input type="text" required placeholder="e.g. P1001" value={orderForm.productId} onChange={e => setOrderForm({...orderForm, productId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input type="number" min="1" required value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                <input type="number" step="0.01" min="0.01" required value={orderForm.unitPrice} onChange={e => setOrderForm({...orderForm, unitPrice: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Create Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
