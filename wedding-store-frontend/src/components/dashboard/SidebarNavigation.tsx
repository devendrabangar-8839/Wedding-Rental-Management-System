'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Package,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Command Center', href: '/admin', icon: LayoutDashboard },
  { name: 'Order Ledger', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Rental Manifest', href: '/admin/calendar', icon: Calendar },
  { name: 'Inventory Vault', href: '/admin/products', icon: Package },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden lg:flex flex-col w-80 h-[calc(100vh-5rem)] border-r border-primary/5 bg-background/50 backdrop-blur-md sticky top-20">
      <div className="flex flex-col h-full gap-2 p-8">
        <div className="px-3 py-6">
          <div className="mb-12">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              VOWS <span className="text-primary">&</span> VEILS
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-50">Admin Console</p>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary/40 group-hover:text-primary")} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto px-3 py-6 space-y-6">
          <div className="bg-secondary/30 p-8 rounded-[2rem] border border-primary/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <Package className="w-24 h-24 text-primary" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-2">Vault Status</h4>
            <p className="text-[10px] text-muted-foreground font-medium italic mb-4 leading-relaxed line-clamp-2">All inventory items are synced with the blockchain ledger.</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Operational
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className="w-full h-14 rounded-2xl justify-start px-6 gap-4 font-black uppercase tracking-widest text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut className="h-5 w-5" />
            Exit Console
          </Button>
        </div>
      </div>
    </div>
  );
}
