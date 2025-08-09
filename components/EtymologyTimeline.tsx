'use client';

import { motion } from 'framer-motion';
import { Etymology } from '@/lib/songParser';

interface EtymologyTimelineProps {
  etymology: Etymology;
  isActive: boolean;
}

export default function EtymologyTimeline({ etymology, isActive }: EtymologyTimelineProps) {
  // Define colors and shapes based on origin
  const originStyles = {
    Sanskrit: {
      color: '#FF9933', // Saffron
      shape: 'circle',
      pattern: 'mandala',
    },
    Persian: {
      color: '#4169E1', // Royal Blue
      shape: 'star',
      pattern: 'geometric',
    },
    Arabic: {
      color: '#008000', // Green
      shape: 'crescent',
      pattern: 'calligraphic',
    },
    Hindi: {
      color: '#FF69B4', // Pink
      shape: 'diamond',
      pattern: 'floral',
    },
    Urdu: {
      color: '#40E0D0', // Turquoise
      shape: 'hexagon',
      pattern: 'arabesque',
    },
    Traditional: {
      color: '#9370DB', // Medium Purple
      shape: 'circle',
      pattern: 'waves',
    },
  };

  const style = originStyles[etymology.origin as keyof typeof originStyles] || originStyles.Traditional;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.6, 
        scale: isActive ? 1 : 0.9 
      }}
      className="relative p-6 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10"
      style={{
        borderColor: `${style.color}40`,
        boxShadow: isActive ? `0 0 30px ${style.color}40` : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: style.color }}>
          {etymology.word}
        </h3>
        <span 
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${style.color}20`,
            color: style.color,
          }}
        >
          {etymology.origin}
        </span>
      </div>

      {/* Evolution Timeline */}
      {etymology.evolution && etymology.evolution.length > 1 && (
        <div className="relative mb-4">
          {/* Timeline Line */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-0.5"
            style={{ backgroundColor: `${style.color}40` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Evolution Nodes */}
          <div className="relative flex justify-between items-center">
            {etymology.evolution.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center"
              >
                {/* Node Shape */}
                <div className="relative">
                  {renderShape(style.shape, style.color, index === etymology.evolution.length - 1)}
                </div>
                
                {/* Stage Text */}
                <motion.span
                  className="mt-2 text-xs text-white/70 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  {stage}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Meaning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-white/80 italic"
      >
        "{etymology.meaning}"
      </motion.div>

      {/* Related Words */}
      {etymology.relatedWords && etymology.relatedWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {etymology.relatedWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: `${style.color}15`,
                color: style.color,
                border: `1px solid ${style.color}30`,
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Animated Pattern Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {renderPattern(style.pattern, style.color)}
      </div>
    </motion.div>
  );
}

// Helper function to render different shapes
function renderShape(shape: string, color: string, isLast: boolean) {
  const size = isLast ? 'w-10 h-10' : 'w-8 h-8';
  const baseClasses = `${size} flex items-center justify-center`;
  
  switch (shape) {
    case 'star':
      return (
        <motion.svg
          className={baseClasses}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 24 24"
          fill={color}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>
      );
    case 'crescent':
      return (
        <motion.div
          className={`${baseClasses} relative`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: 'black',
              transform: 'translate(25%, 0)',
            }}
          />
        </motion.div>
      );
    case 'diamond':
      return (
        <motion.div
          className={size}
          style={{ backgroundColor: color }}
          animate={{ rotate: 45 }}
          whileHover={{ rotate: 90 }}
        />
      );
    case 'hexagon':
      return (
        <motion.svg
          className={baseClasses}
          viewBox="0 0 24 24"
          fill={color}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
        </motion.svg>
      );
    default: // circle
      return (
        <motion.div
          className={`${baseClasses} rounded-full`}
          style={{ backgroundColor: color }}
          animate={{ scale: isLast ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      );
  }
}

// Helper function to render background patterns
function renderPattern(pattern: string, color: string) {
  switch (pattern) {
    case 'mandala':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={10 + i * 5}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity={0.5 - i * 0.05}
                />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala)" />
        </svg>
      );
    case 'geometric':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="geometric" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <polygon points="25,5 45,25 25,45 5,25" fill="none" stroke={color} strokeWidth="0.5" />
              <circle cx="25" cy="25" r="5" fill={color} opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)" />
        </svg>
      );
    case 'calligraphic':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="calligraphic" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M10,25 Q30,10 50,25 T90,25"
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calligraphic)" />
        </svg>
      );
    default:
      return null;
  }
}