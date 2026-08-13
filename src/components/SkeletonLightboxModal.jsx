import React from 'react';
import ImageWithFallback from './common/ImageWithFallback';
import LightboxToolbar from './LightboxToolbar';
import useCanvasViewport from '../hooks/useCanvasViewport';

export default function SkeletonLightboxModal({ imageUrl, onClose }) {
  const {
    viewportRef,
    isDragging,
    canvasTransform,
    currentScale,
    zoomIn,
    zoomOut,
    reset,
  } = useCanvasViewport();

  const getAspectRatio = () => {
    if (imageUrl) {
      if (imageUrl.includes('front')) return { ratio: '1 / 1', val: 1 };
      if (imageUrl.includes('side')) return { ratio: '3 / 2', val: 1.5 };
      if (imageUrl.includes('threequarter')) return { ratio: '4 / 3', val: 1.3333 };
    }
    return { ratio: '3 / 2', val: 1.5 };
  };
  const { ratio: aspectRatio, val: aspectRatioVal } = getAspectRatio();

  return (
    <div 
      className="lightbox-overlay lightbox-modal" 
      data-testid="lightbox-modal"
    >
      <div 
        ref={viewportRef}
        className={`lightbox-viewport ${isDragging ? 'grabbing' : ''}`}
      >
        <div 
          className="lightbox-canvas-container lightbox-image-stage skeleton-base-active"
          style={{ 
            transform: `translate(${canvasTransform.position.x}px, ${canvasTransform.position.y}px) scale(${canvasTransform.scale})`,
            transformOrigin: 'center center',
            aspectRatio,
            '--aspect-ratio-val': aspectRatioVal,
            pointerEvents: 'none',
            transition: isDragging ? 'none' : 'transform 0.05s linear'
          }}
        >
          <ImageWithFallback 
            src={imageUrl} 
            alt="放大的骨骼圖" 
            className="lightbox-skeleton-overlay" 
            fallbackClassName="lightbox-skeleton-fallback"
            style={{ 
              opacity: 1,
              transform: 'none',
              transformOrigin: 'center center',
              outline: 'none',
              filter: 'none' // Keep standard drawing grey-to-black strokes and detail labels
            }}
            draggable="false"
          />
        </div>
      </div>

      <LightboxToolbar 
        isSkeletonBase={true}
        onClose={onClose}
        showHelp={false}
        onToggleHelp={() => {}}
        showCoachMark={false}
        onDismissCoachMark={() => {}}
        onGlobalReset={reset}
        currentScale={currentScale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        adjustMode="sync"
      />
    </div>
  );
}
