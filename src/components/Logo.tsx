import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2" role="img" aria-label="SkillHub Logo">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg`}>
        <GraduationCap className="h-1/2 w-1/2 text-primary-foreground" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse-soft" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gradient`}>
          SkillHub
        </span>
      )}
    </div>
  );
};

export default Logo;
