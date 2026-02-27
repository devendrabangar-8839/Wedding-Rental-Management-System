'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-from)_0%,transparent_50%)] from-primary/10 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -z-20 clip-path-hero hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              2024 Premium Collection Active
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              REDEFINING <br />
              <span className="text-primary italic">ELEGANCE.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl font-medium leading-relaxed">
              Curated luxury ethnic wear rentals for those who demand the finest.
              No compromises on craftsmanship, no designer price tags.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-transform group">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-black border-2">
                How it Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-secondary/20" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Elegance is an Experience</h2>
            <p className="text-muted-foreground font-medium italic">Our seamless 3-step process designed for the modern connoisseur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10 -z-10 hidden md:block" />

            <div className="group space-y-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-background border shadow-xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black">01. Curated Selection</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">Browse our hand-picked inventory of premium Sherwanis, Lehengas, and Tuxedos.</p>
            </div>

            <div className="group space-y-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-background border shadow-xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black">02. Atomic Booking</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">Real-time availability tracking prevents double booking. Secure your dates instantly.</p>
            </div>

            <div className="group space-y-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-background border shadow-xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black">03. Quality Assurance</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">Each piece is professionally dry-cleaned and inspected before it reaches your door.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
