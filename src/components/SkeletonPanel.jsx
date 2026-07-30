import React from 'react';
import ImageWithFallback from './common/ImageWithFallback';

export default function SkeletonPanel({ skeletonUrl }) {
  return (
    <div className="skeleton-panel">
      <h4 className="studio-sub-title">骨架參考</h4>
      <div className="skeleton-canvas-box">
        <ImageWithFallback 
          src={skeletonUrl} 
          alt="骨架解剖圖" 
          className="anatomy-sketch-img" 
        />
      </div>
    </div>
  );
}
