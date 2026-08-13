import React, { useState, useEffect, useRef, useCallback } from 'react';
import ImageWithFallback from './common/ImageWithFallback';
import { getAssetUrl } from '../utils/assetHelper';
import LightboxToolbar from './LightboxToolbar';
import useCanvasViewport from '../hooks/useCanvasViewport';

export default function PhotoLightboxModal({ imageUrl, skeletonUrl, onClose }) {
  const [photoOpacity, setPhotoOpacity] = useState(100);
  const [photoVisible, setPhotoVisible] = useState(true);

  const [skeletonOpacity, setSkeletonOpacity] = useState(80);
  const [skeletonVisible, setSkeletonVisible] = useState(true);
  const [skeletonInverted, setSkeletonInverted] = useState(true);
  const [skeletonError, setSkeletonError] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const {
    viewportRef,
    isDragging,
    adjustMode,
    setAdjustMode,
    canvasTransform,
    photoTransform,
    skeletonTransform,
    currentScale,
    zoomIn,
    zoomOut,
    reset,
    resetLayer,
  } = useCanvasViewport({ photoVisible, skeletonVisible });

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

  const toastTimerRef = useRef(null);

  const dismissToast = useCallback(() => {
    setShowToast(false);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const handleBackdropPointerDown = useCallback(() => {
    dismissToast();
    setShowHelp(false);
  }, [dismissToast]);

  const handleClose = useCallback(() => {
    dismissCoachMark();
    dismissToast();
    setShowHelp(false);
    onClose();
  }, [dismissCoachMark, dismissToast, onClose]);

  const toggleHelp = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    dismissToast();
    setShowHelp((prev) => !prev);
    dismissCoachMark();
  }, [dismissCoachMark, dismissToast]);

  const triggerToast = useCallback(() => {
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  }, []);

  // Preload & verify skeleton URL image validity on mount / URL change
  useEffect(() => {
    setShowToast(false);

    if (!skeletonUrl || skeletonUrl.trim() === '') {
      setSkeletonError(true);
      setSkeletonLoading(false);
      return;
    }

    setSkeletonError(false);
    setSkeletonLoading(true);

    const testImg = new Image();
    testImg.onload = () => {
      setSkeletonError(false);
    };
    testImg.onerror = () => {
      setSkeletonError(true);
      setSkeletonLoading(false);
    };
    testImg.src = getAssetUrl(skeletonUrl);
  }, [skeletonUrl]);

  const hasSkeleton = Boolean(skeletonUrl && !skeletonError);

  const handleTogglePhotoLayer = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    dismissToast();
    setAdjustMode(adjustMode === 'photo' ? 'sync' : 'photo');
  }, [adjustMode, setAdjustMode, dismissToast]);

  const handleToggleSkeletonLayer = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!hasSkeleton) {
      triggerToast();
      return;
    }
    dismissToast();
    setAdjustMode(adjustMode === 'skeleton' ? 'sync' : 'skeleton');
  }, [hasSkeleton, adjustMode, setAdjustMode, triggerToast, dismissToast]);

  const handleGlobalReset = useCallback(() => {
    dismissToast();
    reset();
  }, [reset, dismissToast]);

  const handleResetPhotoLayer = useCallback(() => {
    dismissToast();
    resetLayer('photo');
  }, [resetLayer, dismissToast]);

  const handleResetSkeletonLayer = useCallback(() => {
    dismissToast();
    resetLayer('skeleton');
  }, [resetLayer, dismissToast]);

  const handleZoomIn = useCallback(() => {
    dismissToast();
    zoomIn();
  }, [zoomIn, dismissToast]);

  const handleZoomOut = useCallback(() => {
    dismissToast();
    zoomOut();
  }, [zoomOut, dismissToast]);

  const showSkeletonOutline = adjustMode === 'skeleton' && skeletonVisible && hasSkeleton;

  return (
    <div 
      className="lightbox-overlay lightbox-modal" 
      data-testid="lightbox-modal"
      onPointerDown={handleBackdropPointerDown}
    >
      <div 
        ref={viewportRef}
        className={`lightbox-viewport ${isDragging ? 'grabbing' : ''}`}
      >
        <div 
          className="lightbox-canvas-container lightbox-image-stage"
          style={{ 
            transform: `translate(${canvasTransform.position.x}px, ${canvasTransform.position.y}px) scale(${canvasTransform.scale})`,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            transition: isDragging ? 'none' : 'transform 0.05s linear'
          }}
        >
          <div
            style={{
              transform: `translate(${photoTransform.position.x}px, ${photoTransform.position.y}px) scale(${photoTransform.scale})`,
              transformOrigin: 'center center',
              opacity: photoVisible ? photoOpacity / 100 : 0,
              visibility: photoVisible ? 'visible' : 'hidden',
              pointerEvents: 'none',
              transition: isDragging ? 'none' : 'opacity 0.15s ease'
            }}
          >
            <ImageWithFallback 
              src={imageUrl} 
              alt="放大的參考照片" 
              className="lightbox-base-img" 
              draggable="false" 
            />
          </div>

          {hasSkeleton && (
            <img 
              src={getAssetUrl(skeletonUrl)} 
              alt="放大的骨架疊加層" 
              className={`lightbox-skeleton-overlay ${adjustMode === 'skeleton' ? 'adjusting' : ''} ${skeletonInverted ? 'inverted' : ''} ${skeletonLoading ? 'loading' : ''}`}
              style={{ 
                opacity: (skeletonVisible && !skeletonLoading) ? skeletonOpacity / 100 : 0,
                visibility: skeletonVisible ? 'visible' : 'hidden',
                transform: `translate(${skeletonTransform.position.x}px, ${skeletonTransform.position.y}px) scale(${skeletonTransform.scale})`,
                transformOrigin: 'center center',
                filter: skeletonInverted ? 'invert(1) brightness(1.3)' : 'none',
                outline: showSkeletonOutline ? '2.5px dashed var(--color-text-ink)' : 'none',
                pointerEvents: 'none',
                transition: isDragging ? 'none' : 'opacity 0.3s ease'
              }}
              onLoad={() => setSkeletonLoading(false)}
              onError={() => { setSkeletonError(true); setSkeletonLoading(false); }}
              draggable="false"
            />
          )}
        </div>

        {/* Loading Indicator — only controlled by skeletonLoading, NOT by skeletonVisible.
            This ensures the overlay persists even if user toggles skeleton visibility mid-download. */}
        {hasSkeleton && skeletonLoading && (
          <div className="lightbox-skeleton-loader" id="lightbox-skeleton-loader">
            <div className="loader-pencil-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </div>
            <span>骨架載入中...</span>
          </div>
        )}
      </div>

      <LightboxToolbar 
        isSkeletonBase={false}
        onClose={handleClose}
        showHelp={showHelp}
        onToggleHelp={toggleHelp}
        showCoachMark={showCoachMark}
        onDismissCoachMark={dismissCoachMark}
        onGlobalReset={handleGlobalReset}
        currentScale={currentScale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        adjustMode={adjustMode}
        onTogglePhotoLayer={handleTogglePhotoLayer}
        onToggleSkeletonLayer={handleToggleSkeletonLayer}
        photoOpacity={photoOpacity}
        onPhotoOpacityChange={(val) => { dismissToast(); setPhotoOpacity(val); }}
        photoVisible={photoVisible}
        onTogglePhotoVisible={() => { dismissToast(); setPhotoVisible(!photoVisible); }}
        onResetPhotoLayer={handleResetPhotoLayer}
        skeletonOpacity={skeletonOpacity}
        onSkeletonOpacityChange={(val) => { dismissToast(); setSkeletonOpacity(val); }}
        skeletonVisible={skeletonVisible}
        onToggleSkeletonVisible={() => { dismissToast(); setSkeletonVisible(!skeletonVisible); }}
        onResetSkeletonLayer={handleResetSkeletonLayer}
        skeletonInverted={skeletonInverted}
        onToggleInvert={() => { dismissToast(); setSkeletonInverted(!skeletonInverted); }}
        hasSkeleton={hasSkeleton}
        showToast={showToast}
      />
    </div>
  );
}
