import React from 'react';
import AnimalCard from './AnimalCard';

export default function AnimalGrid({ animals, onAnimalSelect }) {
  if (!animals || animals.length === 0) {
    return (
      <div className="ann-page-empty">
        目前尚無相符動物資料
      </div>
    );
  }

  return (
    <div className="animal-grid">
      {animals.map((animal) => (
        <AnimalCard 
          key={animal.id} 
          animal={animal} 
          onClick={() => onAnimalSelect(animal.id)} 
        />
      ))}
    </div>
  );
}
