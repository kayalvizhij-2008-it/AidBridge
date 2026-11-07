'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface AnimatedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  highlightWords?: string[];
  highlightClass?: string;
  className?: string;
  delay?: number;
  mode?: 'word' | 'char' | 'mask';
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  as: Component = 'h2',
  highlightWords = [],
  highlightClass = 'text-[#35A99A]',
  className = '',
  delay = 0,
  mode = 'word',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const words = text.split(' ');

  // Word-by-word variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay: number) => ({
      opacity: 1,
      transition: {
        staggerChildren: mode === 'char' ? 0.025 : 0.08,
        delayChildren: customDelay,
      },
    }),
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 110,
      },
    },
  };

  // Masking reveal variant
  if (mode === 'mask') {
    return (
      <Component className={`overflow-hidden ${className}`}>
        <motion.span
          className="inline-block"
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {words.map((word, idx) => {
            const isHighlighted = highlightWords.some((hw) =>
              word.toLowerCase().includes(hw.toLowerCase())
            );
            return (
              <span
                key={idx}
                className={`inline-block mr-[0.25em] ${isHighlighted ? highlightClass : ''}`}
              >
                {word}
              </span>
            );
          })}
        </motion.span>
      </Component>
    );
  }

  return (
    <Component className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        custom={delay}
      >
        {words.map((word, wordIndex) => {
          const isHighlighted = highlightWords.some((hw) =>
            word.toLowerCase().includes(hw.toLowerCase())
          );

          if (mode === 'char') {
            return (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={childVariants}
                    className={`inline-block ${isHighlighted ? highlightClass : ''}`}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          }

          return (
            <motion.span
              key={wordIndex}
              variants={childVariants}
              className={`inline-block mr-[0.25em] ${isHighlighted ? highlightClass : ''}`}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.span>
    </Component>
  );
};

export default AnimatedHeading;
