import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import PhotoLightboxModal from '../../../src/components/PhotoLightboxModal';

describe('PhotoLightboxModal Component', () => {
  it('opens reference photo view and renders essential controls', () => {
    const handleClose = vi.fn();
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId('lightbox-modal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '放大' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '縮小' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /照片圖層/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /骨架圖層/ })).toBeInTheDocument();

    // Close via close button
    fireEvent.click(screen.getByRole('button', { name: '離開速寫室' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('handles skeleton layer popover, opacity adjustment, and adjust mode outline', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

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

  it('handles photo layer popover, opacity adjustment, and visibility toggle', () => {
    render(
      <PhotoLightboxModal
        imageUrl="/cat_ref.jpg"
        skeletonUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const photoLayerBtn = screen.getByRole('button', { name: /照片圖層/ });
    fireEvent.click(photoLayerBtn);

    // Photo popover is shown
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

  it('handles skeleton visibility and color invert toggle', () => {
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
    // Main fallback still present
    expect(screen.getAllByTestId('img-fallback-box').length).toBe(1);
  });
});
