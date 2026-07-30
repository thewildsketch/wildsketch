import React from 'react';
import ImageWithFallback from './common/ImageWithFallback';

export default function PhotoPanel({ photos }) {
  const renderPhotoAttribution = (photo) => {
    if (typeof photo === 'string') return null;

    // Source platform: link sourceName to sourceUrl when both exist.
    const platformHtml = photo.sourceName && photo.sourceUrl ? (
      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">
        {photo.sourceName}
      </a>
    ) : (photo.sourceName ? (
      <span>{photo.sourceName}</span>
    ) : null);

    // Uploader name handling per spec.
    let creatorHtml = null;
    if (photo.uploader) {
      const name = photo.uploader.name ? photo.uploader.name : '匿名分享';
      const creatorName = name.startsWith('@') ? name : `@${name}`;
      creatorHtml = photo.uploader.profileUrl ? (
        <a href={photo.uploader.profileUrl} target="_blank" rel="noopener noreferrer">
          {creatorName}
        </a>
      ) : (
        creatorName
      );
    }

    // If no source and no uploader info, render nothing.
    if (!platformHtml && !creatorHtml) return null;

    return (
      <div className="photo-attribution" style={{ marginLeft: '2px' }} onClick={(e) => e.stopPropagation()}>
        圖片來源：
        {platformHtml}{platformHtml && creatorHtml && ' / '}{creatorHtml}
      </div>
    );
  };

  return (
    <div className="photo-panel">
      <h4 className="studio-sub-title">照片參考</h4>
      <div className="photos-grid">
        {photos.map((photo, index) => {
          const photoUrl = typeof photo === 'string' ? photo : (photo?.url || '');
          const photoId = typeof photo === 'string' ? '' : (photo?.id || '');
          const photoSkeleton = typeof photo === 'string' ? null : (photo?.skeleton || null);
          const photoSourceUrl = typeof photo === 'string' ? null : (photo?.sourceUrl || null);
          const photoUploaderName = (typeof photo === 'string' || !photo?.uploader) ? '' : (photo.uploader.name || '');
          const photoUploaderProfile = (typeof photo === 'string' || !photo?.uploader) ? '' : (photo.uploader.profileUrl || '');

          return (
            <div key={photoId || index} className="workspace-card">
              <div className="workspace-media-container">
                <div className="card-action-overlay" style={{ pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2px' }}>
                      {/* Sketching Pencil Icon */}
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span className="class-val-ch" style={{ fontSize: '0.95rem', color: 'var(--color-text-ink)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>進入速寫室</span>
                      <span className="class-val-en" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', marginLeft: 0, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 }}>Enter</span>
                    </div>
                  </div>
                </div>
                <ImageWithFallback 
                  src={photoUrl} 
                  alt={`參考照片 ${index + 1}`} 
                  className="workspace-base-photo" 
                  data-photo-id={photoId}
                  data-photo-skeleton={photoSkeleton}
                  data-photo-source-url={photoSourceUrl}
                  data-photo-uploader-name={photoUploaderName}
                  data-photo-uploader-profile={photoUploaderProfile}
                />
              </div>
              {renderPhotoAttribution(photo)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

