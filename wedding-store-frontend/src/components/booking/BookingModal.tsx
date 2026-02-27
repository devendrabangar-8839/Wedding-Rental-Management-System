'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ product, isOpen, onClose }: BookingModalProps) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const rentalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const CLEANING_FEE = 500;
  const rentalFee = rentalDays > 0 ? product.rent_price * rentalDays : 0;
  const deposit = product.security_deposit || (rentalFee * 0.4);
  const totalPayable = rentalFee + deposit + CLEANING_FEE;

  const handleBooking = async () => {
    if (!startDate || !endDate || !address) return;

    setLoading(true);
    setError(null);
    try {
      await api.post('/orders', {
        order: {
          address,
          order_items_attributes: [
            {
              product_id: product.id,
              quantity: 1,
              size: selectedSize,
              rental_booking_attributes: {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                product_id: product.id,
                size: selectedSize
              }
            }
          ]
        }
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking. Please check availability.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-12 text-center space-y-6 rounded-[3rem]">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight">Booking Reserved!</DialogTitle>
          <p className="text-muted-foreground font-medium italic">Your regal attire is being prepared. Redirecting to your bookings...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-[3rem] shadow-2xl bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Summary */}
          <div className="bg-secondary/20 p-10 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Selection Summary</h3>
              <h2 className="text-3xl font-black tracking-tighter leading-none">{product.name}</h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">In Stock</div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Rental Fee ({rentalDays} days)</span>
                <span className="font-black">₹{rentalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Security Deposit (Refundable)</span>
                <span className="font-black">₹{deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Dry Cleaning</span>
                <span className="font-black">₹{CLEANING_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-black uppercase tracking-tighter">Total Payable</span>
                <span className="text-3xl font-black text-primary italic leading-none">₹{totalPayable.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-4 py-1 leading-relaxed">
                Note: You will be refunded the security deposit within 3-5 days after returning the outfit in good condition.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 min-w-[3rem] px-4 rounded-xl text-sm font-black transition-all ${selectedSize === size
                        ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20'
                        : 'bg-secondary/50 hover:bg-secondary border border-primary/5'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Event Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-14 rounded-2xl justify-start font-bold border-primary/10">
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {startDate ? format(startDate, 'MMM dd') : 'Start'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus disabled={(date) => date < new Date()} />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-14 rounded-2xl justify-start font-bold border-primary/10">
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {endDate ? format(endDate, 'MMM dd') : 'End'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus disabled={(date) => date < (startDate || new Date())} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Delivery Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Where should we send your couture?"
                className="h-14 rounded-2xl bg-secondary/30 border-none focus:ring-primary font-medium"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 text-sm font-bold italic">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={loading || !startDate || !endDate || !address}
              className="w-full h-16 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {loading ? 'Processing...' : 'Book Rental Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
