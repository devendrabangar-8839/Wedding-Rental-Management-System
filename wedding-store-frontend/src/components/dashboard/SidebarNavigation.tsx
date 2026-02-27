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
  Users,
  Settings,
  ArrowRight
} from 'lucide-react';

const menuItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Rental Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Calendar View', href: '/admin/calendar', icon: Calendar },
  { name: 'Inventory', href: '/admin/products', icon: Package },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-72 h-[calc(100vh-5rem)] border-r bg-background/50 backdrop-blur-sm sticky top-20">
      <div className="flex flex-col gap-2 p-6 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-6">
            Management Console
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-primary")} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto">
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto px-3 py-2">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Settings className="w-24 h-24" />
            </div>
            <h4 className="text-sm font-black mb-1">System Health</h4>
            <p className="text-xs text-muted-foreground mb-4">Daily sync completed. All systems operational.</p>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg border-primary/20 hover:bg-primary/5">
              View Logs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
