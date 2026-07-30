import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import ClassificationCard from './ClassificationCard';
import ReferenceStudio from './ReferenceStudio';
import AnimalInsights from './AnimalInsights';
import LightboxModal from './LightboxModal';

export default function AnimalDetailView({ animal, onBack, onNavigateAnimal, onNavigateArticle }) {
  const [lightbox, setLightbox] = useState(null); // { imageUrl, skeletonUrl }
  const [activeAngle, setActiveAngle] = useState('front');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [animal?.id]);


  const handleStudioClick = (e) => {
    const target = e.target.closest('.anatomy-sketch-img, .workspace-base-photo');
    if (target) {
      const isSkeleton = target.classList.contains('anatomy-sketch-img');
      const angleData = animal.angles[activeAngle];
      if (isSkeleton) {
        setLightbox({ imageUrl: target.src, skeletonUrl: null });
      } else {
        const photoSkeleton = target.getAttribute('data-photo-skeleton');
        const skeletonUrl = (photoSkeleton && photoSkeleton !== "null") ? photoSkeleton : angleData.skeleton;
        setLightbox({ imageUrl: target.src, skeletonUrl: skeletonUrl });
      }
    }
  };

  return (
    <div className="animal-detail-container" data-testid="detail-view-full">
      <button className="back-link-btn" onClick={onBack}>
        ← 返回主頁
      </button>
      
      <div className="detail-grid">
        <div className="profile-sidebar">
          <ProfileHeader animal={animal} />
          <ClassificationCard classification={animal.scientificClassification} />
          <AnimalInsights 
            animal={animal} 
            onNavigateAnimal={onNavigateAnimal}
            onNavigateArticle={onNavigateArticle}
          />
        </div>
        
        <div className="studio-panel" onClick={handleStudioClick}>
          <ReferenceStudio 
            angles={animal.angles} 
            activeAngle={activeAngle} 
            onActiveAngleChange={setActiveAngle} 
          />
        </div>
      </div>

      {lightbox && (
        <LightboxModal 
          imageUrl={lightbox.imageUrl} 
          skeletonUrl={lightbox.skeletonUrl} 
          onClose={() => setLightbox(null)} 
        />
      )}
    </div>
  );
}


