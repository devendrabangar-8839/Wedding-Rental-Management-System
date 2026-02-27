'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AddProductModal } from '@/components/admin/AddProductModal';
import { EditProductModal } from '@/components/admin/EditProductModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/types';

const getProductImage = (product: Product): string => {
  if (product.image_url) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Add updated_at timestamp to prevent caching
    const timestamp = product.updated_at != null ? new Date(product.updated_at).getTime() : Date.now();
    return `${apiUrl}${product.image_url}${product.image_url.includes('?') ? '&' : '?'}v=${timestamp}`;
  }
  return '';
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(res => setProducts(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await api.delete(`/products/${deletingProduct.id}`);
      setProducts(products.filter(p => p.id !== deletingProduct.id));
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeletingProduct(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">INVENTORY SYNCING...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl font-black tracking-tighter uppercase">Inventory <span className="text-primary italic">Control</span></h1>
        <Button
          size="lg"
          className="h-16 px-10 rounded-2xl font-black shadow-2xl"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-6 w-6" /> Add Product
        </Button>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProducts}
      />

      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={fetchProducts}
      />

      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase">Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium">
              This will permanently remove "{deletingProduct?.name}" from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="h-14 rounded-xl font-black uppercase">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-14 rounded-xl font-black uppercase bg-rose-500 hover:bg-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <TableCell className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    {getProductImage(product) ? (
                      <img src={getProductImage(product)} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center">
                        <span className="text-2xl font-black text-muted-foreground">{product.name[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-black text-lg">{product.name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {product.product_type} • {product.total_quantity} units
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  <div className="space-y-1">
                    <p className="text-primary font-black">₹{product.rent_price} / Day</p>
                    {product.sale_price && (
                      <p className="text-sm text-muted-foreground">Sale: ₹{product.sale_price}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl text-rose-500 hover:bg-rose-50"
                      onClick={() => setDeletingProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
