'use client';

import { useImageCarousel } from '@/hooks/useImageCarousel';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import Image from 'next/image';

const aboutImages = [
  '/about-1.svg',
  '/about-2.svg',
  '/about-3.svg',
  '/about-4.svg',
];

const stats = [
  { icon: Heart, value: '500+', label: 'Happy Couples' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: Users, value: '50+', label: 'Designer Partners' },
  { icon: Sparkles, value: '100%', label: 'Quality Guaranteed' },
];

export function AboutSection() {
  const { currentIndex, isTransitioning } = useImageCarousel({ images: aboutImages, interval: 2500 });

  return (
    <section className="py-32 bg-background" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Carousel */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              {aboutImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  } ${isTransitioning && index === currentIndex ? 'animate-in fade-in duration-700' : ''}`}
                >
                  <Image
                    src={src}
                    alt={`Vows & Veils - ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ))}
              
              {/* Image Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {}}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 lg:-right-12 bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-2xl border border-primary/10">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-primary">15+</div>
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Years of Excellence</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">Our Story</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                Crafting Dreams <br />
                <span className="text-primary italic">Since 2010</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                At Vows & Veils, we believe every wedding day should be extraordinary. Our journey began with a simple mission: 
                to make luxury bridal wear accessible without compromising on quality or style.
              </p>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                We curate the finest collection of sherwanis, lehengas, and traditional attire from renowned designers across India. 
                Each piece is meticulously maintained, professionally cleaned, and tailored to perfection for your special moment.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="group bg-secondary/5 rounded-[2rem] p-6 border border-primary/5 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-primary">{stat.value}</div>
                      <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <p className="text-muted-foreground font-medium italic text-lg">
                "Your dream wedding attire, perfectly tailored and ready to make memories."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
