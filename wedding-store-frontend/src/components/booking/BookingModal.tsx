'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Loader2, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ product, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const rentTotal = product.rent_price * Math.max(0, days);
  const totalPayable = rentTotal + product.security_deposit;

  const handleBooking = async () => {
    if (!startDate || !endDate || !selectedSize || !address) {
      setError('Please complete all fields to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/rental_bookings', {
        product_id: product.id,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        size: selectedSize,
        address: address
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'A problem occurred with your booking range. Please try different dates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-3xl p-0 border-none shadow-2xl">
        {success ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Booking Secured!</h2>
            <p className="text-muted-foreground">We're preparing your selection. Redirecting you to your bookings dashboard...</p>
          </div>
        ) : (
          <>
            <div className="bg-primary px-8 py-10 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <ShoppingBag className="w-32 h-32" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tight">Reserve Selection</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  {product.name} — Luxury Rental
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-6">
              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Pick your size</Label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-12 w-12 rounded-xl transition-all font-bold",
                        selectedSize === size ? "shadow-lg shadow-primary/20 scale-110" : "hover:bg-primary/5"
                      )}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-12 rounded-xl justify-start font-bold", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd") : "Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus disabled={{ before: new Date() }} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full h-12 rounded-xl justify-start font-bold", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd") : "Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus disabled={(date) => !!startDate && date < startDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Delivery Detail</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Where should we deliver?"
                    className="pl-12 h-14 rounded-xl font-medium border-secondary/50 focus:border-primary/50 transition-all bg-secondary/5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Summary */}
              {startDate && endDate && (
                <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Rent for {days} days</span>
                    <span className="text-primary">₹{rentTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                    <span>Refundable Deposit</span>
                    <span>₹{product.security_deposit}</span>
                  </div>
                  <div className="h-px bg-border/50 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black uppercase tracking-widest">Total Secure</span>
                    <span className="text-2xl font-black">₹{totalPayable}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 text-destructive bg-destructive/5 p-4 rounded-xl border border-destructive/20 text-sm font-bold">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleBooking}
                disabled={loading}
                className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm & Pay"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
