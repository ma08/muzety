# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is an **Etymology Visualizer Music Player** built for the YC AI Coding Agents Hackathon. The project must use **Freestyle** infrastructure to be eligible for the "Best use of Freestyle" prize. It fits two hackathon categories:
- **Autonomous Reactive Agents**: Responds to audio timestamps without human prompts
- **Just-in-Time Software**: UI changes dynamically as the song plays

## Essential Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack on http://localhost:3000

# Build & Deploy
npm run build            # Build Next.js app for production
npm run deploy:freestyle # Deploy to Freestyle (requires FREESTYLE_API_KEY)

# Testing & Linting
npm run lint            # Run Next.js linter (no test suite configured)
```

## Required Environment Variables

Create `.env.local` with:
```
FREESTYLE_API_KEY=       # From https://admin.freestyle.sh
OPENAI_API_KEY=          # For AI-powered etymology and translations
```

## Architecture Overview

### Core Flow
1. **Audio playback** (`Howler.js`) drives the entire experience via timestamps
2. **Lyrics sync** automatically highlights current line based on audio position
3. **Etymology data** fetched from Wiktionary API, with OpenAI fallback
4. **Dynamic visualizations** generated based on sentiment analysis (particle effects, color gradients)
5. **Freestyle deployment** uses their SDK for serverless functions and web hosting

### Key Integration Points

#### Freestyle SDK (`lib/freestyle.ts`)
- Used for serverless code execution (etymology/sentiment analysis)
- Deployment via `freestyle.deployWeb()` 
- Must use Freestyle for hackathon prize eligibility

#### Audio-Lyrics Synchronization
- `MusicPlayer.tsx` uses `requestAnimationFrame` loop to update current time
- `LyricsDisplay.tsx` finds current lyric by comparing timestamps
- Critical: Audio must use `html5: true` in Howler config for compatibility

#### Etymology Pipeline
1. `etymologyService.ts` tries Wiktionary API first (free, real data)
2. Falls back to OpenAI GPT-4 via `/api/analyze` endpoint
3. Results cached in memory to reduce API calls
4. Pre-generated data in `preGeneratedData.ts` for demo (avoids API limits)

### Data Flow for Dynamic UI
```
Audio timestamp → Find current lyric → Trigger sentiment analysis → 
Update background gradient + particle effects + text colors → 
Show etymology on hover → Display translation overlay
```

## Current Song Assets

Location: `/public/songs/`
- `mast_malang.mp3` - Hindi/Urdu song audio
- `mast_malang.csv` - Timestamps format: `MM:SS,startTime,duration,text`
- Pre-generated etymologies for Hindi words like "मलंग" (mystic wanderer)

## Hackathon-Specific Considerations

1. **Freestyle Usage is Mandatory** - The project MUST demonstrate Freestyle features:
   - Serverless execution for real-time analysis
   - Web deployment to `.style.dev` domain
   - Consider using Freestyle Git API for versioning generated UI

2. **Time Constraints** - Optimizations for rapid development:
   - Pre-generated data reduces API latency during demos
   - Console logs removed for cleaner presentation
   - Debug panel can be re-enabled by uncommenting in `app/page.tsx`

3. **Demo Flow** - When presenting:
   - Emphasize autonomous reaction to audio (no human input needed)
   - Show etymology tooltips for cultural words
   - Highlight dynamic background changes with sentiment
   - Mention Freestyle infrastructure powering the backend

## Known Issues & Solutions

- **Lyrics not syncing**: Check if Howler loads successfully (see console)
- **Etymology not showing**: Wiktionary API may be slow, pre-generated data is fallback
- **Deployment fails**: Ensure `FREESTYLE_API_KEY` is set in environment

## Implementation Status

✅ Completed:
- Audio player with synchronized lyrics
- Sentiment-based particle effects and colors
- Etymology service with Wiktionary integration
- Translation overlay component
- Freestyle deployment script

🚧 In Progress:
- Etymology timeline visualization
- Dynamic background patterns based on word origins
- Real-time Wiktionary fetching optimization