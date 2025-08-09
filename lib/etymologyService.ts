import { Etymology } from './songParser';

interface WiktionaryResponse {
  query: {
    pages: {
      [key: string]: {
        pageid?: number;
        title?: string;
        extract?: string;
      };
    };
  };
}

class EtymologyService {
  private cache: Map<string, Etymology> = new Map();
  private wiktionaryBase = 'https://en.wiktionary.org/w/api.php';

  /**
   * Get etymology from Wiktionary or cache
   */
  async getEtymology(word: string, language: 'hi' | 'ur' | 'en' = 'hi'): Promise<Etymology | null> {
    // Check cache first
    const cacheKey = `${word}_${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try Wiktionary API
      const etymology = await this.fetchWiktionaryEtymology(word);
      if (etymology) {
        this.cache.set(cacheKey, etymology);
        return etymology;
      }
    } catch (error) {
      console.error('[Etymology] Wiktionary fetch failed:', error);
    }

    return null;
  }

  /**
   * Fetch etymology from Wiktionary API
   */
  private async fetchWiktionaryEtymology(word: string): Promise<Etymology | null> {
    const params = new URLSearchParams({
      action: 'query',
      titles: word,
      prop: 'extracts',
      format: 'json',
      origin: '*',
      exintro: 'true',
      explaintext: 'true',
    });

    try {
      const response = await fetch(`${this.wiktionaryBase}?${params}`);
      const data: WiktionaryResponse = await response.json();
      
      const pages = data.query?.pages;
      if (!pages) return null;

      const page = Object.values(pages)[0];
      if (!page?.extract) return null;

      return this.parseWiktionaryExtract(word, page.extract);
    } catch (error) {
      console.error('[Etymology] Wiktionary API error:', error);
      return null;
    }
  }

  /**
   * Parse Wiktionary extract to get etymology
   */
  private parseWiktionaryExtract(word: string, extract: string): Etymology | null {
    // Look for etymology section
    const etymologyMatch = extract.match(/Etymology[^\n]*\n([^=]+)/i);
    if (!etymologyMatch) {
      return this.createBasicEtymology(word, extract);
    }

    const etymologyText = etymologyMatch[1];
    
    // Extract origin language
    let origin = 'Unknown';
    if (etymologyText.includes('Sanskrit')) origin = 'Sanskrit';
    else if (etymologyText.includes('Persian')) origin = 'Persian';
    else if (etymologyText.includes('Arabic')) origin = 'Arabic';
    else if (etymologyText.includes('Hindi')) origin = 'Hindi';
    else if (etymologyText.includes('Urdu')) origin = 'Urdu';

    // Extract evolution (simplified)
    const evolution = this.extractEvolution(etymologyText);

    // Extract meaning
    const meaningMatch = extract.match(/\n1\.\s+([^\n]+)/);
    const meaning = meaningMatch ? meaningMatch[1] : 'Traditional meaning';

    return {
      word,
      origin,
      evolution,
      meaning,
      relatedWords: this.extractRelatedWords(extract),
    };
  }

  /**
   * Create basic etymology when full data isn't available
   */
  private createBasicEtymology(word: string, extract: string): Etymology {
    // Extract first definition as meaning
    const meaningMatch = extract.match(/\n1\.\s+([^\n]+)/);
    const meaning = meaningMatch ? meaningMatch[1] : 'Traditional meaning';

    return {
      word,
      origin: 'Traditional',
      evolution: [word],
      meaning,
      relatedWords: [],
    };
  }

  /**
   * Extract word evolution from etymology text
   */
  private extractEvolution(text: string): string[] {
    const evolution: string[] = [];
    
    // Look for arrow patterns or "from" patterns
    const fromMatches = text.match(/from\s+([^\s,]+)/gi);
    if (fromMatches) {
      fromMatches.forEach(match => {
        const word = match.replace(/from\s+/i, '').replace(/[.,;]/g, '');
        if (word && !evolution.includes(word)) {
          evolution.push(word);
        }
      });
    }

    return evolution.length > 0 ? evolution : ['Original form'];
  }

  /**
   * Extract related words from Wiktionary extract
   */
  private extractRelatedWords(extract: string): string[] {
    const related: string[] = [];
    
    // Look for "Derived terms" or "Related terms" section
    const relatedMatch = extract.match(/(?:Derived|Related) terms[^\n]*\n([^=]+)/i);
    if (relatedMatch) {
      const words = relatedMatch[1].match(/[^\s,;]+/g);
      if (words) {
        return words.slice(0, 3); // Return max 3 related words
      }
    }

    return related;
  }

  /**
   * Get multiple etymologies at once (batch)
   */
  async getMultipleEtymologies(words: string[]): Promise<Map<string, Etymology>> {
    const results = new Map<string, Etymology>();
    
    // Process in parallel but limit concurrency
    const promises = words.map(word => 
      this.getEtymology(word).then(ety => {
        if (ety) results.set(word, ety);
      })
    );

    await Promise.all(promises);
    return results;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const etymologyService = new EtymologyService();

// Helper function for quick etymology lookup
export async function getWordEtymology(word: string): Promise<Etymology | null> {
  return etymologyService.getEtymology(word);
}

// Helper function for batch etymology lookup
export async function getBatchEtymologies(words: string[]): Promise<Map<string, Etymology>> {
  return etymologyService.getMultipleEtymologies(words);
}