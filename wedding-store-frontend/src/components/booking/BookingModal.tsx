'use client';

import { useState, useEffect } from 'react';
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
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAvailability } from '@/hooks/useAvailability';

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

  const { availability, loading: availabilityLoading } = useAvailability(product.id, selectedSize);

  // Convert booked dates strings to Date objects for the calendar
  const bookedDatesSet = new Set(
    availability?.booked_dates?.map((d) => parseISO(d).toDateString()) || []
  );

  // Price calculations
  const CLEANING_FEE = 500;
  const rentalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const rentalFee = rentalDays > 0 ? product.rent_price * rentalDays : 0;
  const deposit = product.security_deposit || 0;
  const totalPayable = rentalFee + CLEANING_FEE; // What customer pays now (excluding refundable deposit)
  const grandTotal = totalPayable + deposit; // Total including refundable deposit

  const handleBooking = async () => {
    if (!startDate || !endDate || !address) return;

    setLoading(true);
    setError(null);
    try {
      await api.post('/orders', {
        order: {
          address,
          total_price: rentalFee,
          deposit_total: deposit,
          order_items_attributes: [
            {
              product_id: product.id,
              quantity: 1,
              price: product.rent_price,
              size: selectedSize,
              rental_booking_attributes: {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                product_id: product.id,
                size: selectedSize,
                status: 'CONFIRMED'
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

  // Custom day renderer to show booked dates
  const isDateBooked = (date: Date) => {
    return bookedDatesSet.has(date.toDateString());
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-[3rem] shadow-2xl bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Book {product.name}</DialogTitle>
          <DialogDescription>Complete your rental booking for {product.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Side: Summary */}
          <div className="bg-secondary/20 p-10 space-y-8 md:col-span-1">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Selection Summary</h3>
              <h2 className="text-3xl font-black tracking-tighter leading-none">{product.name}</h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">In Stock</div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Rental Fee ({rentalDays} days × ₹{product.rent_price.toLocaleString()})</span>
                <span className="font-black">₹{rentalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Dry Cleaning Fee</span>
                <span className="font-black">₹{CLEANING_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                <span className="text-sm font-bold italic text-muted-foreground">Security Deposit (Refundable)</span>
                <span className="font-black">₹{deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 bg-primary/5 -mx-4 px-4 py-3 rounded-lg">
                <div>
                  <span className="text-lg font-black uppercase tracking-tighter block">To Pay Now</span>
                  <span className="text-xs text-muted-foreground font-medium">Excludes refundable deposit</span>
                </div>
                <span className="text-3xl font-black text-primary italic leading-none">₹{totalPayable.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-4 py-1 leading-relaxed">
                Note: You will be refunded ₹{deposit.toLocaleString()} within 3-5 days after returning the outfit in good condition.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-10 space-y-8 md:col-span-2">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Event Dates</label>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></span>
                    Booked
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></span>
                    Available
                  </span>
                </div>
              </div>
              
              {availabilityLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-2xl justify-start font-bold border-primary/10">
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {startDate ? format(startDate, 'MMM dd, yyyy') : 'Start Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today || isDateBooked(date);
                          }}
                          classNames={{
                            day: "data-[booked=true]:bg-red-500/20 data-[booked=true]:text-red-600 data-[booked=true]:line-through",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Select your event start date
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-14 rounded-2xl justify-start font-bold border-primary/10">
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => {
                            const start = startDate || new Date();
                            return date < start || isDateBooked(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Select your event end date
                    </p>
                  </div>
                </div>
              )}

              {availability && availability.booked_dates.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 text-sm font-bold">
                    <Info className="h-4 w-4" />
                    Booked Dates for Size {selectedSize}
                  </div>
                  <p className="text-xs text-amber-700">
                    The following dates are already booked for this size:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {availability.booked_dates.slice(0, 10).map((date) => (
                      <span
                        key={date}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium"
                      >
                        {format(parseISO(date), 'MMM dd')}
                      </span>
                    ))}
                    {availability.booked_dates.length > 10 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                        +{availability.booked_dates.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
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
