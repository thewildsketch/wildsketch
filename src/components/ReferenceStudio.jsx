import React, { useState } from 'react';
import SkeletonPanel from './SkeletonPanel';
import PhotoPanel from './PhotoPanel';

export default function ReferenceStudio({ angles, activeAngle: propActiveAngle, onActiveAngleChange }) {
  const [localActiveAngle, setLocalActiveAngle] = useState('front'); // front | side | threeQuarter

  const activeAngle = propActiveAngle !== undefined ? propActiveAngle : localActiveAngle;
  
  const handleAngleChange = (angleId) => {
    if (onActiveAngleChange !== undefined) {
      onActiveAngleChange(angleId);
    } else {
      setLocalActiveAngle(angleId);
    }
  };

  const angleData = angles[activeAngle];

  const anglesList = [
    { id: 'front', name: '正視角 Front view' },
    { id: 'side', name: '側面視角 Side view' },
    { id: 'threeQuarter', name: '3/4視角 Three-quarter view' }
  ];

  return (
    <div className="reference-studio-container">
      <h3 className="studio-title">
        形體研究
        <span className="info-tooltip-wrapper">
          <span className="info-icon">i</span>
          <span className="tooltip-content">骨架圖由 AI 輔助生成，僅供速寫參考，請勿作為學術或醫學依據</span>
        </span>
      </h3>
      
      <p className="studio-guide-text" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginTop: '8px', marginBottom: '20px', fontFamily: 'var(--font-sans)' }}>
        選擇視角後，點擊<strong>骨架</strong>或<strong>照片</strong>參考圖放大，<br />
        照片視窗內骨架已對齊疊加，隨時可細部對照參考。<br />
        拿起畫筆，開啟你的速寫旅程吧！
      </p>
      
      <div className="angle-selector">
        {anglesList.map((angle) => (
          <button
            key={angle.id}
            data-angle={angle.id}
            className={`angle-tab ${activeAngle === angle.id ? 'active' : ''}`}
            onClick={() => handleAngleChange(angle.id)}
          >
            {angle.name}
          </button>
        ))}
      </div>

      <div className="studio-workspace fade-in-active" key={activeAngle}>
        <SkeletonPanel skeletonUrl={angleData.skeleton} />
        <PhotoPanel photos={angleData.photos} skeletonUrl={angleData.skeleton} />
      </div>
    </div>
  );
}

