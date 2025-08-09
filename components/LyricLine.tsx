'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyricLine as LyricLineType } from '@/lib/songParser';
import EtymologyCard from './EtymologyCard';

interface LyricLineProps {
  lyric: LyricLineType;
  isActive: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export default function LyricLine({ 
  lyric, 
  isActive, 
  isPast, 
  isFuture 
}: LyricLineProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  
  // Split text into words for individual interaction
  const words = lyric.text.split(/\s+/);
  const hasEtymology = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9अ-ह]/gi, '');
    return lyric.etymology && lyric.etymology[cleanWord];
  };

  // Dynamic styles based on sentiment
  const sentimentStyles = lyric.sentiment ? {
    background: lyric.visualization?.background || 'transparent',
    borderColor: lyric.sentiment.colors.primary,
    boxShadow: isActive ? `0 0 30px ${lyric.sentiment.colors.primary}40` : 'none',
  } : {};

  const textColor = isActive 
    ? 'text-white' 
    : isPast 
    ? 'text-white/30' 
    : isFuture 
    ? 'text-white/50' 
    : 'text-white/70';

  return (
    <motion.div
      className={`
        relative rounded-2xl p-8 transition-all duration-700
        ${isActive ? 'border-2' : 'border border-transparent'}
      `}
      style={sentimentStyles}
      animate={{
        scale: isActive ? 1 : 0.95,
      }}
    >
      {/* Particle Effect Background */}
      {isActive && lyric.visualization?.particleEffect && (
        <ParticleEffect type={lyric.visualization.particleEffect} />
      )}

      {/* Lyric Text */}
      <div className={`relative z-10 text-center ${textColor}`}>
        <motion.div
          className={`
            text-2xl md:text-4xl font-light leading-relaxed
            ${isActive ? 'font-normal' : ''}
          `}
          animate={{
            letterSpacing: isActive ? '0.05em' : '0em',
          }}
        >
          {words.map((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9अ-ह]/gi, '');
            const etymology = lyric.etymology?.[cleanWord];
            
            return (
              <span key={index} className="relative inline-block mx-1">
                <motion.span
                  className={`
                    cursor-pointer relative
                    ${etymology ? 'border-b-2 border-dotted border-white/30' : ''}
                  `}
                  onHoverStart={() => etymology && setHoveredWord(cleanWord)}
                  onHoverEnd={() => setHoveredWord(null)}
                  whileHover={etymology ? { 
                    scale: 1.1,
                    color: lyric.sentiment?.colors.accent,
                  } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {word}
                </motion.span>
                
                {/* Etymology Tooltip */}
                <AnimatePresence>
                  {hoveredWord === cleanWord && etymology && (
                    <EtymologyCard 
                      etymology={etymology}
                      colors={lyric.sentiment?.colors}
                    />
                  )}
                </AnimatePresence>
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Sentiment Indicator */}
      {isActive && lyric.sentiment && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm"
            style={{ color: lyric.sentiment.colors.accent }}
          >
            {lyric.sentiment.emotion} • {Math.round(lyric.sentiment.intensity * 100)}%
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Particle Effect Component
function ParticleEffect({ type }: { type: string }) {
  const particles = Array.from({ length: 15 }, (_, i) => i);
  
  const particleVariants = {
    bubbles: {
      initial: { y: 100, opacity: 0 },
      animate: { 
        y: -100, 
        opacity: [0, 0.5, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }
      }
    },
    leaves: {
      initial: { y: -50, x: -50, rotate: 0, opacity: 0 },
      animate: { 
        y: 100,
        x: 50,
        rotate: 360,
        opacity: [0, 0.3, 0],
        transition: {
          duration: 5,
          repeat: Infinity,
          delay: Math.random() * 3,
        }
      }
    },
    sparks: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          delay: Math.random() * 2,
        }
      }
    },
    waves: {
      initial: { scaleX: 0, opacity: 0 },
      animate: { 
        scaleX: [0, 1, 0],
        opacity: [0, 0.2, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }
      }
    },
    stars: {
      initial: { scale: 0, rotate: 0, opacity: 0 },
      animate: { 
        scale: [0, 1, 0.5, 1, 0],
        rotate: 360,
        opacity: [0, 1, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          delay: Math.random() * 3,
        }
      }
    },
  };

  const variant = particleVariants[type as keyof typeof particleVariants] || particleVariants.bubbles;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={variant}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}