"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { User, LogOut, Menu, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">
              VOWS <span className="text-primary">&</span> VEILS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/products" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Collections</Link>
            <Link href="#process" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">Process</Link>
            <Link href="#" className="text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">About</Link>

            <div className="relative w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search Couture..."
                className="pl-12 h-11 rounded-full bg-secondary/50 border-none focus:ring-primary font-medium"
              />
            </div>

            <div className="flex items-center space-x-4 border-l pl-10 border-primary/10">
              {user ? (
                <>
                  <Link href={user.role === 'admin' ? '/admin' : '/orders'}>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-rose-50 text-rose-500">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="rounded-full px-8 font-black uppercase text-xs tracking-widest bg-primary hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-primary/5 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            <Link href="/products" className="text-lg font-black uppercase tracking-[0.2em]" onClick={() => setIsMenuOpen(false)}>Collections</Link>
            <Link href="#process" className="text-lg font-black uppercase tracking-[0.2em]" onClick={() => setIsMenuOpen(false)}>Process</Link>
            <Link href="#" className="text-lg font-black uppercase tracking-[0.2em]" onClick={() => setIsMenuOpen(false)}>About</Link>
          </div>
          <div className="pt-6 border-t border-primary/5 flex flex-col space-y-4">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin' : '/orders'} className="flex items-center space-x-2 font-black uppercase tracking-widest text-sm">
                  <User className="h-5 w-5" /> <span>Account</span>
                </Link>
                <button onClick={logout} className="flex items-center space-x-2 font-black uppercase tracking-widest text-sm text-rose-500">
                  <LogOut className="h-5 w-5" /> <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
