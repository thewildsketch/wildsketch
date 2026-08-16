import React from 'react';
import { articlesData } from '../data/articlesData';

export default function ArticleDetailView({ articleId, onBack }) {
  const article = (articlesData || []).find((a) => a.id === articleId && a.status === 'published');

  if (!article) {
    return (
      <div className="article-detail-view" data-testid="article-detail-view">
        <div className="back-btn-wrapper">
          <button className="back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            返回文章列表
          </button>
        </div>
        <div className="ann-page-empty">找不到該文章</div>
      </div>
    );
  }

  return (
    <div className="article-detail-view" data-testid="article-detail-view">
      <div className="back-btn-wrapper">
        <button className="back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回文章列表
        </button>
      </div>

      <div className="article-detail-content" id="article-detail-content">
        <div className="article-detail-header">
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-meta">
            <span>發布日期: {article.date}</span>
            {article.author && <span>作者: {article.author}</span>}
          </div>
        </div>
        <div className="article-rich-content">
          {typeof article.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            article.content
          )}
        </div>
      </div>
    </div>
  );
}
