import React from 'react';

export default function AboutMeBlock() {

  return (
    <div className="about-me-section">
      <div className="about-me-container" data-testid="about-me-container">
        <div className="about-me-seal">
          <img
            src="/assets/logo.svg"
            alt="WildSketch Logo"
            className="about-me-logo-img"
          />
        </div>
        <div className="about-me-content">
          <h3 className="about-me-title">關於 WildSketch</h3>
          <p className="about-me-desc">
            一個熱愛動物的工程師，也是個總是抓不準型的繪畫新手。<br />
            懂那種對著動物照片，不知從哪下筆的茫然。<br />
            直到研究藝用解剖，才發現骨架給了抓型的方向，<br />
            但動物的骨架參考資源，在網路上實屬稀缺。<br />
            於是，我把這份初心化成你眼前這個地方——<br />
            WildSketch 動物速寫室，從骨架開始，陪你畫出心中的動物。
          </p>
        </div>
      </div>
    </div>
  );
}
