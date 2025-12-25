'use client';
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ width = 40 }) => {
  return (
    <div className="flex items-center gap-2" role="img" aria-label="SkillHub Logo">
      <Image
        src="/logo.png"
        alt="SkillHub Logo"
        width={width}
        height={width}
        className="rounded-xl"
      />
    </div>
  );
};

export default Logo;
