import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import ImageWithFallback from '../../../src/components/common/ImageWithFallback';

describe('ImageWithFallback Component', () => {
  it('renders img element with correct src and alt when src is valid', () => {
    render(<ImageWithFallback src="/test.jpg" alt="test image" className="card-img" />);
    const img = screen.getByAltText('test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('renders fallback box when img fires onError', () => {
    render(<ImageWithFallback src="/broken.jpg" alt="broken image" className="card-img" />);
    const img = screen.getByAltText('broken image');
    fireEvent.error(img);
    expect(screen.getByTestId('img-fallback-box')).toBeInTheDocument();
    // Original img should no longer be visible
    expect(screen.queryByAltText('broken image')).not.toBeInTheDocument();
  });

  it('renders fallback box immediately when src is empty string', () => {
    render(<ImageWithFallback src="" alt="empty src" className="card-img" />);
    expect(screen.getByTestId('img-fallback-box')).toBeInTheDocument();
    expect(screen.queryByAltText('empty src')).not.toBeInTheDocument();
  });

  it('forwards extra props (className, data-*) to the img element', () => {
    render(
      <ImageWithFallback
        src="/photo.jpg"
        alt="photo"
        className="workspace-base-photo"
        data-photo-id="photo_001"
      />
    );
    const img = screen.getByAltText('photo');
    expect(img).toHaveClass('workspace-base-photo');
    expect(img).toHaveAttribute('data-photo-id', 'photo_001');
  });
});
