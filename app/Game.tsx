
"use client";

import React, { useRef, useEffect, useState } from 'react';
import AnalogStick from './AnalogStick';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stickData, setStickData] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrameId: number;
    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 20,
      speed: 5,
    };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const gameLoop = () => {
      // Update player position
      const angle = Math.atan2(stickData.y, stickData.x);
      const magnitude = Math.sqrt(stickData.x ** 2 + stickData.y ** 2);

      if (magnitude > 0) {
          player.x += Math.cos(angle) * player.speed * (magnitude / 50);
          player.y += Math.sin(angle) * player.speed * (magnitude / 50);
      }


      // Boundary detection
      if (player.x - player.radius < 0) player.x = player.radius;
      if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
      if (player.y - player.radius < 0) player.y = player.radius;
      if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.fillStyle = 'blue';
      context.fill();
      context.closePath();

      animationFrameId = window.requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [stickData]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <AnalogStick onMove={setStickData} />
    </div>
  );
};

export default Game;
