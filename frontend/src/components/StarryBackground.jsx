import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export default function StarryBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasSize();

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const drawStars = () => {
      // Determine star color based on theme
      // Since it's 'system' by default, we need to check document.documentElement.classList.contains('dark') 
      // but simpler: use CSS variable or just check if it has .dark
      const isDark = document.documentElement.classList.contains('dark');
      const starColor = isDark ? '255, 255, 255' : '15, 23, 42'; // White for dark mode, slate for light mode
      
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y -= star.speed;

        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    drawStars();

    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run effect if theme changes to update star color

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}
