'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Package, Calendar, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/dashboard_metrics');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) return <div className="p-20 text-center font-black animate-pulse">COMMAND CENTER SYNCING...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Command <span className="text-primary italic">Center</span></h1>
          <p className="text-muted-foreground text-lg font-medium italic">Operational overview of Vows & Veils couture rentals.</p>
        </div>
        <div className="hidden md:block">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
            Live Systems
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricsCard title="Active Engagements" value={data.metrics.active_rentals} icon={Package} />
        <MetricsCard title="Return Manifest" value={data.metrics.upcoming_returns} icon={Calendar} />
        <MetricsCard title="Incident Reports" value={data.metrics.late_returns} icon={AlertTriangle} />
      </div>

      <div className="bg-background rounded-[3rem] shadow-2xl p-10 mt-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles className="w-64 h-64 text-primary" />
        </div>

        <h2 className="text-2xl font-black uppercase mb-8 relative z-10">Recent Manifests</h2>
        <div className="overflow-x-auto relative z-10">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-black uppercase tracking-widest text-[10px] h-12">Ref ID</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] h-12">Stakeholder</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] h-12">Status</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] h-12">Financials</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] h-12">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent_bookings.map((order: any) => (
                <TableRow key={order.id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-mono font-bold py-6 group-hover:text-primary transition-colors">#{order.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell className="font-bold">{order.user.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-primary font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full border-none">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black italic text-primary">₹{order.total_price.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground font-medium italic">{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
