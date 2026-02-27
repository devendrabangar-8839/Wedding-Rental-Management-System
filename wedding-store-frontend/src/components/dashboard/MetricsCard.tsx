import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function MetricsCard({ title, value, icon: Icon, description, trend, className }: MetricsCardProps) {
  return (
    <Card className={cn("rounded-3xl border-none bg-background shadow-xl shadow-secondary/20 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500", className)}>
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:scale-110 transition-transform duration-700">
        <Icon className="w-24 h-24" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-8">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</CardTitle>
        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-0">
        <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground font-bold italic">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "mt-4 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1",
            trend.positive ? "text-emerald-500" : "text-rose-500"
          )}>
            {trend.value} from yesterday
          </div>
        )}
      </CardContent>
    </Card>
  );
}
