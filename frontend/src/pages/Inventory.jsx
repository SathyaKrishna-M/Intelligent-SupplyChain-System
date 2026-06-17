import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, Search, Download } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { exportToCSV } from '../utils/export';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ productId: '', name: '', category: '', stockQuantity: 0, costPrice: 0, sellingPrice: 0, supplierId: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      const d = res.data?.data || res.data;
      if (d && Array.isArray(d)) {
        setProducts(d);
        setLowStock(d.filter(p => p.stockQuantity <= 50));
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${currentProduct.productId}`, currentProduct);
      } else {
        await api.post('/products', currentProduct);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const columns = [
    { header: 'Product ID', accessor: 'productId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { 
      header: 'Stock', 
      cell: (row) => (
        <span className={`font-semibold ${row.stockQuantity <= 50 ? 'text-red-600' : 'text-slate-700'}`}>
          {row.stockQuantity}
        </span>
      )
    },
    { header: 'Price', cell: (row) => `$${row.sellingPrice?.toFixed(2)}` },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-3">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentProduct(row); setIsEditing(true); setIsModalOpen(true); }}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row.productId); }}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.productId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your product catalog, stock levels, and pricing.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => exportToCSV(products, 'Inventory_Report')}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => { setCurrentProduct({ productId: '', name: '', category: '', stockQuantity: 0, costPrice: 0, sellingPrice: 0, supplierId: '' }); setIsEditing(false); setIsModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start shadow-sm">
          <AlertTriangle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Low Stock Alerts ({lowStock.length})</h3>
            <p className="text-sm text-amber-700 mt-1">You have products running below the safe threshold of 50 units. Please check reorder suggestions.</p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2 border bg-slate-50"
            placeholder="Search by ID or Name..."
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
        <DataTable columns={columns} data={filteredProducts} keyField="productId" />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product ID</label>
            <input type="text" required disabled={isEditing} value={currentProduct.productId} onChange={e => setCurrentProduct({...currentProduct, productId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border disabled:bg-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input type="text" value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supplier ID</label>
              <input type="text" value={currentProduct.supplierId} onChange={e => setCurrentProduct({...currentProduct, supplierId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price ($)</label>
              <input type="number" step="0.01" required value={currentProduct.costPrice} onChange={e => setCurrentProduct({...currentProduct, costPrice: parseFloat(e.target.value)})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
              <input type="number" step="0.01" required value={currentProduct.sellingPrice} onChange={e => setCurrentProduct({...currentProduct, sellingPrice: parseFloat(e.target.value)})} className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;
