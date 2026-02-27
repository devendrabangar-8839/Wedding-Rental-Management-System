'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, Clock, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Hero Ethnic Wear"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              Timeless <br /> Elegance for <br />
              <span className="text-primary italic">Your Special Day.</span>
            </h1>

            <p className="text-xl text-zinc-200 max-w-xl font-medium leading-relaxed">
              Exquisite bridal wear and traditional couture curated for your most cherished moments.
              Find high-end bridal fashion tailored for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/products">
                <Button size="lg" className="h-20 px-12 rounded-full text-xl font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all group">
                  Browse Collection
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-background" id="process">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Our Simple <span className="text-primary italic">Process</span></h2>
            <p className="text-muted-foreground text-lg font-medium italic">From selection to delivery, we make sure you look stunning on your big day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="group space-y-8 bg-secondary/5 rounded-[3rem] p-12 border border-primary/5 hover:border-primary/20 transition-all duration-500">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">01. Select</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">Browse our curated collection of designer bridal wear. Find the style that's you.</p>
              </div>
            </div>

            <div className="group space-y-8 bg-secondary/5 rounded-[3rem] p-12 border border-primary/5 hover:border-primary/20 transition-all duration-500">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <Clock className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">02. Book</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">Get your dream bridal wear set tailored with our effortless booking process, including professional fitting sessions.</p>
              </div>
            </div>

            <div className="group space-y-8 bg-secondary/5 rounded-[3rem] p-12 border border-primary/5 hover:border-primary/20 transition-all duration-500">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">03. Delivered</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-lg">Receive your luxury attire, expertly cleaned and perfectly tailored for your event.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Star className="w-full h-full rotate-12 scale-150" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              Ready to find your <br /> perfect look?
            </h2>
            <p className="text-xl md:text-2xl font-medium text-primary-foreground/80 max-w-2xl mx-auto italic">
              Join thousands of happy couples who look their best on their wedding day. Experience the luxury of designer wear without the designer price tag.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Link href="/products">
                <Button size="lg" variant="secondary" className="h-20 px-12 rounded-full text-xl font-black hover:scale-105 active:scale-95 transition-all">
                  Get Started Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-20 px-12 rounded-full text-xl font-black bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10 transition-all">
                Consult a Stylist
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
