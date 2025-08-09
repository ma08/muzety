'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import MusicPlayer from '@/components/MusicPlayer';
import LyricsDisplay from '@/components/LyricsDisplay';
import SongHeader from '@/components/SongHeader';
import DynamicBackground from '@/components/DynamicBackground';
import EtymologyTimeline from '@/components/EtymologyTimeline';
import LanguageOriginVisualizer from '@/components/LanguageOriginVisualizer';
import { LyricLine, parseCSVLyrics, Etymology } from '@/lib/songParser';
import { motion } from 'framer-motion';
import { translationService } from '@/lib/translationService';
import { etymologyService } from '@/lib/etymologyService';

export default function Home() {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyric, setCurrentLyric] = useState<LyricLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(false);
  const [analyzedLyrics, setAnalyzedLyrics] = useState<Map<string, LyricLine>>(new Map());
  const [languageDistribution, setLanguageDistribution] = useState({
    Sanskrit: 0,
    Persian: 0,
    Arabic: 0,
    Hindi: 0,
    Urdu: 0,
    English: 0,
    Unknown: 0,
  });

  useEffect(() => {
    // Load and parse lyrics
    async function loadLyrics() {
      try {
        const response = await fetch('/songs/mast_malang.csv');
        const text = await response.text();
        const parsedLyrics = parseCSVLyrics(text);
        setLyrics(parsedLyrics);
        setIsLoading(false);
      } catch (error) {
        console.error('[ERROR] Loading lyrics failed:', error);
        setIsLoading(false);
      }
    }

    loadLyrics();
  }, []);

  // Analyze lyric when it becomes active
  const analyzeLyric = useCallback(async (lyric: LyricLine) => {
    // Check if already analyzed
    if (analyzedLyrics.has(lyric.id)) {
      return analyzedLyrics.get(lyric.id)!;
    }

    try {
      // Fetch translation
      const translation = await translationService.translate(lyric.text);

      // Extract words for etymology
      const words = lyric.text.split(/\s+/)
        .filter(w => w.length > 2)
        .map(w => w.replace(/[^\u0900-\u097F\u0600-\u06FFa-zA-Z]/g, ''));

      // Fetch etymologies
      const etymologies: Record<string, Etymology> = {};
      for (const word of words) {
        const etymology = await etymologyService.getEtymology(word);
        if (etymology) {
          etymologies[word.toLowerCase()] = etymology;
        }
      }

      // Call AI analysis for sentiment and missing etymologies
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: lyric.text,
          timestamp: lyric.startTime,
        }),
      });

      let sentiment, visualization;
      if (response.ok) {
        const data = await response.json();
        sentiment = data.sentiment;
        visualization = data.visualization;
        
        // Merge AI etymologies
        if (data.etymologies) {
          Object.assign(etymologies, data.etymologies);
        }
      } else {
        // Default sentiment
        sentiment = {
          emotion: 'calm',
          intensity: 0.5,
          colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#ec4899',
          },
        };
        visualization = {
          particleEffect: 'waves',
          animation: 'fade',
          background: 'linear-gradient(135deg, #6366f120, #8b5cf610)',
        };
      }

      const enhancedLyric = {
        ...lyric,
        translation,
        etymology: etymologies,
        sentiment,
        visualization,
      };

      // Update analyzed lyrics
      setAnalyzedLyrics(prev => new Map(prev).set(lyric.id, enhancedLyric));

      // Update language distribution
      const distribution = { ...languageDistribution };
      Object.values(etymologies).forEach((etym) => {
        const origin = etym.origin as keyof typeof distribution;
        if (origin in distribution) {
          distribution[origin]++;
        } else {
          distribution.Unknown++;
        }
      });
      setLanguageDistribution(distribution);

      return enhancedLyric;
    } catch (error) {
      console.error('[Analysis] Failed to analyze lyric:', error);
      return lyric;
    }
  }, [analyzedLyrics, languageDistribution]);

  // Analyze current lyric when it changes
  useEffect(() => {
    if (currentLyric && !analyzedLyrics.has(currentLyric.id)) {
      analyzeLyric(currentLyric);
    }
  }, [currentLyric, analyzeLyric, analyzedLyrics]);

  // Get enhanced lyrics for display
  const enhancedLyrics = useMemo(() => {
    return lyrics.map(lyric => 
      analyzedLyrics.get(lyric.id) || lyric
    );
  }, [lyrics, analyzedLyrics]);

  // Get current enhanced lyric
  const currentEnhancedLyric = useMemo(() => {
    return currentLyric ? (analyzedLyrics.get(currentLyric.id) || currentLyric) : null;
  }, [currentLyric, analyzedLyrics]);

  // Calculate word origins from current enhanced lyric's etymology
  const wordOrigins = useMemo(() => {
    if (!currentEnhancedLyric?.etymology) return undefined;
    
    const origins = {
      sanskrit: 0,
      persian: 0,
      arabic: 0,
      english: 0,
    };
    
    Object.values(currentEnhancedLyric.etymology).forEach((etym: any) => {
      const originText = etym.origin?.toLowerCase() || '';
      if (originText.includes('sanskrit') || originText.includes('संस्कृत')) {
        origins.sanskrit++;
      } else if (originText.includes('persian') || originText.includes('फ़ारसी')) {
        origins.persian++;
      } else if (originText.includes('arabic') || originText.includes('अरबी')) {
        origins.arabic++;
      } else if (originText.includes('english')) {
        origins.english++;
      }
    });
    
    // Normalize to 0-1 range
    const total = Math.max(1, Object.values(origins).reduce((a, b) => a + b, 0));
    return {
      sanskrit: origins.sanskrit / total,
      persian: origins.persian / total,
      arabic: origins.arabic / total,
      english: origins.english / total,
    };
  }, [currentEnhancedLyric]);

  // Dynamic background based on current enhanced lyric's sentiment
  const backgroundStyle = currentEnhancedLyric?.visualization?.background 
    ? { background: currentEnhancedLyric.visualization.background }
    : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Pattern Background */}
      <DynamicBackground 
        wordOrigins={wordOrigins}
        sentiment={currentEnhancedLyric?.sentiment}
      />
      
      {/* Dynamic Gradient Background */}
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTranslations(!showTranslations)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    showTranslations 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/10 text-white/70 border border-white/20'
                  }`}
                >
                  {showTranslations ? '🌐 English' : '📜 Original'}
                </motion.button>
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
          <div className="flex flex-col min-h-screen">
            {/* Song Header */}
            <SongHeader 
              title="मस्त मलंग"
              artist="Sufi Traditional"
              language="Hindi/Urdu"
            />

            {/* Lyrics Display */}
            <LyricsDisplay 
              lyrics={enhancedLyrics}
              currentTime={currentTime}
              currentLyric={currentLyric}
              showTranslations={showTranslations}
            />
            
            {/* Dynamic Etymology & Language Panels */}
            <div className="fixed top-32 left-4 z-20 space-y-4 max-w-sm">
              {/* Language Distribution */}
              {Object.values(languageDistribution).some(v => v > 0) && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LanguageOriginVisualizer
                    distribution={languageDistribution}
                    isActive={true}
                  />
                </motion.div>
              )}
            </div>
            
            {/* Etymology Timeline - Right Side */}
            <div className="fixed top-32 right-4 z-20 max-w-sm">
              {currentEnhancedLyric?.etymology && Object.values(currentEnhancedLyric.etymology).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <EtymologyTimeline
                    etymology={Object.values(currentEnhancedLyric.etymology)[0]}
                    isActive={true}
                  />
                </motion.div>
              )}
            </div>

            {/* Music Player */}
            <MusicPlayer
              audioFile="/songs/mast_malang.mp3"
              lyrics={lyrics}
              onTimeUpdate={setCurrentTime}
              onLyricChange={setCurrentLyric}
            />
          </div>
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
