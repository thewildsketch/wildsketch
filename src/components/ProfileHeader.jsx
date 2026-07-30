import React from 'react';



export default function ProfileHeader({ animal }) {
  const postureLabels = {
    plantigrade: '蹠行類 Plantigrade',
    digitigrade: '趾行類 Digitigrade',
    unguligrade: '蹄行類 Unguligrade'
  };

  const renderCoverAttribution = () => {
    const cover = animal.coverImage;
    if (!cover) return null;

    // Source platform: link sourceName to sourceUrl when both exist.
    const platformHtml = cover.sourceName && cover.sourceUrl ? (
      <a href={cover.sourceUrl} target="_blank" rel="noopener noreferrer">
        {cover.sourceName}
      </a>
    ) : (cover.sourceName ? (
      <span>{cover.sourceName}</span>
    ) : null);

    // Uploader name handling per spec.
    let creatorHtml = null;
    if (cover.uploader) {
      const name = cover.uploader.name ? cover.uploader.name : '匿名分享';
      const creatorName = name.startsWith('@') ? name : `@${name}`;
      creatorHtml = cover.uploader.profileUrl ? (
        <a href={cover.uploader.profileUrl} target="_blank" rel="noopener noreferrer">
          {creatorName}
        </a>
      ) : (
        creatorName
      );
    }

    if (!platformHtml && !creatorHtml) return null;

    return (
      <div className="cover-attribution" data-testid="cover-attribution">
        封面圖片來源：
        {platformHtml}{platformHtml && creatorHtml && ' / '}{creatorHtml}
      </div>
    );
  };

  return (
    <div className="detail-header-card">
      <div className="detail-name-section">
        <div className="detail-title-row">
          <h2 className="detail-ch-name">{animal.names.zh}</h2>
          <span className="detail-en-name">{animal.names.en}</span>
        </div>
        <div style={{ marginTop: '8px' }}>
          {/* Styled dynamically via .detail-name-section .badge-sketch in CSS */}
          <span className="badge-sketch">
            {postureLabels[animal.postureType]}
          </span>
        </div>
      </div>
      <p className="detail-desc">{animal.briefDescription}</p>
      {renderCoverAttribution()}
    </div>
  );
}

