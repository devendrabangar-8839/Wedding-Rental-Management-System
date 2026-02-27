export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-black tracking-tighter text-primary">
              VIVAAH<span className="font-light text-muted-foreground">LUXE</span>
            </span>
            <p className="text-sm text-muted-foreground mt-2 text-center md:text-left">
              Premium Ethnic Wear Rentals. Redefining Wedding Elegance.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vivaah Luxe. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
