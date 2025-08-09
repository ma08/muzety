import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { etymologyService } from '@/lib/etymologyService';
import { Etymology, SentimentAnalysis, VisualizationConfig } from '@/lib/songParser';

export async function POST(request: Request) {
  try {
    const { text, timestamp, previousContext } = await request.json();
    
    console.log('[API] Analyzing:', text);

    // Extract interesting words
    const words = extractInterestingWords(text);
    
    // Get etymologies from Wiktionary first
    const etymologies = new Map<string, Etymology>();
    for (const word of words) {
      const etymology = await etymologyService.getEtymology(word);
      if (etymology) {
        etymologies.set(word, etymology);
      }
    }

    // For words without Wiktionary data, use AI
    const missingWords = words.filter(w => !etymologies.has(w));
    if (missingWords.length > 0) {
      const aiEtymologies = await generateAIEtymologies(missingWords, text);
      aiEtymologies.forEach((ety, word) => etymologies.set(word, ety));
    }

    // Generate translation
    const translation = await generateTranslation(text);

    // Generate sentiment and visualization
    const sentiment = await analyzeSentiment(text);
    const visualization = generateVisualization(sentiment);

    return NextResponse.json({
      translation,
      etymologies: Object.fromEntries(etymologies),
      sentiment,
      visualization,
      timestamp,
    });
  } catch (error) {
    console.error('[API] Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lyrics' },
      { status: 500 }
    );
  }
}

function extractInterestingWords(text: string): string[] {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall']);
  
  const words = text.toLowerCase().split(/\s+/)
    .map(w => w.replace(/[^a-z0-9अ-ह]/gi, ''))
    .filter(w => w.length > 3 && !commonWords.has(w));
  
  // For Hindi/Urdu words
  const hindiWords = text.split(/\s+/)
    .filter(w => /[अ-ह]/.test(w) || /[\u0600-\u06FF]/.test(w))
    .map(w => w.replace(/[^\u0900-\u097F\u0600-\u06FF]/g, ''));
  
  return [...new Set([...words, ...hindiWords])].slice(0, 5);
}

async function generateAIEtymologies(words: string[], context: string): Promise<Map<string, Etymology>> {
  const etymologies = new Map<string, Etymology>();
  
  try {
    const { text } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `For these Hindi/Urdu words from the lyric "${context}", provide etymologies:
      Words: ${words.join(', ')}
      
      Return a JSON array with this structure for each word:
      [{
        "word": "word",
        "origin": "Sanskrit/Persian/Arabic/etc",
        "evolution": ["oldest form", "middle form", "current form"],
        "meaning": "contextual meaning in this lyric",
        "relatedWords": ["max 3 related words"]
      }]`,
    });

    const results = JSON.parse(text);
    results.forEach((ety: Etymology) => {
      etymologies.set(ety.word, ety);
    });
  } catch (error) {
    console.error('[API] AI etymology generation failed:', error);
  }

  return etymologies;
}

async function generateTranslation(text: string): Promise<string> {
  try {
    const { text: translation } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `Translate this Hindi/Urdu lyric to English. Keep it poetic and contextual:
      "${text}"
      
      Return only the English translation, nothing else.`,
    });

    return translation;
  } catch (error) {
    console.error('[API] Translation failed:', error);
    return text; // Return original if translation fails
  }
}

async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const { text: result } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      prompt: `Analyze the sentiment of this Hindi/Urdu lyric: "${text}"
      
      Return JSON with:
      {
        "emotion": "one of: joy, melancholy, energy, calm, passionate, reflective",
        "intensity": 0.1 to 1.0,
        "colors": {
          "primary": "#hex",
          "secondary": "#hex",
          "accent": "#hex"
        }
      }`,
    });

    return JSON.parse(result);
  } catch (error) {
    console.error('[API] Sentiment analysis failed:', error);
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

function generateVisualization(sentiment: SentimentAnalysis): VisualizationConfig {
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