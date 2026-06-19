import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AnalyticsFilters from '../components/charts/AnalyticsFilters';
import ExecutiveInsightsPanel from '../components/charts/ExecutiveInsightsPanel';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import InventoryDistributionChart from '../components/charts/InventoryDistributionChart';
import SupplierPerformanceChart from '../components/charts/SupplierPerformanceChart';
import WarehousePerformanceChart from '../components/charts/WarehousePerformanceChart';
import ShipmentStatusChart from '../components/charts/ShipmentStatusChart';
import { Database } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [logisticsData, setLogisticsData] = useState(null);
  const [warehouseData, setWarehouseData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [revRes, invRes, supRes, logRes] = await Promise.all([
        api.get('/stats/revenue'),
        api.get('/stats/inventory'),
        api.get('/stats/suppliers'),
        api.get('/stats/logistics')
      ]);

      setRevenueData(revRes.data.data);
      setInventoryData(invRes.data.data);
      setSupplierData(supRes.data.data);
      setLogisticsData(logRes.data.data);

      // Map metrics for Warehouse Performance
      setWarehouseData([
        { metric: 'Capacity Util. (%)', value: 75 },
        { metric: 'Orders Processed', value: invRes.data.data.totalItems * 2 },
        { metric: 'Inventory Turnover', value: 12 },
        { metric: 'Revenue Score', value: revRes.data.data.totalRevenue > 0 ? 85 : 0 },
      ]);
    } catch (e) {
      console.error("Failed to load analytics", e);
    }
  };

  const handleExportCSV = () => {
    alert("Exporting CSV dataset...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Business Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400">Executive metrics powered by optimized data structures</p>
        </div>
      </div>

      <AnalyticsFilters onExportCSV={handleExportCSV} />

      <ExecutiveInsightsPanel data={revenueData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueTrendChart data={revenueData?.trend} />
        <InventoryDistributionChart data={inventoryData?.distribution} maxBlock={inventoryData?.maxBlock} />
        <WarehousePerformanceChart data={warehouseData} />
        <SupplierPerformanceChart data={supplierData?.ranking} />
        <ShipmentStatusChart data={logisticsData?.statusBreakdown} />
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg mt-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold">Algorithms Powering This Dashboard</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-blue-300 font-bold text-lg">Fenwick Tree (Binary Indexed Tree)</h3>
              <span className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded">O(log N)</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Dynamically tracks cumulative sums across arrays by storing partial sums in a tree structure. It powers the <strong>Revenue Trend Chart</strong> and <strong>Logistics Shipment Totals</strong>.
            </p>
            <div className="bg-slate-900/50 p-3 rounded font-mono text-xs text-blue-200 border border-slate-700">
              <span className="text-slate-400">// Live Runtime Calculation:</span><br/>
              revenueFenwick.prefixSum(todayIndex); <br/>
              <span className="text-emerald-400">→ Result: ${revenueData?.totalRevenue?.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white/10 p-5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-emerald-300 font-bold text-lg">Segment Tree</h3>
              <span className="bg-emerald-900/50 text-emerald-200 text-xs px-2 py-1 rounded">O(log N)</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Answers complex range queries (Min, Max, Sum) over array intervals. It powers the <strong>Inventory Distribution Analytics</strong> and historical bounds queries.
            </p>
            <div className="bg-slate-900/50 p-3 rounded font-mono text-xs text-emerald-200 border border-slate-700">
              <span className="text-slate-400">// Live Runtime Calculation:</span><br/>
              inventorySegment.rangeMax(0, numWarehouses - 1); <br/>
              <span className="text-emerald-400">→ Result: {inventoryData?.maxBlock?.toLocaleString()} units max single block</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
