import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useCanvasViewport from '../../../src/hooks/useCanvasViewport';

describe('useCanvasViewport Hook', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  });

  describe('Initial States', () => {
    it('returns expected default states', () => {
      const { result } = renderHook(() => useCanvasViewport());

      expect(result.current.canvasTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.photoTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.skeletonTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.adjustMode).toBe('sync');
      expect(result.current.currentScale).toBe(1);
      expect(result.current.isDragging).toBe(false);
      expect(result.current.viewportRef).toBeDefined();
      expect(typeof result.current.zoomIn).toBe('function');
      expect(typeof result.current.zoomOut).toBe('function');
      expect(typeof result.current.setZoom).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.resetLayer).toBe('function');
      expect(typeof result.current.setAdjustMode).toBe('function');
    });
  });

  describe('currentScale Helper & Mode Switching', () => {
    it('returns active layer scale based on adjustMode', () => {
      const { result } = renderHook(() => useCanvasViewport());

      // In sync mode
      act(() => {
        result.current.setZoom(1.5);
      });
      expect(result.current.canvasTransform.scale).toBe(1.5);
      expect(result.current.currentScale).toBe(1.5);

      // Switch to photo mode
      act(() => {
        result.current.setAdjustMode('photo');
      });
      expect(result.current.adjustMode).toBe('photo');
      expect(result.current.currentScale).toBe(1); // default photo scale

      act(() => {
        result.current.setZoom(2.0);
      });
      expect(result.current.photoTransform.scale).toBe(2.0);
      expect(result.current.currentScale).toBe(2.0);
      expect(result.current.canvasTransform.scale).toBe(1.5); // unchanged

      // Switch to skeleton mode
      act(() => {
        result.current.setAdjustMode('skeleton');
      });
      expect(result.current.adjustMode).toBe('skeleton');
      expect(result.current.currentScale).toBe(1); // default skeleton scale

      act(() => {
        result.current.setZoom(0.8);
      });
      expect(result.current.skeletonTransform.scale).toBe(0.8);
      expect(result.current.currentScale).toBe(0.8);
      expect(result.current.photoTransform.scale).toBe(2.0); // unchanged
      expect(result.current.canvasTransform.scale).toBe(1.5); // unchanged

      // Switch back to sync mode
      act(() => {
        result.current.setAdjustMode('sync');
      });
      expect(result.current.currentScale).toBe(1.5);
    });
  });

  describe('Zoom Actions (zoomIn, zoomOut, setZoom) and Clamping', () => {
    it('increases and decreases scale by 0.05 step for active layer', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.zoomIn();
      });
      expect(result.current.canvasTransform.scale).toBeCloseTo(1.05, 5);
      expect(result.current.currentScale).toBeCloseTo(1.05, 5);

      act(() => {
        result.current.zoomOut();
      });
      expect(result.current.canvasTransform.scale).toBeCloseTo(1.0, 5);
      expect(result.current.currentScale).toBeCloseTo(1.0, 5);
    });

    it('clamps scale between 0.2 and 4.0', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.setZoom(5.0);
      });
      expect(result.current.canvasTransform.scale).toBe(4.0);

      act(() => {
        result.current.zoomIn();
      });
      expect(result.current.canvasTransform.scale).toBe(4.0);

      act(() => {
        result.current.setZoom(0.1);
      });
      expect(result.current.canvasTransform.scale).toBe(0.2);

      act(() => {
        result.current.zoomOut();
      });
      expect(result.current.canvasTransform.scale).toBe(0.2);
    });

    it('modifies correct layer in photo and skeleton modes', () => {
      const { result } = renderHook(() => useCanvasViewport());

      // Photo mode
      act(() => {
        result.current.setAdjustMode('photo');
        result.current.zoomIn();
      });
      expect(result.current.photoTransform.scale).toBeCloseTo(1.05, 5);
      expect(result.current.canvasTransform.scale).toBe(1);
      expect(result.current.skeletonTransform.scale).toBe(1);

      // Skeleton mode
      act(() => {
        result.current.setAdjustMode('skeleton');
        result.current.zoomOut();
      });
      expect(result.current.skeletonTransform.scale).toBeCloseTo(0.95, 5);
      expect(result.current.photoTransform.scale).toBeCloseTo(1.05, 5);
      expect(result.current.canvasTransform.scale).toBe(1);
    });
  });

  describe('Reset and ResetLayer', () => {
    it('resetLayer only resets the specified layer without affecting others or adjustMode', () => {
      const { result } = renderHook(() => useCanvasViewport());

      // Set different transforms for each layer
      act(() => {
        result.current.setAdjustMode('sync');
        result.current.setZoom(1.2);
        result.current.setAdjustMode('photo');
        result.current.setZoom(1.4);
        result.current.setAdjustMode('skeleton');
        result.current.setZoom(1.6);
      });

      expect(result.current.adjustMode).toBe('skeleton');

      // Reset photo layer
      act(() => {
        result.current.resetLayer('photo');
      });
      expect(result.current.photoTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.skeletonTransform.scale).toBe(1.6);
      expect(result.current.canvasTransform.scale).toBe(1.2);
      expect(result.current.adjustMode).toBe('skeleton');

      // Reset skeleton layer
      act(() => {
        result.current.resetLayer('skeleton');
      });
      expect(result.current.skeletonTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.canvasTransform.scale).toBe(1.2);

      // Reset canvas layer
      act(() => {
        result.current.resetLayer('canvas');
      });
      expect(result.current.canvasTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
    });

    it('reset performs global reset on all layers and sets adjustMode back to sync', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.setAdjustMode('skeleton');
        result.current.setZoom(2.5);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.canvasTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.photoTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.skeletonTransform).toEqual({ scale: 1, position: { x: 0, y: 0 } });
      expect(result.current.adjustMode).toBe('sync');
      expect(result.current.currentScale).toBe(1);
    });
  });

  describe('Body Scroll Locking', () => {
    it('locks body and html scroll on mount and restores on unmount', () => {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'scroll';
      document.documentElement.style.scrollbarGutter = 'stable';

      const { unmount } = renderHook(() => useCanvasViewport());

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.touchAction).toBe('none');
      expect(document.documentElement.style.overflow).toBe('hidden');
      expect(document.documentElement.style.scrollbarGutter).toBe('auto');

      unmount();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.touchAction).toBe('auto');
      expect(document.documentElement.style.overflow).toBe('scroll');
      expect(document.documentElement.style.scrollbarGutter).toBe('stable');
    });
  });

  describe('DOM Gesture & Event Listeners', () => {
    let containerEl;

    beforeEach(() => {
      containerEl = document.createElement('div');
      document.body.appendChild(containerEl);
    });

    afterEach(() => {
      if (containerEl && containerEl.parentNode) {
        containerEl.parentNode.removeChild(containerEl);
      }
    });

    it('handles wheel zooming with preventDefault', () => {
      const { result } = renderHook(() => useCanvasViewport());

      // Attach mock element to viewportRef
      act(() => {
        result.current.viewportRef.current = containerEl;
      });

      // Re-trigger effect or attach listeners
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: -100, // Zoom in
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      act(() => {
        containerEl.dispatchEvent(wheelEvent);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(result.current.canvasTransform.scale).toBeCloseTo(1.05, 5);

      // Wheel zoom out
      const wheelOutEvent = new WheelEvent('wheel', {
        deltaY: 100, // Zoom out
        bubbles: true,
        cancelable: true,
      });
      act(() => {
        containerEl.dispatchEvent(wheelOutEvent);
      });

      expect(result.current.canvasTransform.scale).toBeCloseTo(1.0, 5);
    });

    it('handles mouse drag for panning and tracking isDragging', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.viewportRef.current = containerEl;
      });

      // Mousedown on viewport
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        containerEl.dispatchEvent(mouseDownEvent);
      });

      expect(result.current.isDragging).toBe(true);

      // Mousemove on window
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 130,
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(mouseMoveEvent);
      });

      expect(result.current.canvasTransform.position).toEqual({ x: 50, y: 30 });

      // Mouseup on window
      const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
      });

      act(() => {
        window.dispatchEvent(mouseUpEvent);
      });

      expect(result.current.isDragging).toBe(false);
      expect(result.current.canvasTransform.position).toEqual({ x: 50, y: 30 });
    });

    it('routes mouse drag to active layer (photo & skeleton)', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.viewportRef.current = containerEl;
        result.current.setAdjustMode('photo');
      });

      // Drag photo
      act(() => {
        containerEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 200, clientY: 200, bubbles: true, cancelable: true }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 220, clientY: 250, bubbles: true, cancelable: true }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      });

      expect(result.current.photoTransform.position).toEqual({ x: 20, y: 50 });
      expect(result.current.canvasTransform.position).toEqual({ x: 0, y: 0 });
      expect(result.current.skeletonTransform.position).toEqual({ x: 0, y: 0 });

      // Switch to skeleton and drag
      act(() => {
        result.current.setAdjustMode('skeleton');
      });
      act(() => {
        containerEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 50, clientY: 50, bubbles: true, cancelable: true }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 40, bubbles: true, cancelable: true }));
      });
      act(() => {
        window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      });

      expect(result.current.skeletonTransform.position).toEqual({ x: -20, y: -10 });
      expect(result.current.photoTransform.position).toEqual({ x: 20, y: 50 });
      expect(result.current.canvasTransform.position).toEqual({ x: 0, y: 0 });
    });

    it('handles touch drag (single finger) and pinch-to-zoom (2 fingers)', () => {
      const { result } = renderHook(() => useCanvasViewport());

      act(() => {
        result.current.viewportRef.current = containerEl;
      });

      // Single touch drag
      const touchStart = new Event('touchstart', { bubbles: true, cancelable: true });
      Object.defineProperty(touchStart, 'touches', {
        value: [{ clientX: 100, clientY: 100 }],
      });

      act(() => {
        containerEl.dispatchEvent(touchStart);
      });
      expect(result.current.isDragging).toBe(true);

      const touchMove = new Event('touchmove', { bubbles: true, cancelable: true });
      Object.defineProperty(touchMove, 'touches', {
        value: [{ clientX: 140, clientY: 160 }],
      });
      act(() => {
        containerEl.dispatchEvent(touchMove);
      });
      expect(result.current.canvasTransform.position).toEqual({ x: 40, y: 60 });

      const touchEnd = new Event('touchend', { bubbles: true, cancelable: true });
      Object.defineProperty(touchEnd, 'touches', {
        value: [],
      });
      act(() => {
        containerEl.dispatchEvent(touchEnd);
      });
      expect(result.current.isDragging).toBe(false);

      // Pinch to zoom (2 fingers)
      const pinchStart = new Event('touchstart', { bubbles: true, cancelable: true });
      Object.defineProperty(pinchStart, 'touches', {
        value: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 }, // distance = 100
        ],
      });
      act(() => {
        containerEl.dispatchEvent(pinchStart);
      });
      expect(result.current.isDragging).toBe(false);

      const pinchMove = new Event('touchmove', { bubbles: true, cancelable: true });
      Object.defineProperty(pinchMove, 'touches', {
        value: [
          { clientX: 50, clientY: 100 },
          { clientX: 250, clientY: 100 }, // distance = 200 (ratio = 2.0)
        ],
      });
      act(() => {
        containerEl.dispatchEvent(pinchMove);
      });

      expect(result.current.canvasTransform.scale).toBe(2.0);
    });
  });
});
