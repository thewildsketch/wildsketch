import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReferenceStudio from '../src/components/ReferenceStudio';
import { animalsData } from '../src/data/animalsData';

describe('ReferenceStudio Component Refined Labels', () => {
  it('switches angles and displays studio headers', () => {
    const cat = animalsData.find(a => a.id === 'cat');
    render(<ReferenceStudio angles={cat.angles} />);
    
    const frontBtn = screen.getByRole('button', { name: /正視角 Front view/ });
    fireEvent.click(frontBtn);
    
    expect(screen.getByText('骨架參考')).toBeInTheDocument();
    expect(screen.getByText('照片參考')).toBeInTheDocument();
  });

  it('renders skeleton and photo panel with localized alt texts', () => {
    const cat = animalsData.find(a => a.id === 'cat');
    render(<ReferenceStudio angles={cat.angles} />);

    // 1. Verify rendering of skeleton image alt="骨架解剖圖"
    const skeletonImg = screen.getByAltText('骨架解剖圖');
    expect(skeletonImg).toBeInTheDocument();

    // 2. Verify rendering of base reference photo (alt="參考照片 1")
    const basePhoto = screen.getByAltText('參考照片 1');
    expect(basePhoto).toBeInTheDocument();
  });
});

