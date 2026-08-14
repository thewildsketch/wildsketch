import React, { useState } from 'react';
import { announcementsData } from '../data/announcementsData';

const PAGE_SIZE = 10;

export default function AnnouncementsView() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedIds, setExpandedIds] = useState({});

  const availableAnnouncements = (announcementsData || []).filter((a) => a.status === 'published');

  if (availableAnnouncements.length === 0) {
    return (
      <div className="announcements-view" data-testid="announcements-view">
        <div className="ann-page-empty">
          目前尚無公告
        </div>
      </div>
    );
  }

  // Sort: pinned first, then by date descending
  const sorted = [...availableAnnouncements].sort((a, b) => {
    if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
    return new Date(b.date) - new Date(a.date);
  });

  const visibleItems = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const toggleItem = (id, hasContent) => {
    if (!hasContent) return;
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="announcements-view" data-testid="announcements-view">

      <div id="announcements-page-container">
        {visibleItems.map((ann) => {
          const hasContent = Boolean(ann.content);
          const isExpanded = Boolean(expandedIds[ann.id]);

          return (
            <div key={ann.id} className="ann-page-item" id={`ann-page-${ann.id}`}>
              <div 
                className="ann-page-row" 
                onClick={() => toggleItem(ann.id, hasContent)}
                style={{ cursor: hasContent ? 'pointer' : 'default' }}
              >
                <div className="ann-page-row-left">
                  <span className="ann-page-date-inline">{ann.date}</span>
                  <span className="ann-page-title-inline">
                    {ann.isPinned && (
                      <svg 
                        viewBox="0 0 24 24" 
                        width="13" 
                        height="13" 
                        fill="var(--color-accent)" 
                        title="置頂公告" 
                        style={{ display: 'inline-block', verticalAlign: '-1px', flexShrink: 0, marginRight: '6px' }}
                      >
                        <path d="M7 2h10v2h-1v6l2 2v2h-5v6l-1 2-1-2v-6H6v-2l2-2V4H7V2z"/>
                      </svg>
                    )}
                    {ann.title}
                  </span>
                </div>

                {hasContent && (
                  <span className="ann-page-expand-icon">
                    <svg 
                      viewBox="0 0 24 24" 
                      width="14" 
                      height="14" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      style={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s ease', 
                        display: 'block' 
                      }}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                )}
              </div>

              {hasContent && isExpanded && (
                <div className="ann-page-content">
                  {ann.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="announcements-page-more-row">
          <button 
            className="announcements-page-more-btn" 
            onClick={handleLoadMore}
            data-testid="announcements-page-more-btn"
          >
            更多公告
          </button>
        </div>
      )}
    </div>
  );
}
