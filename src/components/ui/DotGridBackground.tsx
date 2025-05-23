import React from 'react';

const DotGridBackground: React.FC = () => (
  <svg
    className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30"
    width="100%"
    height="100%"
    style={{ minHeight: '100vh', minWidth: '100vw' }}
  >
    <defs>
      <pattern id="dot" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="2" fill="#3b3b3b" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dot)" />
  </svg>
);

export default DotGridBackground; 