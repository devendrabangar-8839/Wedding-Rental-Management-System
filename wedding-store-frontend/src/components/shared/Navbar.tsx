'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Collection', href: '/products' },
    { name: 'How it Works', href: '/#how-it-works' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Dashboard', href: '/admin' });
  } else if (user) {
    navLinks.push({ name: 'My Bookings', href: '/orders' });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-primary group-hover:opacity-80 transition-opacity">
              VIVAAH<span className="font-light text-muted-foreground">LUXE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-border mx-2" />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden lg:inline-block">{user.email}</span>
                <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 border-t bg-background",
        isOpen ? "max-h-[400px] py-4" : "max-h-0"
      )}>
        <div className="container mx-auto px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium p-2 hover:bg-muted rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full rounded-xl">Login</Button>
            </Link>
          )}
          {user && (
            <Button variant="ghost" onClick={logout} className="justify-start px-2 font-medium text-destructive">
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
