import { AboutSection } from '@/components/shared/AboutSection';
import { ProcessSection } from '@/components/shared/ProcessSection';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              About <span className="text-primary italic">Vows & Veils</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">
              Where tradition meets elegance, and every wedding story becomes legendary.
            </p>
          </div>
        </div>
      </section>

      <AboutSection />
      <ProcessSection />

      {/* CTA Section */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="100" cy="0" r="80" fill="currentColor" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              Ready to Begin <br />Your Story?
            </h2>
            <p className="text-xl md:text-2xl font-medium text-primary-foreground/80 max-w-2xl mx-auto italic">
              Join hundreds of couples who trusted us with their special day. 
              Experience luxury bridal wear that makes memories last forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <a
                href="/products"
                className="inline-flex items-center justify-center h-20 px-12 rounded-full text-xl font-black bg-primary-foreground text-primary hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Browse Collection
              </a>
              <a
                href="#process"
                className="inline-flex items-center justify-center h-20 px-12 rounded-full text-xl font-black bg-transparent border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
