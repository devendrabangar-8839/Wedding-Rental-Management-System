'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck,
  User,
  Mail,
  DollarSign,
  X
} from 'lucide-react';

interface Booking {
  id: number;
  product_id: number;
  product_name: string;
  size: string;
  start_date: string;
  end_date: string;
  status: string;
  order_id: number;
  customer_email: string;
  order_status: string;
  total_price: number;
  deposit_total: number;
  created_at: string;
}

interface BookedDate {
  date: string;
  bookings: Booking[];
}

export default function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await api.get('/admin/calendar');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      return date >= start && date <= end;
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-500',
      CONFIRMED: 'bg-blue-500',
      DELIVERED: 'bg-purple-500',
      PICKED: 'bg-orange-500',
      COMPLETED: 'bg-gray-500',
      CANCELLED: 'bg-red-500',
      LATE: 'bg-red-600',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getOrderStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500',
      CONFIRMED: 'bg-blue-500',
      PACKED: 'bg-indigo-500',
      OUT_FOR_DELIVERY: 'bg-purple-500',
      DELIVERED: 'bg-green-500',
      PICKUP_SCHEDULED: 'bg-orange-500',
      PICKED: 'bg-orange-600',
      COMPLETED: 'bg-gray-500',
      CANCELLED: 'bg-red-500',
      LATE: 'bg-red-600',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getFilteredBookings = () => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter(b => b.status === filterStatus || b.order_status === filterStatus);
  };

  const getUpcomingDeliveries = () => {
    const today = new Date();
    return bookings.filter(b => {
      const startDate = new Date(b.start_date);
      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  };

  const getUpcomingReturns = () => {
    const today = new Date();
    return bookings.filter(b => {
      const endDate = new Date(b.end_date);
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7 && b.status !== 'COMPLETED' && b.status !== 'PICKED';
    }).sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase">Rental <span className="text-primary italic">Manifest</span></h1>
        <div className="text-center font-black animate-pulse py-20">LOADING MANIFEST...</div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();
  const upcomingDeliveries = getUpcomingDeliveries();
  const upcomingReturns = getUpcomingReturns();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Rental <span className="text-primary italic">Manifest</span></h1>
          <p className="text-muted-foreground text-lg font-medium italic">Master calendar of all couture rental assignments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-full border border-primary/20 bg-background px-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="ACTIVE">Active</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PICKED">Picked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] shadow-xl border-none bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upcoming Deliveries (7d)</p>
                <p className="text-4xl font-black mt-2">{upcomingDeliveries.length}</p>
              </div>
              <Truck className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] shadow-xl border-none bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upcoming Returns (7d)</p>
                <p className="text-4xl font-black mt-2">{upcomingReturns.length}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] shadow-xl border-none bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Rentals</p>
                <p className="text-4xl font-black mt-2">{bookings.filter(b => ['ACTIVE', 'DELIVERED'].includes(b.status)).length}</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] shadow-2xl overflow-hidden border-none bg-background">
            <CardContent className="p-10">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiers={{
                  booked: (date) => getBookingsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  booked: { 
                    fontWeight: 'bold', 
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none bg-secondary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-widest">Selected Date</h3>
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-black mb-4">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              <div className="space-y-3">
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="p-4 rounded-2xl bg-background border border-primary/10 hover:border-primary/30 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-sm group-hover:text-primary transition-colors">{booking.product_name}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">Size: {booking.size}</p>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{booking.customer_email}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm font-medium">No rentals scheduled for this date.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Bookings List */}
      <Card className="rounded-[3rem] shadow-2xl overflow-hidden border-none bg-background">
        <div className="p-10 border-b border-primary/5">
          <h3 className="text-2xl font-black uppercase tracking-widest">All Rental Bookings ({filteredBookings.length})</h3>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="p-6 rounded-[2rem] bg-secondary/30 border border-primary/5 hover:border-primary/20 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{booking.product_name}</h4>
                  <p className="text-xs text-muted-foreground font-mono mt-1">Size: {booking.size}</p>
                </div>
                <Badge className={`${getStatusColor(booking.status)} text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0`}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{format(new Date(booking.start_date), 'MMM d')} - {format(new Date(booking.end_date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{booking.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span className="font-black uppercase tracking-widest">{booking.order_status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden">
          {selectedBooking && (
            <>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{selectedBooking.product_name}</h2>
                    <p className="text-muted-foreground font-mono mt-1">Size: {selectedBooking.size}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)} className="rounded-full h-10 w-10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rental Period</p>
                    <p className="font-bold">{format(new Date(selectedBooking.start_date), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">to</p>
                    <p className="font-bold">{format(new Date(selectedBooking.end_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(selectedBooking.status)} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full`}>
                        {selectedBooking.status}
                      </Badge>
                      <Badge variant="outline" className={`${getOrderStatusColor(selectedBooking.order_status)} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full`}>
                        {selectedBooking.order_status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    {selectedBooking.customer_email && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedBooking.customer_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-primary/10 pt-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">Order Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Price</p>
                      </div>
                      <p className="text-2xl font-black">₹{selectedBooking.total_price}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Security Deposit</p>
                      </div>
                      <p className="text-2xl font-black">₹{selectedBooking.deposit_total}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-muted-foreground font-mono">
                    Order #{selectedBooking.order_id.toString().padStart(5, '0')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Booked on {format(new Date(selectedBooking.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
