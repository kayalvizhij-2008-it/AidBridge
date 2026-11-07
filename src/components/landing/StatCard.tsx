import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, formatDate } from '@/lib/utils';

export interface StatCardT {
  title: string;
  value: string;
  subtitle?: string;
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
  icon?: React.ReactNode;
}

export function StatCard({ title, value, subtitle, badgeVariant = 'default', icon }: StatCardT) {
  return (
    <Card className="glass animate-fade-in relative overflow-hidden p-5">
      {icon && (
        <div className="absolute -right-10 -top-10 size-[100px] rounded-full bg-brand-500/10 p-3 text-brand-400">
          {icon}
        </div>
      )}
      <div className="relative flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          {subtitle ? <Badge variant={badgeVariant} className="mt-1 self-start">{subtitle}</Badge> : null}
        </div>
      </div>
    </Card>
  );
}
