import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LightboxModal from '../src/components/LightboxModal';
import AnimalDetailView from '../src/components/AnimalDetailView';
import { animalsData } from '../src/data/animalsData';

describe('LightboxModal Component Refined', () => {
  it('opens without title text and supports zoom and skeleton overlay toggle', () => {
    const handleClose = vi.fn();
    render(
      <LightboxModal 
        imageUrl="/cat_ref.jpg" 
        skeletonUrl="/cat_skeleton.png" 
        onClose={handleClose} 
      />
    );
    
    expect(screen.getByTestId('lightbox-modal')).toBeInTheDocument();
    // Ensure no title text like '透視放大鏡' is rendered
    expect(screen.queryByText('透視放大鏡（Artist Viewport）')).not.toBeInTheDocument();

    const zoomInBtn = screen.getByRole('button', { name: '＋' });
    fireEvent.click(zoomInBtn);
    expect(screen.getByText(/105%/)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /疊加骨架/ });
    expect(checkbox).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('integrates with AnimalDetailView to open on image clicks', () => {
    const handleBack = vi.fn();
    const handleNavAnimal = vi.fn();
    const handleNavArticle = vi.fn();
    const cat = animalsData.find((a) => a.id === 'cat');

    render(
      <AnimalDetailView 
        animal={cat} 
        onBack={handleBack} 
        onNavigateAnimal={handleNavAnimal}
        onNavigateArticle={handleNavArticle}
      />
    );

    // Click on skeleton image
    const skeletonImg = screen.getByAltText('骨架解剖圖');
    fireEvent.click(skeletonImg);
    
    const lightboxModal = screen.getByTestId('lightbox-modal');
    expect(lightboxModal).toBeInTheDocument();
    
    // In skeleton mode, skeletonUrl is null, so "疊加骨架" checkbox shouldn't render inside the lightbox
    const lightboxCheckbox = within(lightboxModal).queryByRole('checkbox', { name: /疊加骨架/ });
    expect(lightboxCheckbox).not.toBeInTheDocument();

    // Close the lightbox
    const closeBtn = within(lightboxModal).getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('lightbox-modal')).not.toBeInTheDocument();

    // Click on photo image
    const photoImg = screen.getByAltText('參考照片 1');
    fireEvent.click(photoImg);
    
    const newLightboxModal = screen.getByTestId('lightbox-modal');
    expect(newLightboxModal).toBeInTheDocument();
    
    // In photo mode, skeletonUrl is passed, so "疊加骨架" checkbox should render inside the lightbox
    const newLightboxCheckbox = within(newLightboxModal).getByRole('checkbox', { name: /疊加骨架/ });
    expect(newLightboxCheckbox).toBeInTheDocument();
  });

  it('handles zoom-out button click, reset button click, and opacity slider changes', () => {
    const handleClose = vi.fn();
    render(
      <LightboxModal 
        imageUrl="/cat_ref.jpg" 
        skeletonUrl="/cat_skeleton.png" 
        onClose={handleClose} 
      />
    );

    // Zoom-out button click (assert scale updates correctly)
    const zoomOutBtn = screen.getByRole('button', { name: '－' });
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText(/95%/)).toBeInTheDocument(); // 1 - 0.05 = 0.95 => 95%

    // Reset button click (assert scale and position are reset to defaults)
    // First, let's change the zoom to 105% and simulate dragging to shift position
    const zoomInBtn = screen.getByRole('button', { name: '＋' });
    fireEvent.click(zoomInBtn); // back to 100%
    fireEvent.click(zoomInBtn); // 105%
    expect(screen.getByText(/105%/)).toBeInTheDocument();

    const stage = screen.getByTestId('lightbox-modal').querySelector('.lightbox-image-stage');
    expect(stage.style.transform).toContain('scale(1.05)');

    // Simulate drag movement
    const viewport = screen.getByTestId('lightbox-modal').querySelector('.lightbox-viewport');
    fireEvent.mouseDown(viewport, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(viewport, { clientX: 150, clientY: 120 }); // dx = 50, dy = 20
    fireEvent.mouseUp(viewport);
    expect(stage.style.transform).toContain('translate(50px, 20px)');

    // Trigger Reset
    const resetBtn = screen.getByRole('button', { name: '重置' });
    fireEvent.click(resetBtn);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
    expect(stage.style.transform).toContain('translate(0px, 0px)');
    expect(stage.style.transform).toContain('scale(1)');

    // Opacity slider change (assert style opacity updates)
    const checkbox = screen.getByRole('checkbox', { name: /疊加骨架/ });
    fireEvent.click(checkbox);
    
    // Alt text translation check: "放大的骨架疊加層"
    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    expect(overlayImg).toBeInTheDocument();
    expect(overlayImg.style.opacity).toBe('0.65'); // initial is 65% opacity

    // Alt text translation check: "放大的參考照片"
    const baseImg = screen.getByAltText('放大的參考照片');
    expect(baseImg).toBeInTheDocument();

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '80' } });
    expect(overlayImg.style.opacity).toBe('0.8');
  });

  it('renders ImageWithFallback for main image and statefully hides skeleton overlay on error', () => {
    render(
      <LightboxModal 
        imageUrl="" 
        skeletonUrl="/cat_skeleton.png" 
        onClose={vi.fn()} 
      />
    );

    // Verify main image shows fallback container
    expect(screen.getByTestId('img-fallback-box')).toBeInTheDocument();

    // Verify initial state has "疊加骨架" checkbox since skeletonUrl is passed
    const checkbox = screen.getByRole('checkbox', { name: /疊加骨架/ });
    expect(checkbox).toBeInTheDocument();
    
    // Toggle overlay on to render the skeleton image
    fireEvent.click(checkbox);
    const overlayImg = screen.getByAltText('放大的骨架疊加層');
    expect(overlayImg).toBeInTheDocument();

    // Simulate skeleton image load error
    fireEvent.error(overlayImg);

    // After load error, skeleton overlay img should be hidden/removed
    expect(screen.queryByAltText('放大的骨架疊加層')).not.toBeInTheDocument();

    // The fallback container should NOT be rendered for the skeleton to prevent obscuring the main photo
    // So there should only be 1 fallback box (the main image one)
    expect(screen.getAllByTestId('img-fallback-box').length).toBe(1);

    // Checkbox and control panel should also be hidden
    expect(screen.queryByRole('checkbox', { name: /疊加骨架/ })).not.toBeInTheDocument();
  });
});



