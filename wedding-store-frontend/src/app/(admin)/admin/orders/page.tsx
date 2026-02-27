'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { order: { status } });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">LEDGER SYNCING...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Order <span className="text-primary italic">Ledger</span></h1>
          <p className="text-muted-foreground text-lg font-medium italic">Comprehensive log of all couture assignments.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-full h-14 px-6 font-black uppercase tracking-widest border-primary/10">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-[3.5rem] shadow-2xl overflow-hidden border border-primary/5">
        <div className="p-10 border-b border-primary/5 bg-secondary/5 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Filter by ref, stakeholder, or status..."
              className="pl-12 h-14 rounded-2xl border-none bg-background shadow-sm focus:ring-primary font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-primary/5">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] h-16">Reference</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-16">Stakeholder</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-16">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] h-16 text-right px-10">Lifecycle Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                  <TableCell className="px-10 py-8 font-mono font-bold text-lg group-hover:text-primary transition-colors">
                    #{order.id.toString().padStart(5, '0')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{order.user?.email}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        Joined {format(new Date(order.created_at), 'MMM yyyy')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-primary font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border-none">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-10 text-right">
                    <Select defaultValue={order.status} onValueChange={(val: string) => updateStatus(order.id, val)}>
                      <SelectTrigger className="w-48 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-primary/10 hover:border-primary/30 transition-all bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="font-black uppercase text-xs tracking-widest rounded-2xl border-primary/10">
                        {['PENDING', 'CONFIRMED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(s => (
                          <SelectItem key={s} value={s} className="py-3 hover:bg-primary/5 cursor-pointer">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
