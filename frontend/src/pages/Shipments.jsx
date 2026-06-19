import { useState, useEffect } from 'react';
import { Plus, Search, UserCheck, PackageCheck } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({ orderId: '', sourceWarehouseId: '', destinationWarehouseId: '' });

  useEffect(() => {
    fetchShipments(currentPage);
  }, [currentPage]);

  const fetchShipments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/shipments?page=${page}&limit=${limit}`);
      if (res.data) {
        setShipments(res.data.data || res.data);
        if (res.data?.meta) {
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

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shipments', shipmentForm);
      setIsModalOpen(false);
      setShipmentForm({ orderId: '', sourceWarehouseId: '', destinationWarehouseId: '' });
      fetchShipments(currentPage);
    } catch (error) {
      alert("Error creating shipment: " + (error.response?.data?.error || error.message));
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/shipments/${id}`, { action });
      fetchShipments(currentPage);
    } catch (error) {
      alert(`Error performing ${action}: ` + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    { header: 'Shipment ID', accessor: 'shipmentId' },
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'From (WH)', accessor: 'sourceWarehouseId' },
    { header: 'To (WH)', accessor: 'destinationWarehouseId' },
    { header: 'Driver ID', cell: (row) => row.driverId || <span className="text-slate-400 italic">Unassigned</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2 justify-end">
          {row.status === 'PENDING' && (
            <button onClick={(e) => { e.stopPropagation(); handleAction(row.shipmentId, 'assign'); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Assign Driver"><UserCheck size={16} /></button>
          )}
          {row.status === 'IN_TRANSIT' && (
            <button onClick={(e) => { e.stopPropagation(); handleAction(row.shipmentId, 'complete'); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Complete Delivery"><PackageCheck size={16} /></button>
          )}
        </div>
      )
    }
  ];

  const filtered = shipments.filter(s => 
    s.shipmentId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipment Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Live visibility into active shipments and transit network.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
            <Plus size={18} className="mr-2" />
            Create Shipment
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
            placeholder="Search Shipments..."
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
          keyField="shipmentId" 
          pagination={{ currentPage, totalPages, totalItems, itemsPerPage: limit }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dispatch Shipment">
        <form onSubmit={handleCreateShipment} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order ID</label>
            <input type="text" required placeholder="e.g. ORD-1234" value={shipmentForm.orderId} onChange={e => setShipmentForm({...shipmentForm, orderId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source WH</label>
              <input type="text" required placeholder="e.g. W001" value={shipmentForm.sourceWarehouseId} onChange={e => setShipmentForm({...shipmentForm, sourceWarehouseId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination WH</label>
              <input type="text" required placeholder="e.g. W002" value={shipmentForm.destinationWarehouseId} onChange={e => setShipmentForm({...shipmentForm, destinationWarehouseId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shipments;
