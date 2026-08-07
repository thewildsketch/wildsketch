import React, { useState, useEffect, useRef, useCallback } from 'react';
import ImageWithFallback from './common/ImageWithFallback';
import { getAssetUrl } from '../utils/assetHelper';
import LightboxToolbar from './LightboxToolbar';

const ZOOM_STEP = 0.05; // Spec defined zoom step (5%)

export default function PhotoLightboxModal({ imageUrl, skeletonUrl, onClose }) {
  // Base image zoom and position states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Decoupled skeleton overlay zoom and position states
  const [skeletonScale, setSkeletonScale] = useState(1);
  const [skeletonPosition, setSkeletonPosition] = useState({ x: 0, y: 0 });
  const [adjustMode, setAdjustMode] = useState('sync'); // 'sync' | 'skeleton'

  const [isDragging, setIsDragging] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [opacity, setOpacity] = useState(80);
  const [skeletonInverted, setSkeletonInverted] = useState(true); // Defaults to true (white lines)
  const [showControls, setShowControls] = useState(true);
  const [skeletonError, setSkeletonError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Guide tooltip and Coach Mark states
  const [showHelp, setShowHelp] = useState(false);
  const [showCoachMark, setShowCoachMark] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('wildsketch_lightbox_onboarded');
    if (!onboarded) {
      setShowCoachMark(true);
    }
  }, []);

  const dismissCoachMark = useCallback(() => {
    setShowCoachMark(false);
    localStorage.setItem('wildsketch_lightbox_onboarded', 'true');
  }, []);

  const handleClose = () => {
    dismissCoachMark();
    onClose();
  };

  const toggleHelp = (e) => {
    e.stopPropagation();
    setShowHelp((prev) => !prev);
    dismissCoachMark();
  };

  const viewportRef = useRef(null);
  const toastTimerRef = useRef(null);

  const triggerToast = () => {
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Preload & verify skeleton URL image validity on mount / URL change
  useEffect(() => {
    setShowToast(false);

    if (!skeletonUrl || skeletonUrl.trim() === '') {
      setSkeletonError(true);
      return;
    }

    setSkeletonError(false);
    const testImg = new Image();
    testImg.onload = () => {
      setSkeletonError(false);
    };
    testImg.onerror = () => {
      setSkeletonError(true);
    };
    testImg.src = getAssetUrl(skeletonUrl);
  }, [skeletonUrl]);

  // Automatically trigger toast prompt when overlay is enabled and skeleton error occurs
  useEffect(() => {
    if (isOverlay && skeletonError) {
      triggerToast();
    }
  }, [isOverlay, skeletonError]);

  // Wheel zoom handler supporting independent scale adjustments
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      if (adjustMode === 'skeleton') {
        setSkeletonScale((prev) => Math.max(0.2, Math.min(prev + delta, 4.0)));
      } else {
        setScale((prev) => Math.max(0.2, Math.min(prev + delta, 4.0)));
      }
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
  }, [adjustMode]);

  const handleZoomIn = () => {
    if (adjustMode === 'skeleton') {
      setSkeletonScale((prev) => Math.min(prev + ZOOM_STEP, 4.0));
    } else {
      setScale((prev) => Math.min(prev + ZOOM_STEP, 4.0));
    }
  };

  const handleZoomOut = () => {
    if (adjustMode === 'skeleton') {
      setSkeletonScale((prev) => Math.max(prev - ZOOM_STEP, 0.2));
    } else {
      setScale((prev) => Math.max(prev - ZOOM_STEP, 0.2));
    }
  };

  // Co-align reset: clears both image and skeleton scale/offset parameters back to central defaults
  // Spec: Reset should only restore scale and pan offset values. Keep skeletonInverted state.
  const handleReset = () => {
    if (adjustMode === 'skeleton') {
      setSkeletonScale(1);
      setSkeletonPosition({ x: 0, y: 0 });
      setSkeletonInverted(true);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setSkeletonScale(1);
      setSkeletonPosition({ x: 0, y: 0 });
      setSkeletonInverted(true);
    }
  };

  // Lock background scrolling and touch action when Lightbox is active
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

  // Ref hooks for synchronous event handling (prevents React render latency bugs)
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const skeletonPositionRef = useRef(skeletonPosition);
  const scaleRef = useRef(scale);
  const skeletonScaleRef = useRef(skeletonScale);
  const adjustModeRef = useRef(adjustMode);
  const touchDistRef = useRef(null);
  const initialScaleRef = useRef(1);

  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { skeletonPositionRef.current = skeletonPosition; }, [skeletonPosition]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { skeletonScaleRef.current = skeletonScale; }, [skeletonScale]);
  useEffect(() => { adjustModeRef.current = adjustMode; }, [adjustMode]);

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
      initialScaleRef.current = adjustModeRef.current === 'skeleton' ? skeletonScaleRef.current : scaleRef.current;
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    const { x, y } = getEventCoords(e);
    isDraggingRef.current = true;
    setIsDragging(true);

    if (adjustModeRef.current === 'skeleton') {
      dragStartRef.current = { x: x - skeletonPositionRef.current.x, y: y - skeletonPositionRef.current.y };
    } else {
      dragStartRef.current = { x: x - positionRef.current.x, y: y - positionRef.current.y };
    }
  }, []);

  const handleMove = useCallback((e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches && e.touches.length === 2 && touchDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ratio = dist / touchDistRef.current;
      const newScale = Math.max(0.2, Math.min(initialScaleRef.current * ratio, 4.0));

      if (adjustModeRef.current === 'skeleton') {
        setSkeletonScale(newScale);
      } else {
        setScale(newScale);
      }
      return;
    }

    if (!isDraggingRef.current) return;
    const { x, y } = getEventCoords(e);
    const newX = x - dragStartRef.current.x;
    const newY = y - dragStartRef.current.y;

    if (adjustModeRef.current === 'skeleton') {
      skeletonPositionRef.current = { x: newX, y: newY };
      setSkeletonPosition({ x: newX, y: newY });
    } else {
      positionRef.current = { x: newX, y: newY };
      setPosition({ x: newX, y: newY });
    }
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


  return (
    <div 
      className="lightbox-overlay" 
      data-testid="lightbox-modal"
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
    >
      {/* Right Controls Panel */}
      <div className="lightbox-right-controls" style={{ top: 'max(16px, env(safe-area-inset-top, 0px))' }}>
        <button className="lightbox-close-btn" onClick={handleClose} aria-label="關閉" title="關閉">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Info button and Tooltip */}
        <div className="lightbox-control-wrapper" style={{ position: 'relative' }}>
          <button 
            className={`lightbox-side-btn help-trigger ${showHelp ? 'active' : ''}`} 
            id="lightbox-help-btn" 
            title="操作指南" 
            aria-label="操作指南"
            onClick={toggleHelp}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>
          
          {showCoachMark && (
            <div className="lightbox-coach-mark" id="lightbox-coach-mark" style={{ display: 'block' }}>
              <span className="coach-mark-text">歡迎！首次使用可以點擊此處查看操作指南！</span>
              <button 
                className="coach-mark-close-btn" 
                onClick={(e) => { e.stopPropagation(); dismissCoachMark(); }} 
                aria-label="關閉提示"
              >
                &times;
              </button>
            </div>
          )}

          <div className={`lightbox-help-tooltip ${showHelp ? 'show' : ''}`}>
            <h4>速寫室操作指南</h4>
            <ul>
              <li><strong>畫布基本操作</strong>：在畫面上按住<strong>左鍵拖曳</strong>可平移畫面；滾動<strong>滾輪</strong>可縮放畫面。</li>
              <li><strong>骨架疊加</strong>：點擊 <svg className="inline-help-svg" viewBox="0 0 24 24"><g transform="translate(12 12) scale(1.3) rotate(-45) translate(-12 -9.3)"><path vectorEffect="non-scaling-stroke" d="M6.2 9.3 a2.3 2.3 0 1 1 3.6-2.7 h4.4 a2.3 2.3 0 1 1 3.6 2.7 a2.3 2.3 0 1 1-3.6 2.7 H9.8 a2.3 2.3 0 1 1-3.6-2.7z"/></g></svg> 開啟/關閉<strong>「疊加骨架」</strong>，拖曳滑桿可調整骨架不透明度。</li>
              <li><strong>骨架顏色</strong>：點擊 <svg className="inline-help-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg> 可切換黑／白，適應不同照片底色。</li>
              <li><strong>如何微調骨架對齊</strong>：
                <ol style={{ margin: '4px 0 0 16px', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--color-text-muted)', listStyleType: 'decimal' }}>
                  <li>點擊 <svg className="inline-help-svg" viewBox="0 0 24 24"><polyline points="5 9 3 12 5 15"/><polyline points="9 5 12 3 15 5"/><polyline points="15 19 12 21 9 19"/><polyline points="19 9 21 12 19 15"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg> 啟用<strong>「調整骨架位置」</strong>（需先啟用疊加骨架）。</li>
                  <li><strong>拖曳滑鼠</strong>：僅平移骨架（底圖照片不動）。</li>
                  <li><strong>滾動滾輪</strong>：僅縮放骨架。</li>
                  <li>再次點擊 <svg className="inline-help-svg" viewBox="0 0 24 24"><polyline points="5 9 3 12 5 15"/><polyline points="9 5 12 3 15 5"/><polyline points="15 19 12 21 9 19"/><polyline points="19 9 21 12 19 15"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>：鎖定位置並恢復對整張畫布的同步移動縮放。</li>
                </ol>
              </li>
              <li>點擊 <svg className="inline-help-svg" viewBox="0 0 24 24"><g transform="translate(12 12) scale(0.85) translate(-11 -12)"><polyline vectorEffect="non-scaling-stroke" points="1 4 1 10 7 10"></polyline><path vectorEffect="non-scaling-stroke" d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></g></svg>：一鍵將畫面與骨架全部還原至初始中央位置。</li>
            </ul>
          </div>
        </div>

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
          className="lightbox-canvas-container lightbox-image-stage"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <ImageWithFallback 
            src={imageUrl} 
            alt="放大的參考照片" 
            className="lightbox-base-img" 
            draggable="false" 
          />
          {isOverlay && skeletonUrl && !skeletonError && (
            <img 
              src={getAssetUrl(skeletonUrl)} 
              alt="放大的骨架疊加層" 
              className={`lightbox-skeleton-overlay ${adjustMode === 'skeleton' ? 'adjusting' : ''} ${skeletonInverted ? 'inverted' : ''}`}
              style={{ 
                opacity: opacity / 100,
                transform: `translate(${skeletonPosition.x}px, ${skeletonPosition.y}px) scale(${skeletonScale})`,
                transformOrigin: 'center center',
                filter: skeletonInverted ? 'invert(1) brightness(1.3)' : 'none' // Spec-compliant contrast filter to keep sketches rich in details
              }}
              onError={() => setSkeletonError(true)}
              draggable="false"
            />
          )}
        </div>
      </div>

      {showControls && (
        <div className="lightbox-toolbar-container">
          <LightboxToolbar 
            scale={scale}
            skeletonScale={skeletonScale}
            isSkeletonBase={false}
            isOverlay={isOverlay}
            opacity={opacity}
            skeletonInverted={skeletonInverted}
            adjustMode={adjustMode}
            skeletonUrl={skeletonUrl}
            skeletonError={skeletonError}
            showToast={showToast}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onToggleOverlay={setIsOverlay}
            onOpacityChange={setOpacity}
            onToggleInvert={() => setSkeletonInverted(!skeletonInverted)}
            onToggleAdjustMode={() => setAdjustMode(adjustMode === 'sync' ? 'skeleton' : 'sync')}
          />
        </div>
      )}
    </div>
  );
}
