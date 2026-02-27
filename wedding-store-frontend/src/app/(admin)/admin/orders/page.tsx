'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { order: { status } });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">LEDGER SYNCING...</div>;

  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-black tracking-tighter uppercase">Order <span className="text-primary italic">Ledger</span></h1>
      <div className="bg-background rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="p-8 border-b bg-secondary/5">
          <Input placeholder="Search records..." className="h-14 rounded-2xl border-none shadow-inner" />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="px-10 py-6 text-[10px] font-black uppercase">Reference</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Stakeholder</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Lifecycle Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="border-primary/5">
                <TableCell className="px-10 py-8 font-black">#{order.id}</TableCell>
                <TableCell className="font-bold">{order.user?.email}</TableCell>
                <TableCell><StatusBadge status={order.status} /></TableCell>
                <TableCell>
                  <Select defaultValue={order.status} onValueChange={(val: string) => updateStatus(order.id, val)}>
                    <SelectTrigger className="w-48 h-12 rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-bold">
                      {['PENDING', 'CONFIRMED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
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
  );
}
