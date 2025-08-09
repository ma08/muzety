import { Etymology, SentimentAnalysis, VisualizationConfig } from './songParser';

// Pre-generated data for demo (normally would be generated via AI)
export const preGeneratedData: Array<{
  translation?: string;
  etymology: Record<string, Etymology>;
  sentiment: SentimentAnalysis;
  visualization: VisualizationConfig;
}> = [
  // Line 1: "शो मोर"
  {
    translation: "Show more",
    etymology: {},
    sentiment: {
      emotion: 'energy',
      intensity: 0.6,
      colors: {
        primary: '#fbbf24',
        secondary: '#f59e0b',
        accent: '#dc2626',
      },
    },
    visualization: {
      particleEffect: 'sparks',
      animation: 'pulse',
      background: 'radial-gradient(circle at center, #fbbf2420, transparent)',
    },
  },
  // Line 2: "[संगीत]"
  {
    translation: "[Music]",
    etymology: {
      'संगीत': {
        word: 'संगीत',
        origin: 'Sanskrit',
        evolution: ['सम् + गीत', 'संगीत'],
        meaning: 'Music, harmonious sound',
        relatedWords: ['गीत', 'राग', 'स्वर'],
      },
    },
    sentiment: {
      emotion: 'calm',
      intensity: 0.5,
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
      },
    },
    visualization: {
      particleEffect: 'waves',
      animation: 'slide',
      background: 'linear-gradient(90deg, #6366f110, #8b5cf610)',
    },
  },
  // Line 3: "कि फ्रंट जा अपने ही रंग तू तू"
  {
    translation: "Go forth in your own colors, you",
    etymology: {
      'रंग': {
        word: 'रंग',
        origin: 'Sanskrit',
        evolution: ['रञ्ज', 'रङ्ग', 'रंग'],
        meaning: 'Color, hue, mood',
        relatedWords: ['रंगीन', 'रंजन', 'राग'],
      },
    },
    sentiment: {
      emotion: 'passionate',
      intensity: 0.7,
      colors: {
        primary: '#ec4899',
        secondary: '#db2777',
        accent: '#f472b6',
      },
    },
    visualization: {
      particleEffect: 'stars',
      animation: 'glow',
      background: 'radial-gradient(ellipse at top, #ec489925, transparent)',
    },
  },
  // Line 4: "कि हो जहां अपने ही संधू ए"
  {
    translation: "Where you are in your own essence",
    etymology: {
      'जहां': {
        word: 'जहां',
        origin: 'Persian',
        evolution: ['جهان', 'जहान', 'जहां'],
        meaning: 'World, where',
        relatedWords: ['जगत', 'दुनिया', 'संसार'],
      },
    },
    sentiment: {
      emotion: 'reflective',
      intensity: 0.6,
      colors: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        accent: '#8b5cf6',
      },
    },
    visualization: {
      particleEffect: 'waves',
      animation: 'fade',
      background: 'linear-gradient(135deg, #6d28d915, #7c3aed10)',
    },
  },
  // Line 5: "कि अ"
  {
    etymology: {},
    sentiment: {
      emotion: 'calm',
      intensity: 0.3,
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
      },
    },
    visualization: {
      particleEffect: 'bubbles',
      animation: 'fade',
      background: 'linear-gradient(180deg, #6366f115, transparent)',
    },
  },
  // Line 6: "एक व्यक्ति जहां अपने ही रंग तू हो जहां"
  {
    translation: "A person where you are in your own colors",
    etymology: {
      'व्यक्ति': {
        word: 'व्यक्ति',
        origin: 'Sanskrit',
        evolution: ['व्यक्त', 'व्यक्ति'],
        meaning: 'Person, individual',
        relatedWords: ['आत्मा', 'इंसान', 'मानव'],
      },
      'रंग': {
        word: 'रंग',
        origin: 'Sanskrit',
        evolution: ['रञ्ज', 'रङ्ग', 'रंग'],
        meaning: 'Color, essence',
        relatedWords: ['रंगीन', 'राग'],
      },
    },
    sentiment: {
      emotion: 'passionate',
      intensity: 0.8,
      colors: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f87171',
      },
    },
    visualization: {
      particleEffect: 'stars',
      animation: 'glow',
      background: 'radial-gradient(ellipse at top, #dc262625, transparent)',
    },
  },
  // Line 7: "अपने हिसंक तू बना ले छोटी सी दुनिया आज"
  {
    translation: "Create your own small world today",
    etymology: {
      'दुनिया': {
        word: 'दुनिया',
        origin: 'Arabic',
        evolution: ['دنيا', 'दुन्या', 'दुनिया'],
        meaning: 'World, universe',
        relatedWords: ['जहान', 'संसार', 'विश्व'],
      },
    },
    sentiment: {
      emotion: 'joy',
      intensity: 0.7,
      colors: {
        primary: '#10b981',
        secondary: '#34d399',
        accent: '#6ee7b7',
      },
    },
    visualization: {
      particleEffect: 'bubbles',
      animation: 'float',
      background: 'linear-gradient(135deg, #10b98120, #34d39910)',
    },
  },
  // Line 8: "हम अक्षत मलंग पूज ा"
  {
    translation: "We are the untouched mystic wanderers in worship",
    etymology: {
      'मलंग': {
        word: 'मलंग',
        origin: 'Persian/Sufi',
        evolution: ['ملنگ', 'मलंग'],
        meaning: 'Mystic wanderer, carefree',
        relatedWords: ['फकीर', 'सूफी', 'दरवेश'],
      },
      'अक्षत': {
        word: 'अक्षत',
        origin: 'Sanskrit',
        evolution: ['अ + क्षत', 'अक्षत'],
        meaning: 'Unbroken, whole',
        relatedWords: ['पूर्ण', 'समग्र'],
      },
    },
    sentiment: {
      emotion: 'passionate',
      intensity: 0.9,
      colors: {
        primary: '#9333ea',
        secondary: '#a855f7',
        accent: '#c084fc',
      },
    },
    visualization: {
      particleEffect: 'stars',
      animation: 'pulse',
      background: 'radial-gradient(circle at center, #9333ea20, transparent)',
    },
  },
  // Line 9: "मैं बोलूं बोलो"
  {
    translation: "I speak, you speak",
    etymology: {
      'बोलूं': {
        word: 'बोलूं',
        origin: 'Sanskrit',
        evolution: ['भाष्', 'बोल', 'बोलूं'],
        meaning: 'To speak, express',
        relatedWords: ['कहना', 'वचन', 'भाषा'],
      },
    },
    sentiment: {
      emotion: 'energy',
      intensity: 0.6,
      colors: {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        accent: '#fde047',
      },
    },
    visualization: {
      particleEffect: 'sparks',
      animation: 'pulse',
      background: 'radial-gradient(circle at center, #f59e0b20, transparent)',
    },
  },
  // Line 10: "वसुंधरा बोलूं तुम क्यों"
  {
    translation: "I speak of the earth, why do you?",
    etymology: {
      'वसुंधरा': {
        word: 'वसुंधरा',
        origin: 'Sanskrit',
        evolution: ['वसु + धरा', 'वसुंधरा'],
        meaning: 'Earth, one who holds wealth',
        relatedWords: ['पृथ्वी', 'भूमि', 'धरती'],
      },
    },
    sentiment: {
      emotion: 'reflective',
      intensity: 0.7,
      colors: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
      },
    },
    visualization: {
      particleEffect: 'waves',
      animation: 'fade',
      background: 'linear-gradient(135deg, #06b6d415, #0891b210)',
    },
  },
  // Default fallback for remaining lines
  ...Array(50).fill({
    etymology: {},
    sentiment: {
      emotion: 'calm' as const,
      intensity: 0.5,
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
      },
    },
    visualization: {
      particleEffect: 'waves' as const,
      animation: 'fade' as const,
      background: 'linear-gradient(135deg, #6366f120, #8b5cf610)',
    },
  }),
];