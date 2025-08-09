'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranslationOverlayProps {
  originalText: string;
  translation?: string;
  isActive: boolean;
  showTranslation: boolean;
}

export default function TranslationOverlay({ 
  originalText, 
  translation,
  isActive,
  showTranslation 
}: TranslationOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState(translation || '');

  useEffect(() => {
    if (!translation && showTranslation && originalText) {
      fetchTranslation();
    }
  }, [originalText, showTranslation]);

  const fetchTranslation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText }),
      });
      
      const data = await response.json();
      if (data.translation) {
        setTranslatedText(data.translation);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showTranslation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isActive ? 0.9 : 0.5,
            y: 0 
          }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-center"
        >
          {isLoading ? (
            <div className="text-sm text-white/40 italic">
              Translating...
            </div>
          ) : (
            <div className={`
              text-sm md:text-base italic
              ${isActive ? 'text-white/70' : 'text-white/40'}
              transition-colors duration-300
            `}>
              {translatedText || 'Loading translation...'}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}