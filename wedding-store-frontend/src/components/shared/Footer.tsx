export function Footer() {
  return (
    <footer className="border-t border-primary/5 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              VOWS <span className="text-primary">&</span> VEILS
            </span>
            <p className="text-sm text-muted-foreground font-medium italic">
              Timeless elegance for your special day.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} Vows & Veils Couture.
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-primary/40">
              All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
