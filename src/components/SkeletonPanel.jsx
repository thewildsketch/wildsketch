import React, { useState } from 'react';
import ImageWithFallback from './common/ImageWithFallback';
import { SKELETON_DICTIONARY_DATA } from '../data/skeletonDictionary';

export default function SkeletonPanel({ skeletonUrl }) {
  const [showDict, setShowDict] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = SKELETON_DICTIONARY_DATA.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return item.en.toLowerCase().includes(q) || item.zh.toLowerCase().includes(q);
  });

  return (
    <div className="skeleton-panel">
      <div className="skeleton-panel-header">
        <h4 className="studio-sub-title">骨架參考</h4>
        <button
          className={`skeleton-dict-btn ${showDict ? 'active' : ''}`}
          id="skeleton-dict-trigger-btn"
          onClick={() => setShowDict((prev) => !prev)}
          title="展開/收合骨骼字典"
          aria-label="骨骼字典"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            <path d="M6 8h3"></path>
            <path d="M6 12h3"></path>
            <path d="M15 8h3"></path>
            <path d="M15 12h3"></path>
          </svg>
          <span>骨骼字典</span>
        </button>
      </div>

      {showDict && (
        <div className="skeleton-compact-dict-strip" id="skeleton-compact-dict-strip" data-testid="skeleton-compact-dict-strip">
          <div className="compact-dict-search-row">
            <div className="dict-search-inner">
              <svg className="dict-search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                id="compact-dict-search-input"
                className="skeleton-dict-search-input"
                placeholder="請輸入英文或中文骨骼名稱"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <button
              className="compact-dict-close-btn"
              onClick={() => setShowDict(false)}
              title="關閉字典"
              aria-label="關閉"
            >
              &times;
            </button>
          </div>
          <div className="compact-dict-list-wrap">
            <table className="skeleton-dict-table compact-table">
              <tbody id="compact-dict-tbody">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="dict-no-result">查無相符的骨骼部位，請嘗試其他關鍵字</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.en}>
                      <td className="dict-en-cell">{item.en}</td>
                      <td className="dict-zh-cell">{item.zh}</td>
                      <td className="dict-tip-cell">{item.tip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="skeleton-canvas-box">
        <ImageWithFallback 
          src={skeletonUrl} 
          alt="骨架圖" 
          className="anatomy-sketch-img" 
        />
      </div>
    </div>
  );
}
