import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  className,
  iconClassName,
}) => {
  return (
    <div
      className={cn(
        'stat-card flex items-start justify-between animate-fade-in',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {change && (
          <p
            className={cn(
              'text-sm font-medium',
              change.positive ? 'text-emerald-600' : 'text-destructive'
            )}
          >
            {change.positive ? '+' : ''}{change.value}% from last month
          </p>
        )}
      </div>
      <div
        className={cn(
          'p-3 rounded-xl bg-primary/10',
          iconClassName
        )}
      >
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  );
};

export default StatCard;
