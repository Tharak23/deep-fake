'use client';

import { CSSProperties } from 'react';

type PlaceholderImageProps = {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  style?: CSSProperties;
};

const PlaceholderImage = ({
  width = 100,
  height = 100,
  text = 'Placeholder',
  bgColor = '#111827',
  textColor = '#94a3b8',
  className = '',
  style = {},
}: PlaceholderImageProps) => {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
    >
      <div className="text-center p-2">
        <div className="text-xs">{text}</div>
      </div>
    </div>
  );
};

export default PlaceholderImage; 