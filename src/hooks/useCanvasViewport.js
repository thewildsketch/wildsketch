import { useState, useRef, useEffect, useCallback } from 'react';

const MIN_SCALE = 0.2;
const MAX_SCALE = 4.0;
const ZOOM_STEP = 0.05;

const clampScale = (scale) => {
  const rounded = Math.round(scale * 1000) / 1000;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, rounded));
};

const DEFAULT_TRANSFORM = {
  scale: 1,
  position: { x: 0, y: 0 },
};

/**
 * useCanvasViewport
 * 
 * Shared canvas transform and gesture viewport engine for WildSketch.
 * Encapsulates wheel zooming, mouse dragging, touch pan/pinch-to-zoom,
 * boundary clamping (0.2x ~ 4.0x), and multi-layer transform routing (sync / photo / skeleton).
 * 
 * Supports locking layer adjustments when the active layer is hidden.
 */
export default function useCanvasViewport(options = {}) {
  const { photoVisible = true, skeletonVisible = true } = options;

  const [canvasTransform, setCanvasTransform] = useState(DEFAULT_TRANSFORM);
  const [photoTransform, setPhotoTransform] = useState(DEFAULT_TRANSFORM);
  const [skeletonTransform, setSkeletonTransform] = useState(DEFAULT_TRANSFORM);
  const [adjustMode, setAdjustModeState] = useState('sync'); // 'sync' | 'photo' | 'skeleton'
  const [isDragging, setIsDragging] = useState(false);

  // Synchronous refs for accurate event handling
  const canvasTransformRef = useRef(canvasTransform);
  const photoTransformRef = useRef(photoTransform);
  const skeletonTransformRef = useRef(skeletonTransform);
  const adjustModeRef = useRef(adjustMode);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchDistRef = useRef(null);
  const initialScaleRef = useRef(1);

  const photoVisibleRef = useRef(photoVisible);
  const skeletonVisibleRef = useRef(skeletonVisible);

  useEffect(() => {
    canvasTransformRef.current = canvasTransform;
  }, [canvasTransform]);

  useEffect(() => {
    photoTransformRef.current = photoTransform;
  }, [photoTransform]);

  useEffect(() => {
    skeletonTransformRef.current = skeletonTransform;
  }, [skeletonTransform]);

  useEffect(() => {
    adjustModeRef.current = adjustMode;
  }, [adjustMode]);

  useEffect(() => {
    photoVisibleRef.current = photoVisible;
  }, [photoVisible]);

  useEffect(() => {
    skeletonVisibleRef.current = skeletonVisible;
  }, [skeletonVisible]);

  // Current scale helper
  const currentScale = (() => {
    if (adjustMode === 'skeleton') return skeletonTransform.scale;
    if (adjustMode === 'photo') return photoTransform.scale;
    return canvasTransform.scale;
  })();

  const setAdjustMode = useCallback((mode) => {
    adjustModeRef.current = mode;
    setAdjustModeState(mode);
  }, []);

  const getActiveTransform = useCallback(() => {
    const mode = adjustModeRef.current;
    if (mode === 'skeleton') return skeletonTransformRef.current;
    if (mode === 'photo') return photoTransformRef.current;
    return canvasTransformRef.current;
  }, []);

  const updateActiveScale = useCallback((updater) => {
    const mode = adjustModeRef.current;
    // Prevent adjustment if the active layer is hidden
    if (mode === 'skeleton' && !skeletonVisibleRef.current) return;
    if (mode === 'photo' && !photoVisibleRef.current) return;

    if (mode === 'skeleton') {
      setSkeletonTransform((prev) => {
        const newScale = typeof updater === 'function' ? updater(prev.scale) : updater;
        const next = { ...prev, scale: clampScale(newScale) };
        skeletonTransformRef.current = next;
        return next;
      });
    } else if (mode === 'photo') {
      setPhotoTransform((prev) => {
        const newScale = typeof updater === 'function' ? updater(prev.scale) : updater;
        const next = { ...prev, scale: clampScale(newScale) };
        photoTransformRef.current = next;
        return next;
      });
    } else {
      setCanvasTransform((prev) => {
        const newScale = typeof updater === 'function' ? updater(prev.scale) : updater;
        const next = { ...prev, scale: clampScale(newScale) };
        canvasTransformRef.current = next;
        return next;
      });
    }
  }, []);

  const updateActivePosition = useCallback((pos) => {
    const mode = adjustModeRef.current;
    // Prevent adjustment if the active layer is hidden
    if (mode === 'skeleton' && !skeletonVisibleRef.current) return;
    if (mode === 'photo' && !photoVisibleRef.current) return;

    if (mode === 'skeleton') {
      setSkeletonTransform((prev) => {
        const next = { ...prev, position: pos };
        skeletonTransformRef.current = next;
        return next;
      });
    } else if (mode === 'photo') {
      setPhotoTransform((prev) => {
        const next = { ...prev, position: pos };
        photoTransformRef.current = next;
        return next;
      });
    } else {
      setCanvasTransform((prev) => {
        const next = { ...prev, position: pos };
        canvasTransformRef.current = next;
        return next;
      });
    }
  }, []);

  const zoomIn = useCallback(() => {
    updateActiveScale((scale) => scale + ZOOM_STEP);
  }, [updateActiveScale]);

  const zoomOut = useCallback(() => {
    updateActiveScale((scale) => scale - ZOOM_STEP);
  }, [updateActiveScale]);

  const setZoom = useCallback((newScale) => {
    updateActiveScale(newScale);
  }, [updateActiveScale]);

  const reset = useCallback(() => {
    // Cancel any in-flight drag so dragStartRef doesn't become stale after the transforms reset
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      dragStartRef.current = { x: 0, y: 0 };
    }
    const freshTransform = { scale: 1, position: { x: 0, y: 0 } };
    canvasTransformRef.current = freshTransform;
    photoTransformRef.current = freshTransform;
    skeletonTransformRef.current = freshTransform;
    adjustModeRef.current = 'sync';
    setCanvasTransform(freshTransform);
    setPhotoTransform(freshTransform);
    setSkeletonTransform(freshTransform);
    setAdjustModeState('sync');
  }, []);

  const resetLayer = useCallback((layer) => {
    const freshTransform = { scale: 1, position: { x: 0, y: 0 } };
    // Cancel any in-flight drag when the active layer is being reset to prevent
    // dragStartRef from going stale (which would cause a position jump on next move)
    const mode = adjustModeRef.current;
    const isActiveLayer =
      (layer === 'skeleton' && mode === 'skeleton') ||
      (layer === 'photo' && mode === 'photo') ||
      (layer === 'canvas' && mode === 'sync');
    if (isActiveLayer && isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      dragStartRef.current = { x: 0, y: 0 };
    }
    if (layer === 'skeleton') {
      skeletonTransformRef.current = freshTransform;
      setSkeletonTransform(freshTransform);
    } else if (layer === 'photo') {
      photoTransformRef.current = freshTransform;
      setPhotoTransform(freshTransform);
    } else if (layer === 'canvas') {
      canvasTransformRef.current = freshTransform;
      setCanvasTransform(freshTransform);
    }
  }, []);

  // Lock body scroll and touch actions
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

  // Event handlers
  const handleWheel = useCallback((e) => {
    const mode = adjustModeRef.current;
    if (mode === 'skeleton' && !skeletonVisibleRef.current) return;
    if (mode === 'photo' && !photoVisibleRef.current) return;

    if (e.cancelable) e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    updateActiveScale((scale) => scale + delta);
  }, [updateActiveScale]);

  const handleStart = useCallback((e) => {
    const mode = adjustModeRef.current;
    if (mode === 'skeleton' && !skeletonVisibleRef.current) return;
    if (mode === 'photo' && !photoVisibleRef.current) return;

    if (e.button !== undefined && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();

    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistRef.current = Math.hypot(dx, dy);
      const active = getActiveTransform();
      initialScaleRef.current = active.scale;
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const active = getActiveTransform();
    dragStartRef.current = {
      x: clientX - active.position.x,
      y: clientY - active.position.y,
    };
    isDraggingRef.current = true;
    setIsDragging(true);
  }, [getActiveTransform]);

  const handleMove = useCallback((e) => {
    const mode = adjustModeRef.current;
    if (mode === 'skeleton' && !skeletonVisibleRef.current) return;
    if (mode === 'photo' && !photoVisibleRef.current) return;

    // Pinch zoom with 2 fingers
    if (e.touches && e.touches.length === 2 && touchDistRef.current) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchDistRef.current;
      const newScale = clampScale(initialScaleRef.current * ratio);
      updateActiveScale(newScale);
      return;
    }

    if (!isDraggingRef.current) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

    if (clientX === undefined || clientY === undefined) return;

    const newX = clientX - dragStartRef.current.x;
    const newY = clientY - dragStartRef.current.y;
    updateActivePosition({ x: newX, y: newY });
  }, [updateActiveScale, updateActivePosition]);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    touchDistRef.current = null;
  }, []);

  // Stable handler refs
  const handleWheelRef = useRef(handleWheel);
  const handleStartRef = useRef(handleStart);
  const handleMoveRef = useRef(handleMove);
  const handleEndRef = useRef(handleEnd);

  handleWheelRef.current = handleWheel;
  handleStartRef.current = handleStart;
  handleMoveRef.current = handleMove;
  handleEndRef.current = handleEnd;

  const onWheel = useCallback((e) => handleWheelRef.current(e), []);
  const onStart = useCallback((e) => handleStartRef.current(e), []);
  const onMove = useCallback((e) => handleMoveRef.current(e), []);
  const onEnd = useCallback(() => handleEndRef.current(), []);

  const attachedNodeRef = useRef(null);

  const attach = useCallback((node) => {
    if (!node) return;
    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('touchstart', onStart, { passive: false });
    node.addEventListener('touchmove', onMove, { passive: false });
    node.addEventListener('touchend', onEnd, { passive: false });
    node.addEventListener('touchcancel', onEnd, { passive: false });
    node.addEventListener('mousedown', onStart);
  }, [onWheel, onStart, onMove, onEnd]);

  const detach = useCallback((node) => {
    if (!node) return;
    node.removeEventListener('wheel', onWheel);
    node.removeEventListener('touchstart', onStart);
    node.removeEventListener('touchmove', onMove);
    node.removeEventListener('touchend', onEnd);
    node.removeEventListener('touchcancel', onEnd);
    node.removeEventListener('mousedown', onStart);
  }, [onWheel, onStart, onMove, onEnd]);

  // Window listeners for moving/releasing outside viewport bounds
  useEffect(() => {
    const onWindowMouseMove = (e) => {
      if (isDraggingRef.current) handleMoveRef.current(e);
    };
    const onWindowMouseUp = () => {
      if (isDraggingRef.current) handleEndRef.current();
    };
    const onWindowTouchMove = (e) => {
      if (isDraggingRef.current || touchDistRef.current) handleMoveRef.current(e);
    };
    const onWindowTouchEnd = () => {
      if (isDraggingRef.current || touchDistRef.current) handleEndRef.current();
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchmove', onWindowTouchMove, { passive: false });
    window.addEventListener('touchend', onWindowTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onWindowTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('touchend', onWindowTouchEnd);
      window.removeEventListener('touchcancel', onWindowTouchEnd);
    };
  }, []);

  // Stable ref holder created ONCE
  const viewportRefContainer = useRef(null);
  if (!viewportRefContainer.current) {
    let internalNode = null;
    viewportRefContainer.current = {
      get current() {
        return internalNode;
      },
      set current(node) {
        if (internalNode === node) return;
        if (internalNode) {
          detach(internalNode);
        }
        internalNode = node;
        attachedNodeRef.current = node;
        if (node) {
          attach(node);
        }
      },
    };
  }

  // Double guarantee: if React sets ref without invoking proxy or after mount
  useEffect(() => {
    const node = viewportRefContainer.current?.current;
    if (node && node !== attachedNodeRef.current) {
      if (attachedNodeRef.current) {
        detach(attachedNodeRef.current);
      }
      attachedNodeRef.current = node;
      attach(node);
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (attachedNodeRef.current) {
        detach(attachedNodeRef.current);
        attachedNodeRef.current = null;
      }
    };
  }, [detach]);

  return {
    viewportRef: viewportRefContainer.current,
    isDragging,
    adjustMode,
    setAdjustMode,
    canvasTransform,
    photoTransform,
    skeletonTransform,
    currentScale,
    zoomIn,
    zoomOut,
    setZoom,
    reset,
    resetLayer,
  };
}
