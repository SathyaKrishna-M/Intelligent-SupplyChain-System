import { useState, useEffect } from 'react';
import { Plus, Search, Download, Edit2 } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { exportToCSV } from '../utils/export';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({ supplierId: '', supplierName: '', contactInfo: '', rating: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSuppliers(currentPage);
  }, [currentPage]);

  const fetchSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/suppliers?page=${page}&limit=${limit}`);
      if (res.data) {
        setSuppliers(res.data.data || res.data);
        if (res.data?.meta) {
          setTotalPages(res.data.meta.totalPages);
          setTotalItems(res.data.meta.totalItems || 0);
          setCurrentPage(res.data.meta.currentPage || 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/suppliers/${currentSupplier.supplierId}`, currentSupplier);
      } else {
        await api.post('/suppliers', currentSupplier);
      }
      setIsModalOpen(false);
      fetchSuppliers(currentPage);
    } catch (error) {
      alert("Error saving supplier: " + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    { header: 'ID', accessor: 'supplierId' },
    { header: 'Supplier Name', cell: (row) => <span className="font-medium text-slate-800">{row.supplierName}</span> },
    { header: 'Contact', accessor: 'contactInfo' },
    { header: 'Rating', cell: (row) => <span className="text-amber-500 font-medium">★ {row.rating}/5.0</span> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-3 justify-end">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentSupplier(row); setIsEditing(true); setIsModalOpen(true); }}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const filtered = suppliers.filter(s => 
    s.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.supplierId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button 
            onClick={() => { setCurrentSupplier({ supplierId: '', supplierName: '', contactInfo: '', rating: 0 }); setIsEditing(false); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Add Supplier
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
            placeholder="Search Suppliers..."
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
          keyField="supplierId" 
          pagination={{ currentPage, totalPages, totalItems, itemsPerPage: limit }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Supplier" : "Add New Supplier"}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier ID</label>
            <input type="text" required disabled={isEditing} value={currentSupplier.supplierId} onChange={e => setCurrentSupplier({...currentSupplier, supplierId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border disabled:bg-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
            <input type="text" required value={currentSupplier.supplierName} onChange={e => setCurrentSupplier({...currentSupplier, supplierName: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
            <input type="text" required value={currentSupplier.contactInfo} onChange={e => setCurrentSupplier({...currentSupplier, contactInfo: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating (0-5)</label>
            <input type="number" step="0.1" min="0" max="5" required value={currentSupplier.rating} onChange={e => setCurrentSupplier({...currentSupplier, rating: parseFloat(e.target.value)})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
