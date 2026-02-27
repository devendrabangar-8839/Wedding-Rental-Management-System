'use client';

import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: 'grid' | 'list';
}

const getProductImage = (product: Product): string => {
  if (product.image_url) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Add updated_at timestamp to prevent caching
    const timestamp = product.updated_at ? new Date(product.updated_at).getTime() : Date.now();
    return `${apiUrl}${product.image_url}${product.image_url.includes('?') ? '&' : '?'}v=${timestamp}`;
  }
  if (product.name === 'Maharani Gold Lehenga') return '/lehenga.png';
  if (product.name === 'Midnight Blue Sherwani') return '/sherwani.png';
  return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80';
};

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const imageUrl = getProductImage(product);

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.id}`} className="group block">
        <Card className="h-full overflow-hidden border-none shadow-xl bg-background transition-all duration-500 rounded-[2rem] hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 aspect-[3/4] md:aspect-auto overflow-hidden md:rounded-l-[2rem] rounded-t-[2rem] shadow-xl">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <CardContent className="flex-1 p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className="bg-primary hover:bg-primary text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] border-none">
                    {product.product_type === 'rent' ? 'RENT' : product.product_type === 'sell' ? 'SELL' : 'BOTH'}
                  </Badge>
                  <h3 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-3xl font-black text-primary italic">₹{product.rent_price?.toLocaleString()}</span>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">/ day</span>
                  </div>
                  {product.sale_price && (
                    <p className="text-sm font-bold text-muted-foreground mt-1">Sale: ₹{product.sale_price.toLocaleString()}</p>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground font-medium line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-1">
                  {(product.sizes || ['S', 'M', 'L']).slice(0, 4).map((s: string) => (
                    <div key={s} className="w-6 h-6 rounded-full border border-background bg-secondary flex items-center justify-center text-[9px] font-black">{s}</div>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  {product.total_quantity} available
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-none shadow-none bg-transparent group-hover:bg-secondary/5 transition-all duration-500 rounded-[2rem]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-xl group-hover:shadow-2xl transition-all duration-500">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Status Badge */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-primary hover:bg-primary text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] border-none">
              {product.product_type === 'rent' ? 'RENT' : 'BOTH'}
            </Badge>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <ArrowRight className="text-primary h-6 w-6" />
            </div>
          </div>
        </div>

        <CardContent className="pt-8 px-2 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">{product.name}</h3>
            <div className="flex items-center text-primary">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-black ml-1 uppercase tracking-tighter italic">Featured</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary italic">₹{product.rent_price.toLocaleString()}</span>
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">/ day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {['S', 'M', 'L'].map(s => (
                  <div key={s} className="w-5 h-5 rounded-full border border-background bg-secondary flex items-center justify-center text-[8px] font-black">{s}</div>
                ))}
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
