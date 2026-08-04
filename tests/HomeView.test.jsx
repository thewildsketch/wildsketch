import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import HomeView from '../src/components/HomeView';
import AnimalFilter from '../src/components/AnimalFilter';
import AboutMeBlock from '../src/components/home/AboutMeBlock';
import { animalsData } from '../src/data/animalsData';
import { shortDescAnimal } from './__mocks__/animalsMock';

describe('HomeView Layout & Posture Category Cards', () => {
  it('renders explanation cards and filters in Plantigrade -> Digitigrade -> Unguligrade order', () => {
    const handleSelect = vi.fn();
    render(<HomeView animals={animalsData} onAnimalSelect={handleSelect} />);

    // Ensure main title is deleted (should not have h2 header '繪圖新手的骨骼與參考圖指南')
    expect(screen.queryByRole('heading', { name: '繪圖新手的骨骼與參考圖指南' })).not.toBeInTheDocument();

    // Verify category explainer text is present
    expect(screen.getAllByText(/蹠行類.*Plantigrade/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/趾行類.*Digitigrade/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/蹄行類.*Unguligrade/)[0]).toBeInTheDocument();

    // Click on 蹠行類 filter tab
    const plantigradeTab = screen.getByRole('button', { name: /^蹠行類$/ });
    fireEvent.click(plantigradeTab);

    const animalGrid = screen.getByTestId('home-view').querySelector('.animal-grid');
    const filteredCards = Array.from(animalGrid.querySelectorAll('h3'));
    expect(filteredCards.length).toBe(2); // Bear, Squirrel

    // Verify that they are indeed Brown Bear and Squirrel
    const cardTexts = filteredCards.map(card => card.textContent);
    expect(cardTexts).toEqual(['棕熊', '松鼠']);
  });

  it('calls onAnimalSelect with correct animal ID when an animal card is clicked', () => {
    const handleSelect = vi.fn();
    render(<HomeView animals={animalsData} onAnimalSelect={handleSelect} />);

    const catCard = screen.getByRole('heading', { name: '貓' });
    fireEvent.click(catCard);

    expect(handleSelect).toHaveBeenCalledWith('cat');
  });

  it('does not append ellipsis to animal description if it is 50 characters or less', () => {
    render(<HomeView animals={[shortDescAnimal]} onAnimalSelect={vi.fn()} />);

    expect(screen.getByText('This is a short description.')).toBeInTheDocument();
    expect(screen.queryByText('This is a short description....')).not.toBeInTheDocument();
  });
});

describe('AnimalFilter Component', () => {
  it('renders tabs with pure Chinese labels and places scientific names in tooltips', () => {
    const handleFilterChange = vi.fn();
    render(<AnimalFilter currentFilter="all" onFilterChange={handleFilterChange} />);

    // Verify tabs have pure Chinese name accessible label
    const plantigradeTab = screen.getByRole('button', { name: /^蹠行類$/ });
    expect(plantigradeTab).toBeInTheDocument();

    // Verify scientific name exists inside the tooltip title span
    const tooltipTitleCh = screen.getByText('蹠行類', { selector: '.tooltip-title' });
    expect(tooltipTitleCh).toBeInTheDocument();
    expect(tooltipTitleCh).toHaveClass('tooltip-title');

    const tooltipTitleEn = screen.getByText('(Plantigrade)');
    expect(tooltipTitleEn).toBeInTheDocument();
    expect(tooltipTitleEn).toHaveClass('tooltip-title-en');
  });
});

describe('AboutMeBlock Component', () => {
  it('is temporarily hidden and renders null', () => {
    const { container } = render(<AboutMeBlock />);
    expect(container.firstChild).toBeNull();
  });
});
