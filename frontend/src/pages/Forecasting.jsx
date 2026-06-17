import { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import api from '../services/api';

const Forecasting = () => {
  const [productId, setProductId] = useState('');
  const [forecast, setForecast] = useState(null);

  const handleForecast = async (e) => {
    e.preventDefault();
    if (!productId) return;
    
    try {
      // Mock forecast result
      setForecast({
        id: productId,
        predictedDemand: Math.floor(Math.random() * 500) + 50,
        currentStock: Math.floor(Math.random() * 200),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demand Forecasting</h1>
          <p className="text-sm text-slate-500 mt-1">Predictive analytics for smart reordering.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <form onSubmit={handleForecast} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter Product ID to forecast..." 
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-lg py-2.5 px-4 border bg-slate-50"
            />
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Run Forecast
            </button>
          </form>
        </div>

        {forecast && (
          <div className="p-6 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Lightbulb size={20} className="text-amber-500 mr-2" />
              Forecast Results for {forecast.id}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
                <p className="text-sm font-medium text-slate-500">Current Stock</p>
                <h2 className="text-3xl font-bold text-slate-800 mt-2">{forecast.currentStock}</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
                <p className="text-sm font-medium text-slate-500">Predicted Demand</p>
                <h2 className="text-3xl font-bold text-slate-800 mt-2">{forecast.predictedDemand}</h2>
              </div>
              <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 ${forecast.currentStock < forecast.predictedDemand ? 'border-t-red-500 bg-red-50/50' : 'border-t-slate-500'}`}>
                <p className="text-sm font-medium text-slate-500">Recommendation</p>
                {forecast.currentStock < forecast.predictedDemand ? (
                  <div className="mt-2 flex items-start">
                    <AlertTriangle size={24} className="text-red-500 mr-2 mt-1" />
                    <div>
                      <h2 className="text-xl font-bold text-red-700">Reorder {forecast.predictedDemand - forecast.currentStock + 50} units</h2>
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mt-1">Priority: HIGH</p>
                    </div>
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-slate-700 mt-2">Stock levels healthy.</h2>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecasting;
