'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface MarqueeProps {
  items?: string[];
  children?: React.ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
  glow?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
  className,
  glow = false,
}) => {
  const durationClass = {
    slow: 'duration-[45s]',
    normal: 'duration-[28s]',
    fast: 'duration-[16s]',
  }[speed];

  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';

  const defaultItems = [
    'CARE THAT CONNECTS',
    'EVERY NEED MATTERS',
    'ASSISTANCE WITH ACCOUNTABILITY',
    'IDENTIFY • CONNECT • ASSIST • VERIFY • EMPOWER',
    'NO ONE FALLS THROUGH THE GAPS',
    'REAL-TIME RESOURCE TRACKING',
    'VERIFIED IMPACT',
  ];

  const contentItems = items || defaultItems;

  const renderContent = () => (
    <div className="flex shrink-0 items-center space-x-12 py-3">
      {children
        ? children
        : contentItems.map((item, idx) => {
            const isHighlight = idx % 2 === 1;
            const isCyan = idx % 3 === 0;

            return (
              <div key={idx} className="flex items-center space-x-8 whitespace-nowrap">
                <span
                  className={cn(
                    'text-xs md:text-sm tracking-[0.25em] uppercase font-mono transition-colors duration-300',
                    isCyan
                      ? 'text-cyan-400 font-semibold drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                      : isHighlight
                      ? 'text-white font-bold'
                      : 'text-slate-400 font-normal'
                  )}
                >
                  {item}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-glow shrink-0" />
              </div>
            );
          })}
    </div>
  );

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border-y border-white/[0.06] bg-navy-950/60 backdrop-blur-md select-none',
        glow && 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]',
        className
      )}
    >
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#030611] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#030611] to-transparent pointer-events-none" />

      <div
        className={cn(
          'flex w-max',
          animationClass,
          durationClass,
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {renderContent()}
        {renderContent()}
        {renderContent()}
        {renderContent()}
      </div>
    </div>
  );
};

export default Marquee;
