'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/booking/BookingModal';
import { ShoppingBag, ChevronLeft, ShieldCheck, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) return <div className="p-20 text-center font-black animate-pulse">PREPARING SELECTION...</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/products" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Collection
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-secondary/20 rounded-[3rem] aspect-[4/5] flex items-center justify-center">
          <ShoppingBag className="w-48 h-48 opacity-10" />
        </div>
        <div className="space-y-8">
          <h1 className="text-5xl font-extrabold tracking-tighter uppercase">{product.name}</h1>
          <p className="text-xl text-muted-foreground italic">{product.description}</p>
          <div className="flex items-center gap-12 py-8 border-y border-primary/10">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Daily Rental</span>
              <span className="text-4xl font-black text-primary">₹{product.rent_price}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Security Deposit</span>
              <span className="text-2xl font-black">₹{product.security_deposit}</span>
            </div>
          </div>
          <Button size="lg" onClick={() => setIsModalOpen(true)} className="w-full h-20 rounded-[2rem] text-xl font-black shadow-2xl">
            Request Access & Book
          </Button>
        </div>
      </div>
      <BookingModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
