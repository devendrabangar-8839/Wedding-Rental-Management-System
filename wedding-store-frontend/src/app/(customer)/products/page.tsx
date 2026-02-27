'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, Grid, List, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col space-y-12">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Wedding <span className="text-primary italic">Collection</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium italic">Hand-picked luxury couture for royalty.</p>
          </div>

          {user?.role === 'admin' && (
            <Button className="h-16 px-8 rounded-full font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Plus className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-primary/5 py-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Button variant="outline" className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10">Category</Button>
            <Button variant="outline" className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10">Size</Button>
            <Button variant="outline" className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10">Price Range</Button>
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 hover:bg-primary/5">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 bg-secondary/30 p-1.5 rounded-full">
            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-primary text-white shadow-lg shadow-primary/20">
              <Grid className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[3/4] w-full rounded-[2rem]" />
                <div className="space-y-2 px-2">
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                  <Skeleton className="h-6 w-1/2 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-20">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
