'use client';

import { useState, useEffect } from 'react';
import MusicPlayer from '@/components/MusicPlayer';
import LyricsDisplay from '@/components/LyricsDisplay';
import { LyricLine, parseCSVLyrics } from '@/lib/songParser';
import { motion } from 'framer-motion';
import { preGeneratedData } from '@/lib/preGeneratedData';

export default function Home() {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyric, setCurrentLyric] = useState<LyricLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load and parse lyrics
    async function loadLyrics() {
      console.log('[DEBUG] Starting to load lyrics...');
      try {
        const response = await fetch('/songs/mast_malang.csv');
        const text = await response.text();
        console.log('[DEBUG] CSV loaded, first 100 chars:', text.substring(0, 100));
        
        const parsedLyrics = parseCSVLyrics(text);
        console.log('[DEBUG] Parsed lyrics count:', parsedLyrics.length);
        console.log('[DEBUG] First lyric:', parsedLyrics[0]);
        
        // Merge with pre-generated data
        const enhancedLyrics = parsedLyrics.map((lyric, index) => ({
          ...lyric,
          ...(preGeneratedData[index] || {}),
        }));
        console.log('[DEBUG] Enhanced lyrics sample:', enhancedLyrics[0]);
        
        setLyrics(enhancedLyrics);
        setIsLoading(false);
      } catch (error) {
        console.error('[ERROR] Loading lyrics failed:', error);
        setIsLoading(false);
      }
    }

    loadLyrics();
  }, []);

  // Dynamic background based on current sentiment
  const backgroundStyle = currentLyric?.visualization?.background 
    ? { background: currentLyric.visualization.background }
    : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        animate={backgroundStyle}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-1" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md z-20 border-b border-white/10"
        >
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Etymology Visualizer
                </h1>
                <p className="text-sm text-white/60 mt-1">
                  Experience lyrics with linguistic depth
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40 px-3 py-1 rounded-full border border-white/20">
                  Powered by Freestyle
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"
              />
              <p className="text-white/60">Loading linguistic journey...</p>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Debug Info */}
            <div className="fixed top-20 left-4 bg-black/80 text-white p-2 rounded text-xs z-30">
              <div>Time: {currentTime.toFixed(2)}s</div>
              <div>Current: {currentLyric?.text || 'None'}</div>
              <div>Lyrics Count: {lyrics.length}</div>
            </div>
            
            {/* Lyrics Display */}
            <LyricsDisplay 
              lyrics={lyrics}
              currentTime={currentTime}
              currentLyric={currentLyric}
            />

            {/* Music Player */}
            <MusicPlayer
              audioFile="/songs/mast_malang.mp3"
              lyrics={lyrics}
              onTimeUpdate={setCurrentTime}
              onLyricChange={setCurrentLyric}
            />
          </>
        )}
      </div>

      {/* Ambient Animation */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
