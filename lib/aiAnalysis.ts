import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { Etymology, SentimentAnalysis, VisualizationConfig } from './songParser';

// Extract interesting words from a lyric line
function extractInterestingWords(text: string): string[] {
  // Remove common words and extract meaningful ones
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall']);
  
  const words = text.toLowerCase().split(/\s+/)
    .map(w => w.replace(/[^a-z0-9अ-ह]/gi, '')) // Keep English and Hindi chars
    .filter(w => w.length > 3 && !commonWords.has(w));
  
  // For Hindi/Urdu words, include shorter ones too
  const hindiWords = text.split(/\s+/)
    .filter(w => /[अ-ह]/.test(w) || /[\u0600-\u06FF]/.test(w));
  
  return [...new Set([...words, ...hindiWords])].slice(0, 5); // Max 5 words per line
}

// Get etymology for a word using AI
export async function getEtymology(word: string): Promise<Etymology> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `Provide a concise etymology for the word "${word}" (could be Hindi/Urdu/Sanskrit/English).
      Return JSON with this structure:
      {
        "word": "${word}",
        "origin": "Brief origin (e.g., Sanskrit, Arabic, Latin)",
        "evolution": ["Original form", "Middle form", "Current form"],
        "meaning": "Current meaning in context",
        "relatedWords": ["2-3 related words"]
      }`,
    });

    return JSON.parse(text);
  } catch (error) {
    // Fallback etymology
    return {
      word,
      origin: 'Unknown origin',
      evolution: [word],
      meaning: 'Contextual meaning',
      relatedWords: [],
    };
  }
}

// Analyze sentiment of a lyric line
export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const { text: result } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `Analyze the sentiment and emotion of this lyric line: "${text}"
      Consider cultural context if it's in Hindi/Urdu.
      Return JSON with:
      {
        "emotion": "one of: joy, melancholy, energy, calm, passionate, reflective",
        "intensity": 0.1 to 1.0,
        "colors": {
          "primary": "#hex color matching emotion",
          "secondary": "#complementary hex",
          "accent": "#accent hex"
        }
      }`,
    });

    return JSON.parse(result);
  } catch (error) {
    // Fallback sentiment
    return {
      emotion: 'calm',
      intensity: 0.5,
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
    };
  }
}

// Generate visualization config based on sentiment
export function generateVisualization(sentiment: SentimentAnalysis): VisualizationConfig {
  const visualizationMap: Record<string, VisualizationConfig> = {
    joy: {
      particleEffect: 'bubbles',
      animation: 'float',
      background: `linear-gradient(135deg, ${sentiment.colors.primary}20, ${sentiment.colors.secondary}10)`,
    },
    melancholy: {
      particleEffect: 'leaves',
      animation: 'fade',
      background: `linear-gradient(180deg, ${sentiment.colors.primary}15, transparent)`,
    },
    energy: {
      particleEffect: 'sparks',
      animation: 'pulse',
      background: `radial-gradient(circle at center, ${sentiment.colors.accent}20, transparent)`,
    },
    calm: {
      particleEffect: 'waves',
      animation: 'slide',
      background: `linear-gradient(90deg, ${sentiment.colors.primary}10, ${sentiment.colors.secondary}10)`,
    },
    passionate: {
      particleEffect: 'stars',
      animation: 'glow',
      background: `radial-gradient(ellipse at top, ${sentiment.colors.primary}25, transparent)`,
    },
    reflective: {
      particleEffect: 'waves',
      animation: 'fade',
      background: `linear-gradient(135deg, ${sentiment.colors.secondary}15, ${sentiment.colors.primary}10)`,
    },
  };

  return visualizationMap[sentiment.emotion] || visualizationMap.calm;
}

// Process a lyric line with all AI enhancements
export async function processLyricLine(text: string) {
  const interestingWords = extractInterestingWords(text);
  
  // Get etymology for interesting words
  const etymologyPromises = interestingWords.map(word => getEtymology(word));
  const etymologies = await Promise.all(etymologyPromises);
  
  const etymologyMap: Record<string, Etymology> = {};
  etymologies.forEach(ety => {
    etymologyMap[ety.word] = ety;
  });
  
  // Analyze sentiment
  const sentiment = await analyzeSentiment(text);
  
  // Generate visualization
  const visualization = generateVisualization(sentiment);
  
  return {
    etymology: etymologyMap,
    sentiment,
    visualization,
  };
}

// Batch process all lyrics (for pre-generation)
export async function processAllLyrics(lyrics: Array<{ text: string }>) {
  const results = [];
  
  for (const lyric of lyrics) {
    try {
      const processed = await processLyricLine(lyric.text);
      results.push(processed);
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error processing lyric: ${lyric.text}`, error);
      results.push({
        etymology: {},
        sentiment: {
          emotion: 'calm' as const,
          intensity: 0.5,
          colors: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#ec4899',
          },
        },
        visualization: {
          particleEffect: 'waves' as const,
          animation: 'fade' as const,
          background: 'linear-gradient(135deg, #6366f120, #8b5cf610)',
        },
      });
    }
  }
  
  return results;
}