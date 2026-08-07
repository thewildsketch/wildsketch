import React, { useState } from 'react';
import { getAssetUrl } from '../../utils/assetHelper';

export default function ImageWithFallback({ src, alt, className, fallbackClassName, style, ...props }) {
  const [isError, setIsError] = useState(false);
  const resolvedSrc = getAssetUrl(src);

  if (isError || !resolvedSrc) {
    return (
      <div 
        className={`img-fallback-box ${fallbackClassName || className || ''}`} 
        style={style} 
        data-testid="img-fallback-box"
      >
        <svg
          className="img-fallback-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-border-sketch)"
          strokeWidth="1.5"
          style={{ width: 32, height: 32, flexShrink: 0 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setIsError(true)}
      {...props}
    />
  );
}
