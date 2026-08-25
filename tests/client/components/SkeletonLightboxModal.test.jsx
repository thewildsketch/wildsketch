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

  it('toggles skeleton dictionary tooltip and filters by name', () => {
    render(
      <SkeletonLightboxModal
        imageUrl="/cat_skeleton.png"
        onClose={vi.fn()}
      />
    );

    const dictBtn = screen.getByRole('button', { name: '骨骼字典' });
    expect(dictBtn).toBeInTheDocument();

    // Click to open dict
    fireEvent.click(dictBtn);
    const dictTooltip = screen.getByTestId('lightbox-dict-tooltip');
    expect(dictTooltip).toHaveClass('show');
    expect(screen.getByText('脊骨（脊椎）')).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText('請輸入英文或中文骨骼名稱');
    fireEvent.change(searchInput, { target: { value: 'Skull' } });
    expect(screen.getByText('Skull')).toBeInTheDocument();
    expect(screen.getByText('頭骨')).toBeInTheDocument();
    expect(screen.queryByText('脊骨（脊椎）')).not.toBeInTheDocument();

    // Close dict
    fireEvent.click(screen.getByRole('button', { name: '關閉字典' }));
    expect(dictTooltip).not.toHaveClass('show');
  });
});
