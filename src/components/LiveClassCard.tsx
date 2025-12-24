'use client';
import React, { useState, useEffect } from 'react';
import { Video, Users, Clock, Calendar } from 'lucide-react';
import { LiveClass } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LiveClassCardProps {
  liveClass: LiveClass;
  onJoin?: () => void;
  className?: string;
}

const LiveClassCard: React.FC<LiveClassCardProps> = ({
  liveClass,
  onJoin,
  className,
}) => {
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);

  const startTime = React.useMemo(() => new Date(liveClass.startTime), [liveClass.startTime]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Live Now');
        setIsLive(true);
        return;
      }

      setIsLive(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setCountdown(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-4 card-hover',
        isLive && 'ring-2 ring-destructive',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Badge className="bg-destructive text-destructive-foreground animate-pulse-soft">
                <span className="h-2 w-2 rounded-full bg-destructive-foreground mr-1" />
                LIVE
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Upcoming
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">{liveClass.course}</span>
          </div>

          <h4 className="font-semibold text-foreground">{liveClass.title}</h4>
          <p className="text-sm text-muted-foreground">by {liveClass.instructor}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(startTime)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(startTime)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {liveClass.attendees} registered
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {isLive ? 'Happening now' : 'Starts in'}
            </p>
            <p className={cn(
              'text-lg font-bold',
              isLive ? 'text-destructive' : 'text-primary'
            )}>
              {countdown}
            </p>
          </div>
          <Button
            onClick={onJoin}
            className="btn-touch-target"
            variant={isLive ? 'default' : 'outline'}
          >
            {isLive ? (
              <>
                <Video className="h-4 w-4 mr-2" />
                Join Now
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Set Reminder
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveClassCard;
