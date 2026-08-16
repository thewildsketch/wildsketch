import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import SkeletonLightboxModal from '../../../src/components/SkeletonLightboxModal';

describe('SkeletonLightboxModal Component', () => {
  it('renders standalone skeleton view and handles controls', () => {
    const handleClose = vi.fn();
    render(
      <SkeletonLightboxModal
        imageUrl="/cat_skeleton.png"
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId('lightbox-modal')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /照片圖層/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '放大' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '縮小' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /全域總重置|重置/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '離開速寫室' }));
    expect(handleClose).toHaveBeenCalled();
  });
});
