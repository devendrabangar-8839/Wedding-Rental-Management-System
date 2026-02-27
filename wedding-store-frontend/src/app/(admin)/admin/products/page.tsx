'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">INVENTORY SYNCING...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl font-black tracking-tighter uppercase">Inventory <span className="text-primary italic">Control</span></h1>
        <Button size="lg" className="h-16 px-10 rounded-2xl font-black shadow-2xl">
          <Plus className="mr-2 h-6 w-6" /> Add Product
        </Button>
      </div>
      <div className="bg-background rounded-[3rem] shadow-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="px-10 py-6 text-[10px] font-black uppercase">Asset</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Pricing</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-primary/5">
                <TableCell className="px-10 py-8 font-black">{product.name}</TableCell>
                <TableCell className="font-bold">₹{product.rent_price} / Day</TableCell>
                <TableCell className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl"><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-xl text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
