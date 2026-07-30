import React from 'react';
import ImageWithFallback from './common/ImageWithFallback';

export default function AnimalCard({ animal, onClick }) {
  const postureNames = {
    plantigrade: '蹠行類 Plantigrade',
    digitigrade: '趾行類 Digitigrade',
    unguligrade: '蹄行類 Unguligrade'
  };

  return (
    <div className="animal-card" onClick={onClick}>
      <div className="card-img-wrapper">
        <ImageWithFallback src={animal.coverImage.url} alt={animal.names.zh} className="card-img" />
      </div>
      <div className="card-info">
        <div className="card-title-group">
          <h3>{animal.names.zh}</h3>
          <span>{animal.names.en}</span>
        </div>
        <span className="badge-sketch">
          {postureNames[animal.postureType]}
        </span>
      </div>
      <p className="card-desc">
        {animal.briefDescription}
      </p>
    </div>
  );
}


