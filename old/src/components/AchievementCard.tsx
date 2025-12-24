import React from 'react';
import { Award, Download } from 'lucide-react';
import { Achievement } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  onDownload?: () => void;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onDownload,
  className,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-4 card-hover animate-fade-in',
        achievement.type === 'certificate' && 'ring-2 ring-primary/20 bg-gradient-to-br from-card to-accent',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex items-center justify-center h-14 w-14 rounded-xl text-2xl',
          achievement.type === 'certificate'
            ? 'bg-primary/10'
            : 'bg-accent'
        )}>
          {achievement.type === 'certificate' ? (
            <Award className="h-8 w-8 text-primary" />
          ) : (
            achievement.icon
          )}
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-foreground">{achievement.title}</h4>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          <p className="text-xs text-muted-foreground">
            Earned on {formatDate(achievement.earnedAt)}
          </p>
        </div>

        {achievement.type === 'certificate' && (
          <Button
            onClick={onDownload}
            variant="outline"
            size="sm"
            className="btn-touch-target"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
