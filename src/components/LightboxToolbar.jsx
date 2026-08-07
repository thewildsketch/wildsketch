import React from 'react';

export default function LightboxToolbar({
  isSkeletonBase,
  scale,
  skeletonScale,
  adjustMode,
  isOverlay,
  opacity,
  skeletonInverted,
  skeletonUrl,
  skeletonError,
  showToast,
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleOverlay,
  onOpacityChange,
  onToggleAdjustMode,
  onToggleInvert,
}) {
  const currentScale = adjustMode === 'skeleton' ? skeletonScale : scale;

  return (
    <div className="lightbox-toolbar" id="lightbox-toolbar">
      {/* 第一排/左側：畫布控制 */}
      <div className="toolbar-row canvas-row">
        <button 
          className="toolbar-btn icon-only-btn" 
          onClick={onZoomOut} 
          title="縮小" 
          aria-label="縮小"
        >
          <svg viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span className="toolbar-text" id="lightbox-zoom-indicator" style={{ minWidth: '55px', textAlign: 'center' }}>
          {Math.round(currentScale * 100)}%
        </span>
        <button 
          className="toolbar-btn icon-only-btn" 
          onClick={onZoomIn} 
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
          onClick={onReset} 
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

      {!isSkeletonBase && <div className="toolbar-divider" id="lightbox-divider-1"></div>}

      {/* 第二排/右側：骨架控制 */}
      {!isSkeletonBase && (
        <div className="toolbar-row skeleton-row" id="lightbox-skeleton-row">
          <div id="lightbox-overlay-toggle-wrapper" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <button 
              className={`toolbar-btn icon-only-btn ${isOverlay ? 'active' : ''}`} 
              id="lightbox-overlay-toggle-btn" 
              onClick={() => onToggleOverlay(!isOverlay)} 
              title="疊加骨架" 
              aria-label="疊加骨架"
            >
              <svg viewBox="0 0 24 24">
                <g transform="translate(12 12) scale(1.3) rotate(-45) translate(-12 -9.3)">
                  <path 
                    vectorEffect="non-scaling-stroke" 
                    d="M6.2 9.3 a2.3 2.3 0 1 1 3.6-2.7 h4.4 a2.3 2.3 0 1 1 3.6 2.7 a2.3 2.3 0 1 1-3.6 2.7 H9.8 a2.3 2.3 0 1 1-3.6-2.7z" 
                  />
                </g>
              </svg>
            </button>
            <div className={`lightbox-toast-msg ${showToast ? 'show' : ''}`} id="lightbox-toast-msg">
              此照片尚未產製疊加骨架
            </div>
          </div>

          <div className="slider-group" id="lightbox-slider-group" style={{ width: 'clamp(65px, 16vw, 90px)' }}>
            <input 
              type="range" 
              id="lightbox-opacity-slider" 
              className="custom-range" 
              min="0" 
              max="100" 
              value={opacity} 
              disabled={!isOverlay || !skeletonUrl || skeletonError}
              onChange={(e) => onOpacityChange(parseInt(e.target.value, 10))}
            />
          </div>

          <button 
            className={`toolbar-btn icon-only-btn ${adjustMode === 'skeleton' ? 'active' : ''}`} 
            id="lightbox-adjust-mode-btn" 
            onClick={() => onToggleAdjustMode(adjustMode !== 'skeleton')} 
            title="調整骨架位置" 
            aria-label="調整骨架位置" 
            disabled={!isOverlay || !skeletonUrl || skeletonError}
            style={{
              opacity: (isOverlay && skeletonUrl && !skeletonError) ? 1 : 0.35,
              cursor: (isOverlay && skeletonUrl && !skeletonError) ? 'pointer' : 'not-allowed'
            }}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="5 9 3 12 5 15"/>
              <polyline points="9 5 12 3 15 5"/>
              <polyline points="15 19 12 21 9 19"/>
              <polyline points="19 9 21 12 19 15"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
          </button>

          <button 
            className={`toolbar-btn icon-only-btn ${skeletonInverted ? 'active' : ''}`} 
            id="lightbox-invert-btn" 
            onClick={onToggleInvert} 
            title="切換骨架顏色 (黑/白)" 
            aria-label="切換骨架顏色" 
            disabled={!isOverlay || !skeletonUrl || skeletonError}
            style={{
              opacity: (isOverlay && skeletonUrl && !skeletonError) ? 1 : 0.35,
              cursor: (isOverlay && skeletonUrl && !skeletonError) ? 'pointer' : 'not-allowed'
            }}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8"/>
              <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
