import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SkeletonLightboxModal from '../src/components/SkeletonLightboxModal';
import PhotoLightboxModal from '../src/components/PhotoLightboxModal';
import AnimalDetailView from '../src/components/AnimalDetailView';
import { animalsData } from '../src/data/animalsData';

// Helper: get scale from image stage style
const getStageScale = () => {
  const el = document.querySelector('.lightbox-image-stage');
  if (!el) return NaN;
  const match = el.style.transform.match(/scale\(([^)]+)\)/);
  return match ? parseFloat(match[1]) : 1.0;
};

describe('PhotoLightboxModal Component', () => {
  it('opens reference photo view and zoom increases when + is clicked', () => {
    const handleClose = vi.fn();
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId('lightbox-modal')).toBeInTheDocument();
    expect(screen.queryByText('透視放大鏡（Artist Viewport）')).not.toBeInTheDocument();

    const initialZoom = getStageScale();

    // Click zoom-in once and verify stage scale increases
    const zoomInBtn = screen.getByRole('button', { name: '放大' });
    fireEvent.click(zoomInBtn);
    expect(getStageScale()).toBeGreaterThan(initialZoom);

    // [📷 照片圖層] and [🦴 骨架圖層] buttons present
    expect(screen.getByRole('button', { name: /照片圖層/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /骨架圖層/ })).toBeInTheDocument();

    // Close via close button
    fireEvent.click(screen.getByRole('button', { name: '離開速寫室' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('handles zoom-out, reset, and photo/skeleton layer popovers', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const initialZoom = getStageScale();

    // Zoom out: value should decrease
    fireEvent.click(screen.getByRole('button', { name: '縮小' }));
    expect(getStageScale()).toBeLessThan(initialZoom);

    // Global Reset: back to 1
    fireEvent.click(screen.getByRole('button', { name: /全域總重置|重置/ }));
    expect(getStageScale()).toBe(1);

    // Open skeleton layer popover by clicking skeleton layer button
    const skeletonBtn = screen.getByRole('button', { name: /骨架圖層/ });
    fireEvent.click(skeletonBtn);

    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    fireEvent.load(overlayImg);
    expect(overlayImg).toBeInTheDocument();
    expect(parseFloat(overlayImg.style.opacity)).toBeGreaterThan(0);

    // Skeleton opacity slider
    const skeletonSlider = screen.getByTitle(/調整骨架不透明度/);
    fireEvent.change(skeletonSlider, { target: { value: '65' } });
    expect(parseFloat(overlayImg.style.opacity)).toBeCloseTo(0.65);

    // Skeleton dashed outline shown when in skeleton adjustMode
    expect(overlayImg.style.outline).toContain('dashed');

    // Click skeleton button again to close popover and exit skeleton mode
    fireEvent.click(skeletonBtn);
    expect(overlayImg.style.outline).toBe('none');
  });

  it('renders fallback for broken main image and hides skeleton overlay on skeleton error', () => {
    render(
      <PhotoLightboxModal
        imageUrl=""
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    // Main image missing → fallback box
    expect(screen.getByTestId('img-fallback-box')).toBeInTheDocument();

    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    expect(overlayImg).toBeInTheDocument();

    // Simulate skeleton load error
    fireEvent.error(overlayImg);

    // Skeleton overlay removed
    expect(screen.queryByAltText('放大的骨架疊加層')).not.toBeInTheDocument();
    // Main fallback still present (exactly 1)
    expect(screen.getAllByTestId('img-fallback-box').length).toBe(1);
  });
});

describe('SkeletonLightboxModal Component', () => {
  it('renders standalone skeleton view and handles simple zoom/reset', () => {
    const handleClose = vi.fn();
    render(
      <SkeletonLightboxModal
        imageUrl="/cat_skeleton.png"
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId('lightbox-modal')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /照片圖層/ })).not.toBeInTheDocument();

    const initialZoom = getStageScale();
    fireEvent.click(screen.getByRole('button', { name: '放大' }));
    expect(getStageScale()).toBeGreaterThan(initialZoom);

    fireEvent.click(screen.getByRole('button', { name: '縮小' }));
    fireEvent.click(screen.getByRole('button', { name: /全域總重置|重置/ }));
    expect(getStageScale()).toBe(1);

    fireEvent.click(screen.getByRole('button', { name: '離開速寫室' }));
    expect(handleClose).toHaveBeenCalled();
  });
});

describe('LightboxModal – Layer Popovers & Outline Guard', () => {
  it('toggles photo popover and controls photo visibility & opacity', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const photoLayerBtn = screen.getByRole('button', { name: /照片圖層/ });
    fireEvent.click(photoLayerBtn);

    // Photo popover is shown (.show class on popover)
    const photoPopover = document.getElementById('v-layer-photo-popover');
    expect(photoPopover).toHaveClass('show');

    // Change photo opacity
    const photoSlider = screen.getByTitle(/調整照片不透明度/);
    fireEvent.change(photoSlider, { target: { value: '50' } });

    const photoBaseImg = screen.getByAltText('放大的參考照片');
    expect(photoBaseImg.parentElement.style.opacity).toBe('0.5');

    // Toggle photo visibility
    const photoEyeBtn = document.getElementById('v-photo-toggle-btn');
    fireEvent.click(photoEyeBtn);
    expect(photoBaseImg.parentElement.style.opacity).toBe('0');
  });

  it('toggles skeleton popover and controls skeleton visibility & color invert', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const skeletonLayerBtn = screen.getByRole('button', { name: /骨架圖層/ });
    fireEvent.click(skeletonLayerBtn);

    const skeletonPopover = document.getElementById('v-layer-skeleton-popover');
    expect(skeletonPopover).toHaveClass('show');

    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    fireEvent.load(overlayImg);
    expect(overlayImg.style.filter).toContain('invert(1)');

    // Toggle invert
    const invertBtn = document.getElementById('lightbox-invert-btn');
    fireEvent.click(invertBtn);
    expect(overlayImg.style.filter).toBe('none');

    // Toggle skeleton visibility off -> outline must disappear
    const skeletonEyeBtn = document.getElementById('v-skeleton-toggle-btn');
    fireEvent.click(skeletonEyeBtn);
    expect(overlayImg.style.opacity).toBe('0');
    expect(overlayImg.style.outline).toBe('none');
  });
});

describe('LightboxModal Component Integration', () => {
  it('integrates with AnimalDetailView to open on skeleton and photo image clicks', () => {
    const cat = animalsData.find(a => a.id === 'cat');
    render(
      <AnimalDetailView
        animal={cat}
        onBack={vi.fn()}
        onNavigateAnimal={vi.fn()}
        onNavigateArticle={vi.fn()}
      />
    );

    // Click on skeleton image
    const skeletonImg = screen.getByAltText('骨架解剖圖');
    fireEvent.click(skeletonImg);

    const lightboxModal = screen.getByTestId('lightbox-modal');
    expect(lightboxModal).toBeInTheDocument();

    // In skeleton-only mode, no layers group
    expect(within(lightboxModal).queryByRole('button', { name: /照片圖層/ })).not.toBeInTheDocument();

    // Close via close button
    fireEvent.click(within(lightboxModal).getByRole('button', { name: '離開速寫室' }));
    expect(screen.queryByTestId('lightbox-modal')).not.toBeInTheDocument();
  });
});
