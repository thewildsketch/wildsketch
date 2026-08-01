import React, { useEffect } from 'react';
import { articlesData } from '../data/articlesData';

export default function ArticlesView({ activeArticleId, onArticleSelect }) {
  const handleExpandToggle = (id) => {
    const nextId = activeArticleId === id ? null : id;
    if (onArticleSelect) onArticleSelect(nextId);
  };

  useEffect(() => {
    if (activeArticleId) {
      const el = document.getElementById(activeArticleId);
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [activeArticleId]);

  return (
    <div className="articles-view" data-testid="articles-view" style={{ marginTop: '25px' }}>
      {(!articlesData || articlesData.length === 0) ? (
        <div className="ann-page-empty">
          目前尚無專題文章
        </div>
      ) : (
      <div className="articles-list">
        {articlesData.map((article) => {
          const isExpanded = activeArticleId === article.id;
          return (
            <article key={article.id} className="article-card" id={article.id}>
              <div className="article-header">
                <h3 className="article-title">{article.title}</h3>
                <div className="article-meta">
                  <span>發布日期: {article.date}</span>
                  <span>作者: {article.author}</span>
                </div>
              </div>
              <p className="article-summary">{article.summary}</p>
              {isExpanded && (
                <div className="article-body-expanded">
                  {article.content}
                </div>
              )}
              <div style={{ textAlign: 'right', marginTop: '15px' }}>
                <button 
                  className="read-more-btn"
                  onClick={() => handleExpandToggle(article.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-sketch)',
                    color: 'var(--color-accent)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    outline: 'none'
                  }}
                >
                  {isExpanded ? (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}}><path d="M2 9l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>{' '}收起專題</>
                  ) : (
                    <>閱讀專題{' '}<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginLeft:'4px'}}><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}


