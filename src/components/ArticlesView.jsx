import React, { useState } from 'react';
import { articlesData } from '../data/articlesData';
import ImageWithFallback from './common/ImageWithFallback';
import ArticleCoverPlaceholder from './common/ArticleCoverPlaceholder';

const ARTICLES_PER_PAGE = 9;

export default function ArticlesView({ onArticleSelect }) {
  const [currentPage, setCurrentPage] = useState(1);
  const availableArticles = (articlesData || []).filter((art) => art.status === 'published');

  const totalPages = Math.ceil(availableArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = availableArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="articles-view" data-testid="articles-view">
      {availableArticles.length === 0 ? (
        <div className="ann-page-empty" style={{ gridColumn: '1 / -1' }}>
          目前尚無專題文章
        </div>
      ) : (
        <>
          <div className="article-grid" id="articles-container">
            {paginatedArticles.map((article) => (
              <article
                key={article.id}
                className="article-card"
                id={article.id}
                onClick={() => onArticleSelect && onArticleSelect(article.id)}
              >
                {article.coverUrl ? (
                  <ImageWithFallback
                    src={article.coverUrl}
                    className="article-card-cover"
                    alt={article.title}
                  />
                ) : (
                  <ArticleCoverPlaceholder articleId={article.id} />
                )}
                <div className="article-card-body">
                    <div className="article-meta">
                      <span>{article.date}</span>
                      {article.author && <span>作者: {article.author}</span>}
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary">{article.summary}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '18px', textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-sketch)', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '1.15rem' }}>
                        閱讀全文 →
                      </span>
                    </div>
                  </div>
                </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container" id="articles-pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
