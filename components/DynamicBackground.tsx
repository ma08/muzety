'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DynamicBackgroundProps {
  wordOrigins?: {
    sanskrit?: number;
    persian?: number;
    arabic?: number;
    english?: number;
  };
  sentiment?: {
    emotion: string;
    intensity: number;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export default function DynamicBackground({ wordOrigins, sentiment }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw patterns based on word origins
    if (wordOrigins) {
      const { sanskrit = 0, persian = 0, arabic = 0 } = wordOrigins;

      // Sanskrit-inspired Mandala patterns
      if (sanskrit > 0) {
        drawMandalaPattern(ctx, canvas.width, canvas.height, sanskrit);
      }

      // Persian-inspired geometric patterns
      if (persian > 0) {
        drawPersianPattern(ctx, canvas.width, canvas.height, persian);
      }

      // Arabic-inspired calligraphic swirls
      if (arabic > 0) {
        drawArabicPattern(ctx, canvas.width, canvas.height, arabic);
      }
    }

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wordOrigins, sentiment]);

  // Sanskrit Mandala Pattern
  const drawMandalaPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    ctx.strokeStyle = `rgba(255, 153, 51, ${intensity * 0.3})`; // Saffron color
    ctx.lineWidth = 1;

    // Draw concentric circles
    for (let i = 1; i <= 8; i++) {
      const radius = (maxRadius / 8) * i;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw petals
      const petalCount = i * 6;
      for (let j = 0; j < petalCount; j++) {
        const angle = (Math.PI * 2 / petalCount) * j;
        const petalX = centerX + Math.cos(angle) * radius;
        const petalY = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(petalX, petalY, radius / 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw radiating lines
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      );
      ctx.stroke();
    }
  };

  // Persian Geometric Pattern
  const drawPersianPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    ctx.strokeStyle = `rgba(70, 130, 180, ${intensity * 0.3})`; // Persian blue
    ctx.lineWidth = 1;

    const tileSize = 60;
    const cols = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * tileSize;
        const y = row * tileSize;

        // Draw star pattern
        drawEightPointedStar(ctx, x + tileSize / 2, y + tileSize / 2, tileSize / 3);
        
        // Draw interlacing lines
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tileSize, y + tileSize);
        ctx.moveTo(x + tileSize, y);
        ctx.lineTo(x, y + tileSize);
        ctx.stroke();
      }
    }
  };

  // Helper function for eight-pointed star
  const drawEightPointedStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      const r = i % 2 === 0 ? radius : radius / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  // Arabic Calligraphic Pattern
  const drawArabicPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) => {
    ctx.strokeStyle = `rgba(0, 128, 0, ${intensity * 0.3})`; // Islamic green
    ctx.lineWidth = 2;

    // Draw flowing curves reminiscent of Arabic calligraphy
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      
      ctx.moveTo(startX, startY);
      
      // Create bezier curves
      for (let j = 0; j < 4; j++) {
        const cp1x = startX + (Math.random() - 0.5) * 200;
        const cp1y = startY + (Math.random() - 0.5) * 200;
        const cp2x = startX + (Math.random() - 0.5) * 200;
        const cp2y = startY + (Math.random() - 0.5) * 200;
        const endX = startX + (Math.random() - 0.5) * 300;
        const endY = startY + (Math.random() - 0.5) * 300;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      }
      
      ctx.stroke();
    }

    // Add decorative dots
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Animated gradient overlay based on sentiment */}
      {sentiment && (
        <motion.div
          className="fixed inset-0 z-1 pointer-events-none"
          animate={{
            background: `linear-gradient(135deg, ${sentiment.colors.primary}20 0%, ${sentiment.colors.secondary}20 50%, ${sentiment.colors.accent}20 100%)`,
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      )}
    </>
  );
}