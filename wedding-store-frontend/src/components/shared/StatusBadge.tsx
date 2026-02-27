import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, { color: string; label: string }> = {
  // Order Statuses
  'PENDING': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
  'CONFIRMED': { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
  'PACKED': { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Packed' },
  'OUT_FOR_DELIVERY': { color: 'bg-cyan-100 text-cyan-800 border-cyan-200', label: 'Out for Delivery' },
  'DELIVERED': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
  'PICKUP_SCHEDULED': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Pickup Scheduled' },
  'PICKED': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Picked' },
  'COMPLETED': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Completed' },
  'CANCELLED': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
  'LATE': { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Late Return' },

  // Product Types
  'RENT': { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Rent' },
  'SELL': { color: 'bg-zinc-100 text-zinc-800 border-zinc-200', label: 'Sell' },
  'BOTH': { color: 'bg-neutral-100 text-neutral-800 border-neutral-200', label: 'Rent & Sell' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status.toUpperCase()] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status };

  return (
    <Badge
      variant="outline"
      className={cn("px-2.5 py-0.5 rounded-full font-medium transition-colors", config.color, className)}
    >
      {config.label}
    </Badge>
  );
}
