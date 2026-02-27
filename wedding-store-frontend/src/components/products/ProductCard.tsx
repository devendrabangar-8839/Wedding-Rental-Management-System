'use client';

import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-none shadow-none bg-transparent group-hover:bg-secondary/5 transition-all duration-500 rounded-[2rem]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-xl group-hover:shadow-2xl transition-all duration-500">
          <Image
            src={product.name === 'Maharani Gold Lehenga' ? '/lehenga.png' : product.name === 'Midnight Blue Sherwani' ? '/sherwani.png' : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
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
