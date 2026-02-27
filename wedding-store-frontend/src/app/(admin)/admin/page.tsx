'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { format } from 'date-fns';
import { Package, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard_metrics')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="p-20 text-center font-black animate-pulse">COMMAND CENTER SYNCING...</div>;

  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-black tracking-tighter uppercase">Command <span className="text-primary italic">Center</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricsCard title="Active Engagements" value={data.metrics.active_rentals} icon={Package} />
        <MetricsCard title="Return Manifest" value={data.metrics.upcoming_returns} icon={Calendar} />
        <MetricsCard title="Incident Reports" value={data.metrics.late_returns} icon={AlertTriangle} />
      </div>

      <div className="bg-background rounded-[3rem] shadow-2xl p-10 mt-12">
        <h2 className="text-2xl font-black uppercase mb-8">Recent Manifests</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Ref ID</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Stakeholder</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Financials</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.recent_bookings.map((order: any) => (
              <TableRow key={order.id} className="border-primary/5">
                <TableCell className="font-mono font-bold">#{order.id.toString().padStart(5, '0')}</TableCell>
                <TableCell className="font-bold">{order.user.email}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell className="font-black">₹{order.total_price}</TableCell>
                <TableCell className="text-muted-foreground">{format(new Date(order.created_at), 'PPP')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
