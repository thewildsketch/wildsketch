import React, { useState, useEffect, useRef } from 'react';
import ImageWithFallback from './common/ImageWithFallback';
import { getAssetUrl } from '../utils/assetHelper';

const WHEEL_ZOOM_STEP = 0.02;   // Zoom step per wheel scroll (2%)
const BUTTON_ZOOM_STEP = 0.01;  // Zoom step per +/- button click (1%)

export default function LightboxModal({ imageUrl, skeletonUrl, onClose }) {
  const isSkeletonBase = Boolean(imageUrl && imageUrl.includes('skeleton'));

  // Base image zoom and position states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Decoupled skeleton overlay zoom and position states
  const [skeletonScale, setSkeletonScale] = useState(1);
  const [skeletonPosition, setSkeletonPosition] = useState({ x: 0, y: 0 });
  const [adjustMode, setAdjustMode] = useState('sync'); // 'sync' | 'skeleton'

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isOverlay, setIsOverlay] = useState(false);
  const [opacity, setOpacity] = useState(80);
  const [skeletonInverted, setSkeletonInverted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [skeletonError, setSkeletonError] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
    if (isOverlay && skeletonError && !isSkeletonBase) {
      triggerToast();
    }
  }, [isOverlay, skeletonError, isSkeletonBase]);

  // Wheel zoom handler supporting independent scale adjustments
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP; // Finer zoom steps
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
    const delta = BUTTON_ZOOM_STEP;
    if (adjustMode === 'skeleton') {
      setSkeletonScale((prev) => Math.min(prev + delta, 4.0));
    } else {
      setScale((prev) => Math.min(prev + delta, 4.0));
    }
  };

  const handleZoomOut = () => {
    const delta = BUTTON_ZOOM_STEP;
    if (adjustMode === 'skeleton') {
      setSkeletonScale((prev) => Math.max(prev - delta, 0.2));
    } else {
      setScale((prev) => Math.max(prev - delta, 0.2));
    }
  };

  // Co-align reset: clears both image and skeleton scale/offset parameters back to central defaults
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

  // Drag listeners supporting individual layer translation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    if (adjustMode === 'skeleton') {
      setDragStart({ x: e.clientX - skeletonPosition.x, y: e.clientY - skeletonPosition.y });
    } else {
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (adjustMode === 'skeleton') {
      setSkeletonPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getAspectRatio = () => {
    if (imageUrl) {
      if (imageUrl.includes('front')) return { ratio: '1 / 1', val: 1 };
      if (imageUrl.includes('side')) return { ratio: '3 / 2', val: 1.5 };
      if (imageUrl.includes('threequarter')) return { ratio: '4 / 3', val: 1.3333 };
    }
    return { ratio: '3 / 2', val: 1.5 };
  };
  const { ratio: aspectRatio, val: aspectRatioVal } = getAspectRatio();

  // Load defaults depending on mode on mount
  useEffect(() => {
    if (isSkeletonBase) {
      setIsOverlay(true);
      setOpacity(100);
    } else {
      setIsOverlay(false);
      setOpacity(80);
    }
    setSkeletonInverted(true);
  }, [isSkeletonBase, imageUrl]);

  return (
    <div 
      className="lightbox-overlay" 
      data-testid="lightbox-modal"
      onMouseUp={handleMouseUp}
    >
      <button className="lightbox-close-btn" onClick={onClose} aria-label="✕">✕</button>

      <div 
        ref={viewportRef}
        className={`lightbox-viewport ${isDragging ? 'grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div 
          className={`lightbox-canvas-container lightbox-image-stage ${isSkeletonBase ? 'skeleton-base-active' : ''}`}
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            aspectRatio: isSkeletonBase ? aspectRatio : undefined,
            '--aspect-ratio-val': isSkeletonBase ? aspectRatioVal : undefined
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
              className="lightbox-skeleton-overlay" 
              style={{ 
                opacity: opacity / 100,
                transform: `translate(${skeletonPosition.x}px, ${skeletonPosition.y}px) scale(${skeletonScale})`,
                transformOrigin: 'center center',
                outline: adjustMode === 'skeleton' ? '2.5px dashed var(--color-text-ink)' : 'none',
                outlineOffset: '0px',
                filter: skeletonInverted ? 'brightness(0) invert(1)' : 'brightness(0)'
              }}
              onError={() => setSkeletonError(true)}
              draggable="false"
            />
          )}
        </div>
      </div>

      <div className="lightbox-toolbar-container" id="lightbox-toolbar-container">
        {showControls ? (
          <div className="lightbox-toolbar" id="lightbox-toolbar">
            {/* Canvas scale/zoom buttons */}
            <button className="toolbar-btn" onClick={handleZoomOut} aria-label="－">－</button>
            <span className="toolbar-text" id="lightbox-zoom-indicator" style={{ minWidth: '55px', textAlign: 'center' }}>
              {Math.round((adjustMode === 'skeleton' ? skeletonScale : scale) * 100)}%
            </span>
            <button className="toolbar-btn" onClick={handleZoomIn} aria-label="＋">＋</button>
            <button className="reset-btn" onClick={handleReset}>重置</button>

                        {!isSkeletonBase && (
              <>
                <div className="toolbar-divider" id="lightbox-divider-1"></div>

                {/* Overlay switch */}
                <label className="checkbox-container" id="lightbox-overlay-toggle-container" style={{ position: 'relative' }}>
                  <input 
                    type="checkbox"
                    checked={isOverlay}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsOverlay(checked);
                      if (!checked) {
                        setAdjustMode('sync');
                      }
                      if (checked && (!skeletonUrl || skeletonError)) {
                        triggerToast();
                      }
                    }}
                    aria-label="疊加骨架"
                  />
                  <div className="custom-checkbox"></div>
                  <span>疊加骨架</span>
                  <div className={`lightbox-toast-msg ${showToast ? 'show' : ''}`} id="lightbox-toast-msg">
                    此照片尚未產製對應骨架
                  </div>
                </label>

                {/* Opacity slider */}
                <div className="slider-group" id="lightbox-slider-group" style={{ width: '100px' }}>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    disabled={!isOverlay || !skeletonUrl || skeletonError}
                    onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                    className="custom-range"
                  />
                </div>

                <div className="toolbar-divider" id="lightbox-divider-2"></div>

                {/* Adjustment Mode Toggle */}
                <label 
                  className="checkbox-container" 
                  id="lightbox-adjust-label-container"
                  style={{
                    opacity: (isOverlay && skeletonUrl && !skeletonError) ? 1 : 0.5,
                    cursor: (isOverlay && skeletonUrl && !skeletonError) ? 'pointer' : 'not-allowed'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={isOverlay && adjustMode === 'skeleton'}
                    disabled={!isOverlay || !skeletonUrl || skeletonError}
                    onChange={(e) => setAdjustMode(e.target.checked ? 'skeleton' : 'sync')}
                    aria-label="調整骨架"
                  />
                  <div className="custom-checkbox"></div>
                  <span>調整骨架</span>
                </label>

                {/* Skeleton color inversion toggle */}
                <button 
                  className={`toolbar-btn icon-only-btn ${skeletonInverted ? 'active' : ''}`}
                  onClick={() => setSkeletonInverted(!skeletonInverted)}
                  disabled={!isOverlay || !skeletonUrl || skeletonError}
                  title="切換骨架顏色 (黑/白)"
                  aria-label="切換骨架顏色"
                  style={{
                    opacity: (isOverlay && skeletonUrl && !skeletonError) ? 1 : 0.35,
                    cursor: (isOverlay && skeletonUrl && !skeletonError) ? 'pointer' : 'not-allowed'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v20a10 10 0 0 0 0-20z" fill="currentColor"></path>
                  </svg>
                </button>

                <div className="toolbar-divider" id="lightbox-divider-3"></div>

                {/* Help button trigger */}
                <button className="toolbar-btn icon-only-btn help-trigger" id="lightbox-help-btn" title="操作說明" aria-label="操作說明">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </button>

                {/* Floating Help Tooltip */}
                <div className="lightbox-help-tooltip">
                  <h4>速寫室操作指南</h4>
                  <ul>
                    <li><strong>畫布基本操作</strong>：在畫面上按住<strong>左鍵拖曳</strong>可平移畫面；滾動<strong>滾輪</strong>可縮放畫面。</li>
                    <li><strong>骨架不透明度</strong>：勾選<strong>「疊加骨架」</strong>後，可滑動左側控制項調整不透明度。</li>
                    <li><strong>骨架顏色</strong>：點擊 ◑ 可切換黑／白，適應不同照片底色。</li>
                    <li><strong>如何微調骨架對齊</strong>：
                      <ol style={{ margin: '4px 0 0 16px', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--color-text-muted)', listStyleType: 'decimal' }}>
                        <li>勾選<strong>「調整骨架」</strong>（需先啟用疊加骨架）。</li>
                        <li><strong>拖曳滑鼠</strong>：僅平移骨架（底圖照片不動）。</li>
                        <li><strong>滾動滾輪</strong>：僅縮放骨架。</li>
                        <li><strong>取消</strong>勾選「調整骨架」：即可鎖定位置，並恢復對整張畫布的同步移動縮放。</li>
                      </ol>
                    </li>
                    <li><strong>點擊「重置」</strong>：一鍵將畫面與骨架全部還原至初始中央位置。</li>
                  </ul>
                </div>
              </>
            )}

            {/* Hide toolbar button */}
            <button className="toolbar-btn icon-only-btn" onClick={() => setShowControls(false)} title="隱藏工具列" aria-label="隱藏工具列">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        ) : (
          <button className="lightbox-mini-show-btn" id="lightbox-mini-show-btn" onClick={() => setShowControls(true)} title="顯示工具列" aria-label="顯示工具列">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

