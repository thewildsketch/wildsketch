import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ReferenceStudio from '../../../src/components/ReferenceStudio';
import { animalsData } from '../../../src/data/animalsData';
import { attributionAnimal } from '../../__mocks__/animalsMock';

describe('ReferenceStudio Component – Panel Labels & Angle Switching', () => {
  it('switches angles and displays studio sub-headers', () => {
    const cat = animalsData.find(a => a.id === 'cat');
    render(<ReferenceStudio angles={cat.angles} />);

    const frontBtn = screen.getByRole('button', { name: /正視角 Front view/ });
    fireEvent.click(frontBtn);

    expect(screen.getByText('骨架參考')).toBeInTheDocument();
    expect(screen.getByText('照片參考')).toBeInTheDocument();
  });

  it('renders skeleton image with correct alt text', () => {
    const cat = animalsData.find(a => a.id === 'cat');
    render(<ReferenceStudio angles={cat.angles} />);

    // Skeleton image should always render if skeleton path exists
    const skeletonImg = screen.getByAltText('骨架解剖圖');
    expect(skeletonImg).toBeInTheDocument();
  });

  it('renders photo reference cards when photos are present', () => {
    // Use attributionAnimal which has 1 photo in front angle
    render(<ReferenceStudio angles={attributionAnimal.angles} />);

    // Click front view button explicitly to ensure it is active
    const frontBtn = screen.getByRole('button', { name: /正視角 Front view/ });
    fireEvent.click(frontBtn);

    // Photo should now be rendered
    const basePhoto = screen.getByAltText('參考照片 1');
    expect(basePhoto).toBeInTheDocument();
  });

  it('shows empty photos-grid when no photos exist for an angle', () => {
    const mockAngles = {
      front: {
        skeleton: "",
        photos: []
      }
    };
    render(<ReferenceStudio angles={mockAngles} />);

    // grid should be empty
    const grid = document.querySelector('.photos-grid');
    expect(grid).toBeInTheDocument();
    expect(grid.children.length).toBe(0);
  });
});

// ── Task A: Photo Attribution Link Rendering ───────────────────────────────
describe('PhotoPanel Photo Attribution Links', () => {
  beforeEach(() => {
    // Render front angle which contains 1 photo with full attribution
    render(<ReferenceStudio angles={attributionAnimal.angles} />);
    fireEvent.click(screen.getByRole('button', { name: /正視角 Front view/ }));
  });

  it('renders sourceName as a link to sourceUrl', () => {
    // photo-attribution div is rendered below each photo card
    const attrDiv = document.querySelector('.photo-attribution');
    expect(attrDiv).toBeInTheDocument();

    const sourceLink = within(attrDiv).getByRole('link', { name: 'Pexels' });
    expect(sourceLink).toHaveAttribute('href', 'https://www.pexels.com/photo/test-001');
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });

  it('renders uploader.name as a link to profileUrl', () => {
    const attrDiv = document.querySelector('.photo-attribution');
    const uploaderLink = within(attrDiv).getByRole('link', { name: '@PexelsUser' });
    expect(uploaderLink).toHaveAttribute('href', 'https://www.pexels.com/@pexelsuser');
  });

  it('renders separator / only when both platform and uploader are present', () => {
    const attrDiv = document.querySelector('.photo-attribution');
    expect(attrDiv.textContent).toContain('Pexels / @PexelsUser');
  });
});

// ── Task D: SkeletonPanel Invert Toggle ────────────────────────────────────
describe('ReferenceStudio – SkeletonPanel contrast invert toggle', () => {
  it('does not render invert button when skeleton is null', () => {
    // side angle of attributionAnimal has skeleton: null
    render(<ReferenceStudio angles={attributionAnimal.angles} />);
    fireEvent.click(screen.getByRole('button', { name: /側面視角 Side view/ }));

    // No skeleton, so no invert-related control should appear
    const invertBtn = screen.queryByRole('button', { name: /切換骨架顏色|對比反相/i });
    expect(invertBtn).not.toBeInTheDocument();
  });

  it('renders skeleton preview when a skeleton exists', () => {
    render(<ReferenceStudio angles={attributionAnimal.angles} />);
    // front angle has a skeleton
    fireEvent.click(screen.getByRole('button', { name: /正視角 Front view/ }));

    const skeletonImg = screen.getByAltText('骨架解剖圖');
    expect(skeletonImg).toBeInTheDocument();
  });
});
