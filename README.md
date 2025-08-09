# Etymology Visualizer Music Player

An innovative music player that enriches lyrics with etymological insights and dynamic sentiment-based visualizations. Built for the YC AI Coding Agents Hackathon using Freestyle infrastructure.

## Features

### Etymology Exploration
- Hover over words to see their linguistic origins
- View word evolution timelines (Sanskrit, Persian, Arabic origins)
- Discover related words and meanings
- Wiktionary-style tooltips with rich linguistic data

### Dynamic Visualizations
- **Sentiment-based backgrounds**: Colors change based on lyric emotion
- **Particle effects**: Different effects for different moods
  - Bubbles for joy
  - Falling leaves for melancholy
  - Sparks for energy
  - Waves for calm
  - Stars for passion
- **Real-time UI adaptation**: Visual elements respond to music timestamps

### Music Player
- Synchronized lyrics display
- Smooth scrolling and transitions
- Volume control and seek functionality
- Powered by Howler.js for reliable audio playback

## Tech Stack

- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Howler.js** for audio playback
- **Freestyle SDK** for deployment and serverless functions
- **Vercel AI SDK** for etymology and sentiment analysis

## Quick Start

### Prerequisites
- Node.js 18+
- Freestyle API key (get from [Freestyle Dashboard](https://admin.freestyle.sh))
- OpenAI API key (for etymology analysis)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd etymology-viz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
FREESTYLE_API_KEY=your_freestyle_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Freestyle

```bash
npm run deploy:freestyle
```

This will:
1. Build the Next.js application
2. Deploy to Freestyle's infrastructure
3. Provide you with a `.style.dev` URL

## Hackathon Categories

This project fits two YC Hackathon categories:

### Autonomous Reactive Agents
- Responds to audio timestamps automatically
- No human prompts needed during playback
- Adapts UI based on non-human signals (music timing)

### Just-in-Time Software
- UI changes dynamically as the song plays
- Each lyric line gets unique visualization
- Real-time sentiment-based adaptations

## Features Showcase

### Current Song: "Mast Malang"
- Hindi/Urdu lyrics with rich etymological history
- Sufi and Sanskrit word origins
- Cultural context preservation

### Etymology Examples
- **मलंग** (Malang): Persian/Sufi origin meaning "mystic wanderer"
- **वसुंधरा** (Vasundhara): Sanskrit meaning "Earth, holder of wealth"
- **संगीत** (Sangeet): Sanskrit origin meaning "harmonious sound"

## Built with Freestyle for YC AI Coding Agents Hackathon

Using **Freestyle** infrastructure for deployment and management of dynamically generated UI components.
