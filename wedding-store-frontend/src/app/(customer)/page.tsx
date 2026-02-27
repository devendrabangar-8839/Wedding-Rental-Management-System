'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, Clock, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { ProcessSection } from "@/components/shared/ProcessSection";
import { AboutSection } from "@/components/shared/AboutSection";

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

      {/* About Section */}
      <AboutSection />

      {/* Process Section */}
      <ProcessSection />

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
