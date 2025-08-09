'use client';

import { motion } from 'framer-motion';

interface SongHeaderProps {
  title: string;
  artist?: string;
  language?: string;
  year?: string;
}

export default function SongHeader({ 
  title, 
  artist = 'Traditional', 
  language = 'Hindi/Urdu',
  year
}: SongHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center pt-32 pb-12 px-6"
    >
      {/* Song Title */}
      <motion.h2 
        className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4"
        animate={{ 
          textShadow: [
            "0 0 20px rgba(255,255,255,0.3)",
            "0 0 40px rgba(255,255,255,0.5)",
            "0 0 20px rgba(255,255,255,0.3)",
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {title}
      </motion.h2>

      {/* Metadata */}
      <div className="flex items-center justify-center gap-4 text-white/60 text-sm md:text-base">
        {artist && (
          <>
            <span>{artist}</span>
            <span className="text-white/30">•</span>
          </>
        )}
        {language && (
          <>
            <span>{language}</span>
            {year && <span className="text-white/30">•</span>}
          </>
        )}
        {year && <span>{year}</span>}
      </div>

      {/* Decorative Line */}
      <motion.div 
        className="mt-8 mx-auto"
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </motion.div>
    </motion.div>
  );
}