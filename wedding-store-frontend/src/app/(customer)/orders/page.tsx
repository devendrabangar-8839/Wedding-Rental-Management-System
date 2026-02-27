'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Calendar, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  size: string;
}

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
  size: string;
  price: number;
  rental_booking?: Booking;
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  address: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">RECALLING RECORDS...</div>;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="space-y-4 mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
          Your <span className="text-primary italic">Journals</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium italic">A chronicle of your regal selections.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-32 space-y-8 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-primary/5">
          <ShoppingBag className="w-24 h-24 mx-auto text-primary/20" />
          <p className="text-2xl font-black uppercase tracking-tight text-muted-foreground">The chronicle is empty.</p>
          <Link href="/products">
            <Button className="rounded-full h-16 px-10 font-black uppercase tracking-widest bg-primary">Begin Selection</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-none shadow-2xl rounded-[3rem] bg-background">
              <div className="bg-primary/5 px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-primary/5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Identity</span>
                  <h3 className="text-2xl font-black tracking-tighter">#ORD-{order.id.toString().padStart(5, '0')}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Placed</span>
                    <p className="text-sm font-bold">{format(new Date(order.created_at), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                    <Badge className="bg-primary h-6 px-4 rounded-full font-black uppercase text-[10px] tracking-widest block">{order.status}</Badge>
                  </div>
                </div>
              </div>

              <CardContent className="p-10 space-y-8">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-primary/5 last:border-0 last:pb-0">
                    <div className="relative w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/20 shrink-0 shadow-lg">
                      <Image
                        src={item.product?.name === 'Maharani Gold Lehenga' ? '/lehenga.png' : item.product?.name === 'Midnight Blue Sherwani' ? '/sherwani.png' : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'}
                        alt={item.product?.name || "Product Image"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-black tracking-tighter uppercase">{item.product?.name}</h4>
                        <span className="text-xl font-black text-primary italic">₹{item.price.toLocaleString()}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {item.rental_booking && (
                          <div className="flex items-center gap-3 text-sm font-bold italic text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{format(new Date(item.rental_booking.start_date), 'MMM dd')} - {format(new Date(item.rental_booking.end_date), 'MMM dd')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm font-bold italic text-muted-foreground">
                          <Receipt className="h-4 w-4 text-primary" />
                          <span>Size: {item.size} • Security Deposit Included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-8 flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-primary/10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold italic">{order.address}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Invested</span>
                    <p className="text-4xl font-black text-primary italic leading-none">₹{order.total_price.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
