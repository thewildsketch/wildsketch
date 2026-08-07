import React, { useState, useEffect, useRef, useCallback } from 'react';
import ImageWithFallback from './common/ImageWithFallback';

const ZOOM_STEP = 0.05; // Spec defined zoom step

export default function SkeletonLightboxModal({ imageUrl, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const viewportRef = useRef(null);

  // Wheel zoom handler
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setScale((prev) => Math.max(0.2, Math.min(prev + delta, 4.0)));
    };

    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + ZOOM_STEP, 4.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - ZOOM_STEP, 0.2));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Lock background scrolling when active
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    const origTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = origOverflow;
      document.body.style.touchAction = origTouchAction;
    };
  }, []);

  // Ref hooks for synchronous event handling
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const scaleRef = useRef(scale);
  const touchDistRef = useRef(null);
  const initialScaleRef = useRef(1);

  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const getEventCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = useCallback((e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistRef.current = Math.sqrt(dx * dx + dy * dy);
      initialScaleRef.current = scaleRef.current;
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    const { x, y } = getEventCoords(e);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: x - positionRef.current.x, y: y - positionRef.current.y };
  }, []);

  const handleMove = useCallback((e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches && e.touches.length === 2 && touchDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / touchDistRef.current;
      const newScale = Math.max(0.2, Math.min(initialScaleRef.current * ratio, 4.0));
      setScale(newScale);
      return;
    }

    if (!isDraggingRef.current) return;
    const { x, y } = getEventCoords(e);
    const newX = x - dragStartRef.current.x;
    const newY = y - dragStartRef.current.y;
    positionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  }, []);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    touchDistRef.current = null;
  }, []);

  // Attach drag listeners
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onTouchStart = (e) => handleStart(e);
    const onTouchMove = (e) => handleMove(e);
    const onTouchEnd = (e) => handleEnd(e);
    const onMouseDown = (e) => handleStart(e);
    const onMouseMove = (e) => {
      if (isDraggingRef.current) handleMove(e);
    };
    const onMouseUp = (e) => handleEnd(e);

    viewport.addEventListener('touchstart', onTouchStart, { passive: false });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: false });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: false });
    viewport.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
      viewport.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd]);

  const getAspectRatio = () => {
    if (imageUrl) {
      if (imageUrl.includes('front')) return { ratio: '1 / 1', val: 1 };
      if (imageUrl.includes('side')) return { ratio: '3 / 2', val: 1.5 };
      if (imageUrl.includes('threequarter')) return { ratio: '4 / 3', val: 1.3333 };
    }
    return { ratio: '3 / 2', val: 1.5 };
  };
  const { ratio: aspectRatio, val: aspectRatioVal } = getAspectRatio();

  const zoomPercent = Math.round(scale * 100);

  return (
    <div 
      className="lightbox-overlay" 
      data-testid="lightbox-modal"
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
    >
      {/* Right Controls Panel */}
      <div className="lightbox-right-controls" style={{ top: 'max(16px, env(safe-area-inset-top, 0px))' }}>
        <button className="lightbox-close-btn" onClick={onClose} aria-label="關閉" title="關閉">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <button 
          className={`lightbox-side-btn ${!showControls ? 'active' : ''}`} 
          id="lightbox-toggle-toolbar-btn" 
          onClick={() => setShowControls(!showControls)} 
          title={showControls ? "隱藏工具列" : "顯示工具列"} 
          aria-label={showControls ? "隱藏工具列" : "顯示工具列"}
        >
          {showControls ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          )}
        </button>
      </div>

      <div 
        ref={viewportRef}
        className={`lightbox-viewport ${isDragging ? 'grabbing' : ''}`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
      >
        <div 
          className="lightbox-canvas-container lightbox-image-stage skeleton-base-active"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            aspectRatio,
            '--aspect-ratio-val': aspectRatioVal
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

      {/* Simplified Single-Row Capsule Toolbar */}
      {showControls && (
        <div className="lightbox-toolbar-container">
          <div className="lightbox-toolbar" style={{ width: 'auto', maxWidth: '92vw' }}>
            <div className="toolbar-row canvas-row">
              <button 
                className="toolbar-btn icon-only-btn" 
                onClick={handleZoomOut} 
                title="縮小" 
                aria-label="縮小"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span className="toolbar-text" id="lightbox-zoom-indicator">{zoomPercent}%</span>
              <button 
                className="toolbar-btn icon-only-btn" 
                onClick={handleZoomIn} 
                title="放大" 
                aria-label="放大"
              >
                <svg viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button 
                className="toolbar-btn icon-only-btn" 
                onClick={handleReset} 
                title="重置畫面" 
                aria-label="重置畫面"
              >
                <svg viewBox="0 0 24 24">
                  <g transform="translate(12 12) scale(0.85) translate(-11 -12)">
                    <polyline vectorEffect="non-scaling-stroke" points="1 4 1 10 7 10"></polyline>
                    <path vectorEffect="non-scaling-stroke" d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
