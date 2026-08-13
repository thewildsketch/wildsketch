import React from 'react';

export default function LightboxToolbar({
  isSkeletonBase = false,
  onClose,
  showHelp,
  onToggleHelp,
  showCoachMark,
  onDismissCoachMark,
  onGlobalReset,
  currentScale,
  onZoomIn,
  onZoomOut,
  adjustMode,
  onTogglePhotoLayer,
  onToggleSkeletonLayer,
  photoOpacity = 100,
  onPhotoOpacityChange,
  photoVisible = true,
  onTogglePhotoVisible,
  onResetPhotoLayer,
  skeletonOpacity = 80,
  onSkeletonOpacityChange,
  skeletonVisible = true,
  onToggleSkeletonVisible,
  onResetSkeletonLayer,
  skeletonInverted = true,
  onToggleInvert,
  hasSkeleton = true,
  showToast = false,
}) {
  const isCurrentLayerHidden = 
    (adjustMode === 'photo' && !photoVisible) || 
    (adjustMode === 'skeleton' && !skeletonVisible);

  const isZoomInDisabled = isCurrentLayerHidden || currentScale >= 4.0;
  const isZoomOutDisabled = isCurrentLayerHidden || currentScale <= 0.2;

  return (
    <div 
      className="lightbox-vertical-toolbar" 
      id="lightbox-vertical-toolbar"
      data-testid="lightbox-vertical-toolbar"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* 頂部獨立按鈕 1：[✕] 離開 */}
      <button 
        className="lightbox-circle-btn close-btn" 
        onClick={onClose} 
        aria-label="離開速寫室" 
        title="離開速寫室"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* 頂部獨立按鈕 2：[?] 說明按鈕與 Tooltip (僅在非純骨架燈箱時顯示) */}
      {!isSkeletonBase && (
        <div className="v-toolbar-item" style={{ position: 'relative' }}>
          <button 
            className={`lightbox-circle-btn help-trigger ${showHelp ? 'active' : ''}`} 
            id="lightbox-help-btn" 
            title="操作指南" 
            aria-label="操作指南" 
            onClick={onToggleHelp}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>

          {/* 首次使用氣泡提示 (Coach Mark) */}
          {showCoachMark && (
            <div className="lightbox-coach-mark" id="lightbox-coach-mark" style={{ display: 'block' }}>
              <span className="coach-mark-text">歡迎！首次使用可以點擊此處查看操作指南！</span>
              <button className="coach-mark-close-btn" onClick={onDismissCoachMark} aria-label="關閉提示">&times;</button>
            </div>
          )}

          <div 
            className={`lightbox-help-tooltip ${showHelp ? 'show' : ''}`} 
            id="lightbox-help-tooltip"
            onClick={onToggleHelp}
          >
            <button 
              className="tooltip-close-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleHelp(e);
              }} 
              aria-label="關閉指南"
            >
              &times;
            </button>
            <h4>速寫室操作指南</h4>
            <ul>
              <li><strong>畫布操作</strong>：左鍵拖曳可平移，滾動滾輪可縮放。</li>
              <li><strong>圖層獨立調整</strong>：點擊
                <svg className="inline-help-svg" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>照片或
                <svg className="inline-help-svg" viewBox="0 0 24 24">
                  <g transform="translate(12 12) scale(1.2) rotate(-45) translate(-12 -9.3)">
                    <path vectorEffect="non-scaling-stroke" d="M6.2 9.3 a2.3 2.3 0 1 1 3.6-2.7 h4.4 a2.3 2.3 0 1 1 3.6 2.7 a2.3 2.3 0 1 1-3.6 2.7 H9.8 a2.3 2.3 0 1 1-3.6-2.7z" />
                  </g>
                </svg>骨架後，平移與縮放僅作用於該圖層。
                <div style={{ margin: '4px 0px', fontWeight: 500 }}>圖層工具列支援：</div>
                <ul style={{ paddingLeft: '12px' }}>
                  <li>拖曳滑桿：調整此圖層透明度</li>
                  <li>
                    <svg className="inline-help-svg" viewBox="0 0 24 24">
                      <path d="M3 7v6h6"/>
                      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                    </svg>：復原此圖層至預設位置
                  </li>
                  <li>
                    <svg className="inline-help-svg" viewBox="0 0 24 24">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>：顯示／隱藏此圖層
                  </li>
                </ul>
                <div style={{ margin: '4px 0px', fontWeight: 500 }}>骨架圖層額外支援：</div>
                <ul style={{ paddingLeft: '12px' }}>
                  <li>
                    <svg className="inline-help-svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8"/>
                      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>
                    </svg>：切換骨架顏色（黑／白）
                  </li>
                </ul>
              </li>
              <li><strong>畫布重置</strong>：點擊
                <svg className="inline-help-svg" viewBox="0 0 24 24">
                  <g transform="translate(12 12) scale(0.85) translate(-11 -12)">
                    <polyline vectorEffect="non-scaling-stroke" points="1 4 1 10 7 10"></polyline>
                    <path vectorEffect="non-scaling-stroke" d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </g>
                </svg>一鍵還原所有圖層至初始狀態。
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 頂部獨立按鈕 3：[↺] 全域總還原 */}
      <button 
        className="lightbox-circle-btn reset-btn" 
        id="lightbox-global-reset-btn" 
        onClick={onGlobalReset} 
        aria-label="全域總重置" 
        title="全域總重置 (還原畫布與所有圖層)"
      >
        <svg viewBox="0 0 24 24">
          <g transform="translate(12 12) scale(0.85) translate(-11 -12)">
            <polyline vectorEffect="non-scaling-stroke" points="1 4 1 10 7 10"></polyline>
            <path vectorEffect="non-scaling-stroke" d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </g>
        </svg>
      </button>

      {/* 純粹縮放類分組膠囊：只有 ＋ 與 － */}
      <div className="v-toolbar-group canvas-group" id="v-canvas-group">
        <button 
          className="toolbar-btn" 
          onClick={onZoomIn} 
          title="放大" 
          aria-label="放大"
          disabled={isZoomInDisabled}
        >
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        <button 
          className="toolbar-btn" 
          onClick={onZoomOut} 
          title="縮小" 
          aria-label="縮小"
          disabled={isZoomOutDisabled}
        >
          <svg viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* 圖層類分組膠囊：照片, 骨架 */}
      {!isSkeletonBase && (
        <div className="v-toolbar-group layers-group" id="v-layers-group">
          {/* 照片圖層 */}
          <div className="v-toolbar-item" id="v-layer-photo-item" style={{ position: 'relative' }}>
            <button 
              className={`toolbar-btn ${adjustMode === 'photo' ? 'editing' : ''}`} 
              id="v-layer-photo-btn" 
              onClick={onTogglePhotoLayer} 
              title="照片圖層" 
              aria-label="照片圖層"
            >
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>

            {/* 照片 Popover 單行橫向膠囊：順序 [透明度滑桿] [還原圖層svg] [眼睛svg代表開關] */}
            <div 
              className={`v-layer-popover-row ${adjustMode === 'photo' ? 'show' : ''}`} 
              id="v-layer-photo-popover" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="slider-group" style={{ width: '105px', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>透明度</span>
                <input 
                  type="range" 
                  id="v-photo-opacity-slider" 
                  className="custom-range" 
                  min="0" 
                  max="100" 
                  value={photoOpacity} 
                  onChange={(e) => onPhotoOpacityChange(parseInt(e.target.value, 10))} 
                  title="調整照片不透明度" 
                  style={{ width: '60px' }}
                />
              </div>

              <button 
                className="toolbar-btn" 
                id="lightbox-reset-photo-btn" 
                onClick={onResetPhotoLayer} 
                title="還原照片位置與縮放" 
                aria-label="還原照片位置與縮放"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 7v6h6"/>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                </svg>
              </button>

              <button 
                className={`toolbar-btn ${photoVisible ? 'active' : ''}`} 
                id="v-photo-toggle-btn" 
                onClick={onTogglePhotoVisible} 
                title="顯示/隱藏照片" 
                aria-label="顯示/隱藏照片"
              >
                {photoVisible ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 骨架圖層 */}
          <div className="v-toolbar-item" id="v-layer-skeleton-item" style={{ position: 'relative' }}>
            <button 
              className={`toolbar-btn ${adjustMode === 'skeleton' ? 'editing' : ''}`} 
              id="v-layer-skeleton-btn" 
              onClick={onToggleSkeletonLayer} 
              title="骨架圖層 (點擊進入/退出微調對齊)" 
              aria-label="骨架圖層"
            >
              <svg viewBox="0 0 24 24">
                <g transform="translate(12 12) scale(1.2) rotate(-45) translate(-12 -9.3)">
                  <path vectorEffect="non-scaling-stroke" d="M6.2 9.3 a2.3 2.3 0 1 1 3.6-2.7 h4.4 a2.3 2.3 0 1 1 3.6 2.7 a2.3 2.3 0 1 1-3.6 2.7 H9.8 a2.3 2.3 0 1 1-3.6-2.7z" />
                </g>
              </svg>
            </button>

            <div className={`lightbox-toast-msg ${showToast ? 'show' : ''}`} id="lightbox-toast-msg">
              此照片尚未產製疊加骨架
            </div>

            {/* 骨架 Popover 單行橫向膠囊：順序 [透明度滑桿] [還原骨架對齊svg] [色相切換svg] [眼睛svg代表開關] */}
            <div 
              className={`v-layer-popover-row ${adjustMode === 'skeleton' ? 'show' : ''}`} 
              id="v-layer-skeleton-popover" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="slider-group" style={{ width: '105px', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>透明度</span>
                <input 
                  type="range" 
                  id="v-skeleton-opacity-slider" 
                  className="custom-range" 
                  min="0" 
                  max="100" 
                  value={skeletonOpacity} 
                  disabled={!hasSkeleton}
                  onChange={(e) => onSkeletonOpacityChange(parseInt(e.target.value, 10))} 
                  title="調整骨架不透明度" 
                  style={{ width: '60px' }}
                />
              </div>

              <button 
                className="toolbar-btn" 
                id="lightbox-reset-skeleton-btn" 
                onClick={onResetSkeletonLayer} 
                title="還原骨架對齊位置與縮放" 
                aria-label="還原骨架對齊位置與縮放"
                disabled={!hasSkeleton}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 7v6h6"/>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                </svg>
              </button>

              <button 
                className={`toolbar-btn ${skeletonInverted ? 'active' : ''}`} 
                id="lightbox-invert-btn" 
                onClick={onToggleInvert} 
                title="切換骨架顏色 (黑/白)" 
                aria-label="切換骨架顏色"
                disabled={!hasSkeleton}
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8"/>
                  <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>
                </svg>
              </button>

              <button 
                className={`toolbar-btn ${skeletonVisible ? 'active' : ''}`} 
                id="v-skeleton-toggle-btn" 
                onClick={onToggleSkeletonVisible} 
                title="顯示/隱藏骨架" 
                aria-label="顯示/隱藏骨架"
                disabled={!hasSkeleton}
              >
                {skeletonVisible ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
