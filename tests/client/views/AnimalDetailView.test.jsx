import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import AnimalDetailView from '../../../src/components/AnimalDetailView';
import { animalsData } from '../../../src/data/animalsData';
import { attributionAnimal, noAttributionAnimal, noSourceUrlAnimal, noProfileUrlAnimal } from '../../__mocks__/animalsMock';

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

// ── Task A: Cover Attribution Link Rendering ───────────────────────────────
describe('ProfileHeader Cover Attribution Links', () => {
  const renderDetailView = (animal) =>
    render(
      <AnimalDetailView
        animal={animal}
        onBack={() => {}}
        onNavigateAnimal={() => {}}
        onNavigateArticle={() => {}}
      />
    );

  it('renders sourceName as a link to sourceUrl when both are present', () => {
    renderDetailView(attributionAnimal);

    const attr = screen.getByTestId('cover-attribution');
    expect(attr).toBeInTheDocument();

    // sourceName should be an <a> pointing to sourceUrl
    const sourceLink = within(attr).getByRole('link', { name: 'Unsplash' });
    expect(sourceLink).toHaveAttribute('href', 'https://unsplash.com/photos/cover-test');
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });

  it('renders uploader.name as a link to profileUrl when profileUrl exists', () => {
    renderDetailView(attributionAnimal);

    const attr = screen.getByTestId('cover-attribution');
    const uploaderLink = within(attr).getByRole('link', { name: '@TestPhotographer' });
    expect(uploaderLink).toHaveAttribute('href', 'https://unsplash.com/@testphotographer');
  });

  it('renders sourceName as plain <span> when sourceUrl is null', () => {
    renderDetailView(noSourceUrlAnimal);

    const attr = screen.getByTestId('cover-attribution');
    // There should be no link for the platform
    expect(within(attr).queryByRole('link', { name: 'Unsplash' })).not.toBeInTheDocument();
    // But the text should still be visible
    expect(attr).toHaveTextContent('Unsplash');
  });

  it('renders uploader.name as plain text when profileUrl is null', () => {
    renderDetailView(noProfileUrlAnimal);

    const attr = screen.getByTestId('cover-attribution');
    // No link for uploader
    expect(within(attr).queryByRole('link', { name: /@AnonymousPhotographer/ })).not.toBeInTheDocument();
    expect(attr).toHaveTextContent('@AnonymousPhotographer');
  });

  it('does not render cover-attribution element when sourceName and uploader are both absent', () => {
    renderDetailView(noAttributionAnimal);
    expect(screen.queryByTestId('cover-attribution')).not.toBeInTheDocument();
  });

  it('separator / is only shown when both platform and uploader are present', () => {
    renderDetailView(attributionAnimal);
    const attr = screen.getByTestId('cover-attribution');
    expect(attr).toHaveTextContent('Unsplash / @TestPhotographer');
  });
});
