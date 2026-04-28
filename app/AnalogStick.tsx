
"use client";
import React, { useState, useRef } from 'react';

interface AnalogStickProps {
  onMove: (data: { x: number; y: number }) => void;
}

const AnalogStick: React.FC<AnalogStickProps> = ({ onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !baseRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const baseX = rect.left + rect.width / 2;
    const baseY = rect.top + rect.height / 2;

    let dx = e.clientX - baseX;
    let dy = e.clientY - baseY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = rect.width / 2 - 20; // 20 is knob radius

    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }

    setPosition({ x: dx, y: dy });
    onMove({ x: dx, y: dy });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '50px',
        left: '50px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={baseRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: 'grab',
        }}
      />
    </div>
  );
};

export default AnalogStick;
