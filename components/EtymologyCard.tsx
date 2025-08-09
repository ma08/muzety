'use client';

import { motion } from 'framer-motion';
import { Etymology } from '@/lib/songParser';

interface EtymologyCardProps {
  etymology: Etymology;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function EtymologyCard({ etymology, colors }: EtymologyCardProps) {
  const defaultColors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
  };
  
  const activeColors = colors || defaultColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: -15, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
    >
      <div 
        className="bg-black/90 backdrop-blur-xl rounded-lg p-4 min-w-[280px] max-w-[350px] border border-white/10 shadow-2xl"
        style={{
          borderColor: `${activeColors.primary}40`,
          boxShadow: `0 10px 40px ${activeColors.primary}20`,
        }}
      >
        {/* Arrow pointing down */}
        <div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 border-r border-b border-white/10 rotate-45"
          style={{ borderColor: `${activeColors.primary}40` }}
        />

        {/* Word Header */}
        <div className="mb-3 pb-2 border-b border-white/10">
          <h3 
            className="text-lg font-semibold"
            style={{ color: activeColors.accent }}
          >
            {etymology.word}
          </h3>
          <p className="text-xs text-white/60 mt-1">{etymology.meaning}</p>
        </div>

        {/* Origin */}
        <div className="mb-3">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Origin</p>
          <p className="text-sm text-white/80">{etymology.origin}</p>
        </div>

        {/* Evolution Timeline */}
        {etymology.evolution && etymology.evolution.length > 1 && (
          <div className="mb-3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Evolution</p>
            <div className="flex items-center gap-2">
              {etymology.evolution.map((stage, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-white/70">{stage}</span>
                  {index < etymology.evolution.length - 1 && (
                    <svg 
                      className="w-4 h-4 mx-1 text-white/30" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Words */}
        {etymology.relatedWords && etymology.relatedWords.length > 0 && (
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Related</p>
            <div className="flex flex-wrap gap-2">
              {etymology.relatedWords.map((word, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70"
                  style={{
                    backgroundColor: `${activeColors.secondary}20`,
                    color: activeColors.secondary,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}