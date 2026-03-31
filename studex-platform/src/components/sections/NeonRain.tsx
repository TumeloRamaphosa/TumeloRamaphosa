"use client";

import { useEffect, useState } from "react";

interface RainDrop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function NeonRain() {
  const [drops, setDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    const generated: RainDrop[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setDrops(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-[1px] h-[80px] bg-gradient-to-b from-transparent via-cyber-cyan to-transparent"
          style={{
            left: `${drop.left}%`,
            animationName: "rain",
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
}
