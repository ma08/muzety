'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LyricLine } from '@/lib/songParser';
import LyricLineComponent from './LyricLine';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  currentLyric: LyricLine | null;
}

export default function LyricsDisplay({ 
  lyrics, 
  currentTime, 
  currentLyric 
}: LyricsDisplayProps) {
  const [visibleLyrics, setVisibleLyrics] = useState<LyricLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine which lyrics to show (current + surrounding lines)
    const currentIndex = currentLyric 
      ? lyrics.findIndex(l => l.id === currentLyric.id)
      : -1;

    if (currentIndex >= 0) {
      const start = Math.max(0, currentIndex - 2);
      const end = Math.min(lyrics.length, currentIndex + 3);
      setVisibleLyrics(lyrics.slice(start, end));
    } else {
      // Show first few lines when no current lyric
      setVisibleLyrics(lyrics.slice(0, 5));
    }
  }, [currentLyric, lyrics]);

  useEffect(() => {
    // Smooth scroll to active line
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLyric]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto min-h-screen pb-32 pt-20 px-8"
    >
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {visibleLyrics.map((lyric, index) => {
            const isActive = currentLyric?.id === lyric.id;
            const isPast = currentTime > lyric.endTime;
            const isFuture = currentTime < lyric.startTime;
            
            return (
              <motion.div
                key={lyric.id}
                ref={isActive ? activeLineRef : null}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: isActive ? 1 : isPast ? 0.3 : isFuture ? 0.5 : 0.7,
                  y: 0,
                  scale: isActive ? 1.05 : 1,
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                className={`
                  my-8 transition-all duration-500
                  ${isActive ? 'z-10' : 'z-0'}
                `}
              >
                <LyricLineComponent
                  lyric={lyric}
                  isActive={isActive}
                  isPast={isPast}
                  isFuture={isFuture}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading indicator for upcoming lyrics */}
        {visibleLyrics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 mt-20"
          >
            <div className="inline-flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full"
              />
              <span>Loading lyrics...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}