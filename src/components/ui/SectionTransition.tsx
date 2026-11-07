'use client';

import React from 'react';

interface SectionTransitionProps {
  glowColor?: 'blue' | 'cyan' | 'violet' | 'coral';
  className?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  glowColor = 'cyan',
  className = '',
}) => {
  const glowMap = {
    blue: 'from-transparent via-blue-500/40 to-transparent shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    cyan: 'from-transparent via-cyan-400/40 to-transparent shadow-[0_0_25px_rgba(34,211,238,0.5)]',
    violet: 'from-transparent via-purple-500/40 to-transparent shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    coral: 'from-transparent via-rose-500/40 to-transparent shadow-[0_0_25px_rgba(244,63,94,0.5)]',
  }[glowColor];

  return (
    <div className={`relative w-full py-8 flex items-center justify-center overflow-hidden ${className}`}>
      <div className={`w-full max-w-5xl h-[1px] bg-gradient-to-r ${glowMap}`} />
      <div className="absolute w-2 h-2 rounded-full bg-white shadow-glow" />
    </div>
  );
};

export default SectionTransition;
