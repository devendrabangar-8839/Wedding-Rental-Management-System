'use client';

import { useImageCarousel } from '@/hooks/useImageCarousel';
import { ShoppingBag, Calendar, Sparkles, Truck, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

const processImages = [
  '/process-1.svg',
  '/process-2.svg',
  '/process-3.svg',
  '/process-4.svg',
];

const processSteps = [
  {
    icon: ShoppingBag,
    step: '01',
    title: 'Browse & Select',
    description: 'Explore our curated collection of designer sherwanis, lehengas, and traditional attire. Filter by style, color, and occasion to find your perfect match.',
    image: '/process-1.svg',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Book Your Dates',
    description: 'Select your rental period with our easy booking calendar. We ensure availability and block dates exclusively for your special day.',
    image: '/process-2.svg',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Professional Fitting',
    description: 'Visit our boutique for a personalized fitting session. Our expert tailors ensure every piece fits you like it was made just for you.',
    image: '/process-3.svg',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Delivery & Pickup',
    description: 'Receive your pristine attire at your doorstep. After your event, we handle the pickup - simple, convenient, and contactless.',
    image: '/process-4.svg',
  },
];

export function ProcessSection() {
  const { currentIndex, isTransitioning } = useImageCarousel({ images: processImages, interval: 3000 });

  return (
    <section className="py-32 bg-background" id="process">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">How It Works</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">
            Your Journey to <br />
            <span className="text-primary italic">Perfect Attire</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium italic">
            From selection to celebration, we make sure you look stunning on your big day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className={`group relative bg-secondary/5 rounded-[2.5rem] p-8 border border-primary/5 hover:border-primary/30 transition-all duration-500 cursor-pointer ${
                  currentIndex === index ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : ''
                }`}
              >
                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                      currentIndex === index 
                        ? 'bg-primary text-primary-foreground scale-110' 
                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}>
                      <step.icon className="w-10 h-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-5xl font-black transition-colors duration-300 ${
                        currentIndex === index ? 'text-primary' : 'text-primary/20'
                      }`}>
                        {step.step}
                      </span>
                      <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed pl-14">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-primary transition-all duration-300 ${
                      currentIndex === index ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Image Carousel */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              {processImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Process step ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              ))}

              {/* Step Indicator Overlay */}
              <div className="absolute bottom-12 left-8 right-8 z-10">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/80 text-sm font-black uppercase tracking-widest">Step {currentIndex + 1} of 4</span>
                    <div className="flex gap-2">
                      {processImages.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-white font-black text-xl">
                    {processSteps[currentIndex].title}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -top-6 -left-6 lg:-left-12 bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-2xl border border-primary/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">Quality</div>
                  <div className="text-lg font-black text-primary">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Star, label: 'Premium Quality', sub: 'Designer Collection' },
            { icon: ShieldCheck, label: 'Hygiene First', sub: 'Professional Cleaning' },
            { icon: Calendar, label: 'Flexible Dates', sub: 'Easy Rescheduling' },
            { icon: Sparkles, label: 'Perfect Fit', sub: 'Expert Tailoring' },
          ].map((item) => (
            <div key={item.label} className="group text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-primary">{item.label}</div>
                <div className="text-xs font-medium text-muted-foreground">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
