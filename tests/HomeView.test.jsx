import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeView from '../src/components/HomeView';
import { animalsData } from '../src/data/animalsData';

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
    
    // Improve assertion to verify that they are indeed Brown Bear and Squirrel
    const cardTexts = filteredCards.map(card => card.textContent);
    expect(cardTexts).toEqual(['棕熊', '松鼠']);
  });

  it('calls onAnimalSelect with correct animal ID when an animal card is clicked', () => {
    const handleSelect = vi.fn();
    render(<HomeView animals={animalsData} onAnimalSelect={handleSelect} />);

    // Click the Cat card (using the heading for '貓' as target)
    const catCard = screen.getByRole('heading', { name: '貓' });
    fireEvent.click(catCard);

    expect(handleSelect).toHaveBeenCalledWith('cat');
  });

  it('does not append ellipsis to animal description if it is 50 characters or less', () => {
    const mockAnimals = [
      {
        id: 'short-desc-animal',
        names: {
          zh: '矮子',
          en: 'Shorty'
        },
        postureType: 'plantigrade',
        briefDescription: 'This is a short description.',
        coverImage: {
          url: '/assets/images/shorty.jpg',
          sourceUrl: null,
          uploader: null
        },
      }
    ];
    render(<HomeView animals={mockAnimals} onAnimalSelect={vi.fn()} />);

    // Expected exact text without '...'
    expect(screen.getByText('This is a short description.')).toBeInTheDocument();
    expect(screen.queryByText('This is a short description....')).not.toBeInTheDocument();
  });
});

