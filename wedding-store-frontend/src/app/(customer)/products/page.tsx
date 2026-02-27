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
  const [search, setSearch] = useState('');
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products', {
          params: { search, type: filteredType }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filteredType]);

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

          <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-xl">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search styles, fabrics, or motifs..."
                className="pl-12 h-14 rounded-2xl border-none bg-secondary/30 shadow-sm focus:ring-primary font-medium"
              />
            </div>
            {user?.role === 'admin' && (
              <Button className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Plus className="mr-2 h-5 w-5" /> Add
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-primary/5 py-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Button
              variant={filteredType === null ? 'default' : 'outline'}
              onClick={() => setFilteredType(null)}
              className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10"
            >
              All
            </Button>
            <Button
              variant={filteredType === 'RENT' ? 'default' : 'outline'}
              onClick={() => setFilteredType('RENT')}
              className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10"
            >
              For Rent
            </Button>
            <Button
              variant={filteredType === 'SELL' ? 'default' : 'outline'}
              onClick={() => setFilteredType('SELL')}
              className="rounded-full px-6 font-black uppercase text-xs tracking-widest h-11 border-primary/10"
            >
              For Sale
            </Button>
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
