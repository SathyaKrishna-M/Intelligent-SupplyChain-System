import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipments');
      if (res.data) setShipments(res.data.data || res.data);
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Shipment ID', accessor: 'shipmentId' },
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'From (WH)', accessor: 'sourceWarehouseId' },
    { header: 'To (WH)', accessor: 'destinationWarehouseId' },
    { header: 'Driver ID', accessor: 'driverId' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipment Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Live visibility into active shipments and transit network.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={shipments} keyField="shipmentId" />
      )}
    </div>
  );
};

export default Shipments;
