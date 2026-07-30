import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnimalDetailView from '../src/components/AnimalDetailView';
import { animalsData } from '../src/data/animalsData';

describe('AnimalDetailView Layout & Related Links', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn());
  });

  it('renders basic info, traditional Chinese taxonomy tables, and direct links without subheadings', () => {
    const handleBack = vi.fn();
    const handleNavAnimal = vi.fn();
    const handleNavArticle = vi.fn();
    
    const cat = animalsData.find(a => a.id === 'cat');
    render(
      <AnimalDetailView 
        animal={cat} 
        onBack={handleBack} 
        onNavigateAnimal={handleNavAnimal}
        onNavigateArticle={handleNavArticle}
      />
    );
    
    expect(screen.getByText('Cat')).toBeInTheDocument();
    
    // Verify correct headers
    expect(screen.getByRole('heading', { name: /^科學分類$/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^動物小知識$/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^相關連結$/ })).toBeInTheDocument();

    // Subheadings should be deleted
    expect(screen.queryByRole('heading', { name: /^相似動物$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^相關專題文章$/ })).not.toBeInTheDocument();

    // Related animal (Dog) link button should render
    const dogLinkBtn = screen.getByRole('button', { name: /狗（Dog）/ });
    fireEvent.click(dogLinkBtn);
    expect(handleNavAnimal).toHaveBeenCalledWith('dog');
    
    // Verify cover attribution is rendered correctly
    const coverAttr = screen.getByTestId('cover-attribution');
    expect(coverAttr).toBeInTheDocument();
    expect(coverAttr).toHaveTextContent('封面圖片來源：Unsplash / @FreePhotos');

    // Back button
    const backBtn = screen.getByRole('button', { name: /返回主頁/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalled();
  });

  it('scrolls to top when animal prop changes', () => {
    const scrollToMock = vi.fn();
    vi.stubGlobal('scrollTo', scrollToMock);

    const cat = animalsData.find(a => a.id === 'cat');
    const dog = animalsData.find(a => a.id === 'dog');

    const { rerender } = render(
      <AnimalDetailView 
        animal={cat} 
        onBack={() => {}} 
        onNavigateAnimal={() => {}}
        onNavigateArticle={() => {}}
      />
    );

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    scrollToMock.mockClear();

    rerender(
      <AnimalDetailView 
        animal={dog} 
        onBack={() => {}} 
        onNavigateAnimal={() => {}}
        onNavigateArticle={() => {}}
      />
    );

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

