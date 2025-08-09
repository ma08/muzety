'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { LyricLine } from '@/lib/songParser';
import { motion } from 'framer-motion';

interface MusicPlayerProps {
  audioFile: string;
  lyrics: LyricLine[];
  onTimeUpdate?: (currentTime: number) => void;
  onLyricChange?: (currentLyric: LyricLine | null) => void;
}

export default function MusicPlayer({ 
  audioFile, 
  lyrics, 
  onTimeUpdate, 
  onLyricChange 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const soundRef = useRef<Howl | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    
    // Clean up previous instance
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    // Initialize Howler with HTML5 audio preferred
    try {
      soundRef.current = new Howl({
        src: [audioFile],
        html5: true, // Force HTML5 Audio
        volume: volume,
        preload: true,
        onload: function(this: Howl) {
          const dur = this.duration();
          setDuration(dur);
        },
        onplay: function() {
        },
        onend: function() {
          setIsPlaying(false);
          setCurrentTime(0);
        },
        onloaderror: function(id) {
          console.error('[MusicPlayer] Failed to load audio, sound ID:', id);
          console.error('[MusicPlayer] Audio file path:', audioFile);
          // Try to check if file exists
          fetch(audioFile)
            .then(res => console.log('[MusicPlayer] File check status:', res.status))
            .catch(err => console.error('[MusicPlayer] File check error:', err));
        },
        onplayerror: function(id) {
          console.error('[MusicPlayer] Failed to play audio, sound ID:', id);
        }
      });
    } catch (error) {
      console.error('[MusicPlayer] Error initializing Howler:', error);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const updateTime = () => {
    if (soundRef.current && soundRef.current.playing()) {
      const current = soundRef.current.seek() as number;
      
      // Check if we got a valid time
      if (typeof current === 'number' && !isNaN(current)) {
        setCurrentTime(current);
        
        if (onTimeUpdate) {
          onTimeUpdate(current);
        }

        // Find current lyric
        const currentLyric = lyrics.find(
          (lyric) => current >= lyric.startTime && current < lyric.endTime
        );
        
        if (onLyricChange) {
          onLyricChange(currentLyric || null);
        }
      }

      // Continue animation loop
      animationRef.current = requestAnimationFrame(updateTime);
    }
  };

  // Start/stop animation loop when playing state changes
  useEffect(() => {
    if (isPlaying) {
      updateTime();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!soundRef.current) {
      return;
    }

    
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (soundRef.current) {
      soundRef.current.seek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8 mb-8 px-6"
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
          />
          <div className="flex justify-between mt-1 text-xs text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Control (Left) */}
          <div className="flex items-center gap-2 w-32">
            <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Play/Pause Button (Center) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>

          {/* Spacer for balance */}
          <div className="w-32" />
        </div>
      </div>
    </motion.div>
  );
}