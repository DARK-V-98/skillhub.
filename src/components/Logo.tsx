'use client';
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-2" role="img" aria-label="SkillHub Logo">
      <Image
        src="/logo.png"
        alt="SkillHub Logo"
        width={sizeClasses[size]}
        height={sizeClasses[size]}
        className="rounded-xl"
      />
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gradient`}>
          SkillHub
        </span>
      )}
    </div>
  );
};

export default Logo;
