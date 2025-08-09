'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LanguageDistribution {
  Sanskrit: number;
  Persian: number;
  Arabic: number;
  Hindi: number;
  Urdu: number;
  English: number;
  Unknown: number;
}

interface LanguageOriginVisualizerProps {
  distribution: LanguageDistribution;
  isActive: boolean;
}

export default function LanguageOriginVisualizer({ 
  distribution, 
  isActive 
}: LanguageOriginVisualizerProps) {
  const [animatedValues, setAnimatedValues] = useState<LanguageDistribution>(distribution);

  useEffect(() => {
    // Animate value changes
    const timer = setTimeout(() => {
      setAnimatedValues(distribution);
    }, 100);
    return () => clearTimeout(timer);
  }, [distribution]);

  // Language colors and metadata
  const languages = [
    { name: 'Sanskrit', color: '#FF9933', icon: '🕉️', pattern: 'mandala' },
    { name: 'Persian', color: '#4169E1', icon: '🌙', pattern: 'geometric' },
    { name: 'Arabic', color: '#008000', icon: '☪️', pattern: 'calligraphic' },
    { name: 'Hindi', color: '#FF69B4', icon: '🪷', pattern: 'floral' },
    { name: 'Urdu', color: '#40E0D0', icon: '🌟', pattern: 'arabesque' },
    { name: 'English', color: '#DC143C', icon: '🌐', pattern: 'modern' },
  ];

  // Calculate total and percentages
  const total = Object.values(animatedValues).reduce((a, b) => a + b, 0);
  const percentages = languages.map(lang => ({
    ...lang,
    value: animatedValues[lang.name as keyof LanguageDistribution] || 0,
    percentage: total > 0 ? (animatedValues[lang.name as keyof LanguageDistribution] / total) * 100 : 0,
  })).filter(lang => lang.value > 0);

  // Calculate angles for radial chart
  let currentAngle = -90; // Start from top
  const segments = percentages.map(lang => {
    const angle = (lang.percentage / 100) * 360;
    const segment = {
      ...lang,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      midAngle: currentAngle + angle / 2,
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95 
      }}
      className="relative p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10"
      style={{
        boxShadow: isActive ? '0 0 40px rgba(255,255,255,0.1)' : 'none',
      }}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-white/90 mb-4 text-center">
        Linguistic Origins
      </h3>

      {/* Radial Chart */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Center circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="30"
            fill="black"
            fillOpacity="0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Segments */}
          {segments.map((segment, index) => (
            <motion.path
              key={segment.name}
              d={createSegmentPath(100, 100, 30, 90, segment.startAngle, segment.endAngle)}
              fill={segment.color}
              fillOpacity={0.7}
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ fillOpacity: 1, scale: 1.05 }}
              style={{ transformOrigin: '100px 100px' }}
            />
          ))}

          {/* Icons */}
          {segments.map((segment, index) => {
            const iconPos = getIconPosition(100, 100, 60, segment.midAngle);
            return (
              <motion.text
                key={`icon-${segment.name}`}
                x={iconPos.x}
                y={iconPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {segment.icon}
              </motion.text>
            );
          })}

          {/* Center text */}
          <motion.text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="24"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {total}
          </motion.text>
          <motion.text
            x="100"
            y="115"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fillOpacity="0.6"
            fontSize="10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            words
          </motion.text>
        </svg>

        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {percentages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-xs text-white/70">
              {lang.name}
            </span>
            <span className="text-xs text-white/50 ml-auto">
              {lang.percentage.toFixed(0)}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* Cultural Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-10">
        {percentages.length > 0 && renderDominantPattern(percentages[0].pattern, percentages[0].color)}
      </div>
    </motion.div>
  );
}

// Helper function to create SVG path for a segment
function createSegmentPath(
  cx: number, 
  cy: number, 
  innerRadius: number, 
  outerRadius: number, 
  startAngle: number, 
  endAngle: number
): string {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  
  const innerStart = {
    x: cx + innerRadius * Math.cos(toRadians(startAngle)),
    y: cy + innerRadius * Math.sin(toRadians(startAngle)),
  };
  
  const innerEnd = {
    x: cx + innerRadius * Math.cos(toRadians(endAngle)),
    y: cy + innerRadius * Math.sin(toRadians(endAngle)),
  };
  
  const outerStart = {
    x: cx + outerRadius * Math.cos(toRadians(startAngle)),
    y: cy + outerRadius * Math.sin(toRadians(startAngle)),
  };
  
  const outerEnd = {
    x: cx + outerRadius * Math.cos(toRadians(endAngle)),
    y: cy + outerRadius * Math.sin(toRadians(endAngle)),
  };
  
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  
  return `
    M ${innerStart.x} ${innerStart.y}
    L ${outerStart.x} ${outerStart.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
}

// Helper function to get icon position
function getIconPosition(cx: number, cy: number, radius: number, angle: number) {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(toRadians(angle)),
    y: cy + radius * Math.sin(toRadians(angle)),
  };
}

// Helper function to render cultural patterns
function renderDominantPattern(pattern: string, color: string) {
  switch (pattern) {
    case 'mandala':
      return (
        <motion.svg 
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2="50%"
              y2="0%"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.3"
              transform={`rotate(${i * 30} 50% 50%)`}
            />
          ))}
        </motion.svg>
      );
    case 'geometric':
      return (
        <svg className="absolute inset-0 w-full h-full">
          <pattern id="geo-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon 
              points="20,2 38,20 20,38 2,20" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#geo-pattern)" />
        </svg>
      );
    default:
      return null;
  }
}