export interface LyricLine {
  id: string;
  startTime: number; // in seconds
  endTime: number;
  text: string;
  etymology?: Record<string, Etymology>;
  sentiment?: SentimentAnalysis;
  visualization?: VisualizationConfig;
}

export interface Etymology {
  word: string;
  origin: string;
  evolution: string[];
  meaning: string;
  relatedWords?: string[];
}

export interface SentimentAnalysis {
  emotion: 'joy' | 'melancholy' | 'energy' | 'calm' | 'passionate' | 'reflective';
  intensity: number; // 0-1
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface VisualizationConfig {
  particleEffect?: 'bubbles' | 'leaves' | 'stars' | 'waves' | 'sparks';
  animation?: 'fade' | 'slide' | 'glow' | 'pulse' | 'float';
  background?: string; // CSS gradient
}

export interface Song {
  title: string;
  artist: string;
  audioFile: string;
  lyrics: LyricLine[];
}

export function parseCSVLyrics(csvContent: string): LyricLine[] {
  const lines = csvContent.trim().split('\n');
  console.log('[parseCSV] Processing', lines.length, 'lines');
  
  return lines.map((line, index) => {
    const parts = line.split(',');
    if (parts.length < 4) {
      console.warn('[parseCSV] Skipping invalid line:', line);
      return null;
    }
    
    const [timeStr, startTimeStr, durationStr, ...textParts] = parts;
    const text = textParts.join(',').trim();
    
    const startTime = parseFloat(startTimeStr);
    const duration = parseFloat(durationStr);
    const endTime = startTime + duration;
    
    console.log(`[parseCSV] Line ${index}: "${text}" from ${startTime}s to ${endTime}s`);
    
    return {
      id: `line-${index}`,
      startTime,
      endTime,
      text,
    };
  }).filter(Boolean) as LyricLine[];
}

export function parseSRTLyrics(srtContent: string): LyricLine[] {
  const blocks = srtContent.trim().split('\n\n');
  
  return blocks.map((block) => {
    const lines = block.split('\n');
    if (lines.length < 3) return null;
    
    const id = lines[0];
    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    
    if (!timeMatch) return null;
    
    const startTime = 
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;
    
    const endTime = 
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;
    
    const text = lines.slice(2).join(' ');
    
    return {
      id: `line-${id}`,
      startTime,
      endTime,
      text,
    };
  }).filter(Boolean) as LyricLine[];
}

// Pre-generated data for demo
export const mastMalangData: Song = {
  title: "Mast Malang",
  artist: "Unknown Artist",
  audioFile: "/songs/mast_malang.mp3",
  lyrics: [] // Will be populated from CSV
};