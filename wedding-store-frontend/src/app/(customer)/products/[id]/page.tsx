'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { BookingModal } from '@/components/booking/BookingModal';
import { ShoppingBag, ChevronLeft, ShieldCheck, Heart, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading || !product) return <div className="p-20 text-center font-black animate-pulse">PREPARING SELECTION...</div>;

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <Link href="/products" className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-12">
        <ChevronLeft className="mr-2 h-4 w-4" /> Home / {product.product_type} Collection / {product.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-secondary/20">
            <Image
              src={product.name === 'Maharani Gold Lehenga' ? '/lehenga.png' : product.name === 'Midnight Blue Sherwani' ? '/sherwani.png' : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-8 right-8 flex flex-col gap-4">
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg hover:scale-110 transition-transform">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg hover:scale-110 transition-transform">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square relative rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all opacity-60 hover:opacity-100">
                <Image
                  src={product.name === 'Maharani Gold Lehenga' ? '/lehenga.png' : product.name === 'Midnight Blue Sherwani' ? '/sherwani.png' : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'}
                  alt="Thumb"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary hover:bg-primary text-white font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest border-none">
                In Stock
              </Badge>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-primary" /> Signature Series
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary italic">₹{product.rent_price.toLocaleString()}</span>
              <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">/ per day rental</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Product Description</h3>
            <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-6 rounded-3xl bg-secondary/50 border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight">Professionally Dry Cleaned</span>
            </div>
            <div className="flex items-center gap-3 p-6 rounded-3xl bg-secondary/50 border border-primary/5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-tight">Free Boutique Fitting</span>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-primary/10">
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full h-24 rounded-full text-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Book Rental Now
            </Button>
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
              Atomic Booking — Double Reservation Prevention Guaranteed
            </p>
          </div>
        </div>
      </div>

      <BookingModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
