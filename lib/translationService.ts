import { v4 as uuidv4 } from 'uuid';

interface TranslationResult {
  detectedLanguage?: {
    language: string;
    score: number;
  };
  translations: Array<{
    text: string;
    to: string;
  }>;
}

class TranslationService {
  private cache: Map<string, string> = new Map();
  private endpoint: string;
  private region: string;
  private key: string;

  constructor() {
    // In browser, these will be undefined, so we'll rely on server-side API calls
    this.endpoint = typeof window === 'undefined' 
      ? (process.env.TRANSLATOR_TEXT_ENDPOINT || 'https://api.cognitive.microsofttranslator.com/')
      : 'https://api.cognitive.microsofttranslator.com/';
    this.region = typeof window === 'undefined'
      ? (process.env.TRANSLATOR_TEXT_REGION || 'eastus')
      : 'eastus';
    this.key = typeof window === 'undefined'
      ? (process.env.TRANSLATOR_KEY || '')
      : '';
  }

  /**
   * Translate text from Hindi/Urdu to English
   */
  async translate(text: string, targetLang: string = 'en'): Promise<string> {
    // Check cache first
    const cacheKey = `${text}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (!this.key) {
      console.warn('[Translation] No API key configured, returning original text');
      return text;
    }

    try {
      const url = `${this.endpoint}translate?api-version=3.0&to=${targetLang}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.key,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4(),
        },
        body: JSON.stringify([{ text }]),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const results: TranslationResult[] = await response.json();
      const translation = results[0]?.translations[0]?.text || text;
      
      // Cache the result
      this.cache.set(cacheKey, translation);
      
      return translation;
    } catch (error) {
      console.error('[Translation] API error:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<string> {
    if (!this.key) {
      return 'unknown';
    }

    try {
      const url = `${this.endpoint}detect?api-version=3.0`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.key,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4(),
        },
        body: JSON.stringify([{ text }]),
      });

      if (!response.ok) {
        throw new Error(`Language detection error: ${response.status}`);
      }

      const results = await response.json();
      return results[0]?.language || 'unknown';
    } catch (error) {
      console.error('[Translation] Language detection error:', error);
      return 'unknown';
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], targetLang: string = 'en'): Promise<string[]> {
    if (!this.key) {
      return texts;
    }

    try {
      const url = `${this.endpoint}translate?api-version=3.0&to=${targetLang}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.key,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4(),
        },
        body: JSON.stringify(texts.map(text => ({ text }))),
      });

      if (!response.ok) {
        throw new Error(`Batch translation error: ${response.status}`);
      }

      const results: TranslationResult[] = await response.json();
      return results.map((r, i) => {
        const translation = r.translations[0]?.text || texts[i];
        // Cache each result
        this.cache.set(`${texts[i]}_${targetLang}`, translation);
        return translation;
      });
    } catch (error) {
      console.error('[Translation] Batch translation error:', error);
      return texts;
    }
  }

  /**
   * Get poetic translation with cultural context
   */
  async getPoeticTranslation(text: string, context?: string): Promise<string> {
    // First get literal translation
    const literal = await this.translate(text);
    
    // If we have OpenAI configured, enhance with poetic translation
    if (process.env.OPENAI_API_KEY && context) {
      try {
        const response = await fetch('/api/poetic-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, literal, context }),
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.translation || literal;
        }
      } catch (error) {
        console.error('[Translation] Poetic enhancement failed:', error);
      }
    }
    
    return literal;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const translationService = new TranslationService();

// Helper functions
export async function translateText(text: string): Promise<string> {
  return translationService.translate(text);
}

export async function detectTextLanguage(text: string): Promise<string> {
  return translationService.detectLanguage(text);
}

export async function translateBatch(texts: string[]): Promise<string[]> {
  return translationService.translateBatch(texts);
}