import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SkeletonLightboxModal from '../src/components/SkeletonLightboxModal';
import PhotoLightboxModal from '../src/components/PhotoLightboxModal';
import AnimalDetailView from '../src/components/AnimalDetailView';
import { animalsData } from '../src/data/animalsData';

// Helper: zoom indicator text
const getZoomValue = () => {
  const el = document.getElementById('lightbox-zoom-indicator');
  return el ? parseInt(el.textContent) : NaN;
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

    const initialZoom = getZoomValue();

    // Click zoom-in once and verify indicator increases
    const zoomInBtn = screen.getByRole('button', { name: '放大' });
    fireEvent.click(zoomInBtn);
    expect(getZoomValue()).toBeGreaterThan(initialZoom);

    // 疊加骨架 button present
    expect(screen.getByRole('button', { name: /疊加骨架/ })).toBeInTheDocument();

    // Close via the aria-label="關閉" button
    fireEvent.click(screen.getByRole('button', { name: '關閉' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('handles zoom-out, reset, and opacity slider changes', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const initialZoom = getZoomValue();

    // Zoom out: value should decrease
    fireEvent.click(screen.getByRole('button', { name: '縮小' }));
    expect(getZoomValue()).toBeLessThan(initialZoom);

    // Reset: back to 100
    fireEvent.click(screen.getByRole('button', { name: '重置畫面' }));
    expect(getZoomValue()).toBe(100);

    // Overlay toggle + opacity slider
    const toggleBtn = screen.getByRole('button', { name: /疊加骨架/ });
    fireEvent.click(toggleBtn);

    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    expect(overlayImg).toBeInTheDocument();
    expect(parseFloat(overlayImg.style.opacity)).toBeGreaterThan(0);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    expect(parseFloat(overlayImg.style.opacity)).toBeCloseTo(0.8);
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

    // Toggle overlay on
    const toggleBtn = screen.getByRole('button', { name: /疊加骨架/ });
    fireEvent.click(toggleBtn);

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
    expect(screen.queryByRole('button', { name: /疊加骨架/ })).not.toBeInTheDocument();

    const initialZoom = getZoomValue();
    fireEvent.click(screen.getByRole('button', { name: '放大' }));
    expect(getZoomValue()).toBeGreaterThan(initialZoom);

    fireEvent.click(screen.getByRole('button', { name: '縮小' }));
    fireEvent.click(screen.getByRole('button', { name: '重置畫面' }));
    expect(getZoomValue()).toBe(100);

    fireEvent.click(screen.getByRole('button', { name: '關閉' }));
    expect(handleClose).toHaveBeenCalled();
  });
});

describe('LightboxModal – 調整骨架 interaction guard', () => {
  it('調整骨架 is disabled when 疊加骨架 is unchecked', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /調整骨架位置/ })).toBeDisabled();
  });

  it('調整骨架 becomes enabled after 疊加骨架 is checked', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /疊加骨架/ }));
    expect(screen.getByRole('button', { name: /調整骨架位置/ })).not.toBeDisabled();
  });

  it('對比反相 button is disabled when 疊加骨架 is unchecked', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /切換骨架顏色/ })).toBeDisabled();
  });

  it('對比反相 button becomes enabled after 疊加骨架 is checked', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /疊加骨架/ }));
    expect(screen.getByRole('button', { name: /切換骨架顏色/ })).not.toBeDisabled();
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

    // In skeleton-only mode, no 疊加骨架 button
    expect(within(lightboxModal).queryByRole('button', { name: /疊加骨架/ })).not.toBeInTheDocument();

    // Close via fireEvent (not .click()) to trigger React synthetic event
    fireEvent.click(within(lightboxModal).getByRole('button', { name: '關閉' }));
    expect(screen.queryByTestId('lightbox-modal')).not.toBeInTheDocument();
  });
});
