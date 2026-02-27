'use client';

import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../shared/StatusBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-secondary/10", className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        {/* Placeholder for Product Image */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 italic group-hover:scale-110 transition-transform duration-700">
          <ShoppingBag className="w-24 h-24" />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <StatusBadge status={product.product_type} className="shadow-sm backdrop-blur-md bg-background/50" />
        </div>

        {/* Hover Action */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Link href={`/products/${product.id}`}>
            <Button className="rounded-full px-8 py-6 font-bold shadow-2xl">
              View Selection
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold tracking-tight line-clamp-1">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
          {product.description}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground/60">Rent</span>
            <span className="text-xl font-black text-primary">₹{product.rent_price}<span className="text-xs font-normal">/day</span></span>
          </div>
          <div className="h-10 w-px bg-border/50" />
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground/60">Sizes</span>
            <span className="text-sm font-bold">{product.sizes.join(', ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
