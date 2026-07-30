import React, { useState } from 'react';
import AnimalFilter from './AnimalFilter';
import AnimalGrid from './AnimalGrid';
import AboutMeBlock from './home/AboutMeBlock';

export default function HomeView({ animals, onAnimalSelect }) {
  const [filter, setFilter] = useState('all');

  const filteredAnimals = filter === 'all'
    ? animals
    : animals.filter((a) => a.postureType === filter);

  return (
    <div className="home-view-container" data-testid="home-view">
      <AnimalFilter currentFilter={filter} onFilterChange={setFilter} />
      <AnimalGrid animals={filteredAnimals} onAnimalSelect={onAnimalSelect} />
      < AboutMeBlock />
    </div>
  );
}
