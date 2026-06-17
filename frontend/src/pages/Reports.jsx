import { FileText, Download } from 'lucide-react';
import api from '../services/api';

const Reports = () => {

  const handleGenerate = async () => {
    try {
      await api.get('/stats/generate-reports'); // Mocking the endpoint that hits ReportService.java
      alert('Report successfully generated in the backend /reports directory!');
    } catch (e) {
      alert('Failed to trigger report generation.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download official analytics reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <FileText size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Executive Data Export</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Compile all data from Warehouses, Inventory, Orders, and Finances into a comprehensive snapshot document.
        </p>
        <button 
          onClick={handleGenerate}
          className="mt-8 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-lg"
        >
          <Download size={20} className="mr-3" />
          Generate Report to Server
        </button>
      </div>
    </div>
  );
};

export default Reports;
