import React from 'react';
import './waveform.css'; // We'll add a CSS file for animation

const AnimatedWaveform: React.FC = () => (
  <div className="flex justify-center items-center w-full py-6">
    <svg
      className="w-full max-w-2xl h-16"
      viewBox="0 0 600 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="waveform-bars">
        {[...Array(32)].map((_, i) => (
          <rect
            key={i}
            x={i * 18}
            y={16}
            width={8}
            height={32}
            rx={4}
            className={`wave-bar bar-${i}`}
            fill={`hsl(${(i * 12) % 360}, 90%, 60%)`}
          />
        ))}
      </g>
    </svg>
  </div>
);

export default AnimatedWaveform; 