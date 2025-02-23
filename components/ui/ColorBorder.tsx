'use client';

import { useEffect, useState } from 'react';

const colorPalettes = [
  [
    'bg-blue-400', 'bg-blue-500', 'bg-blue-600',
    'bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600',
    'bg-teal-400', 'bg-teal-500', 'bg-teal-600',
    'bg-green-400', 'bg-green-500', 'bg-green-600'
  ],
  [
    'bg-orange-400', 'bg-orange-500', 'bg-orange-600',
    'bg-amber-400', 'bg-amber-500', 'bg-amber-600',
    'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600',
    'bg-red-400', 'bg-red-500', 'bg-red-600'
  ],
  [
    'bg-purple-400', 'bg-purple-500', 'bg-purple-600',
    'bg-fuchsia-400', 'bg-fuchsia-500', 'bg-fuchsia-600',
    'bg-pink-400', 'bg-pink-500', 'bg-pink-600',
    'bg-rose-400', 'bg-rose-500', 'bg-rose-600'
  ]
];

const generateSegments = () => {
  const numSegments = Math.floor(Math.random() * 5) + 8;
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  
  return Array.from({ length: numSegments }, () => ({
    width: `${Math.floor(Math.random() * 15 + 5)}%`,
    colorClass: palette[Math.floor(Math.random() * palette.length)],
  }));
};

export default function ColorBorder() {
  const [segments, setSegments] = useState<Array<{ width: string; colorClass: string }>>([]);

  useEffect(() => {
    setSegments(generateSegments());
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] flex">
      {segments.map((segment, index) => (
        <div
          key={index}
          className={segment.colorClass}
          style={{
            width: segment.width,
          }}
        />
      ))}
    </div>
  );
} 