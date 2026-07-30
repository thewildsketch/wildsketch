import React from 'react';
import { animalsData } from '../data/animalsData';
import { articlesData } from '../data/articlesData';

export default function AnimalInsights({ animal, onNavigateAnimal, onNavigateArticle }) {
  const similarAnimalsList = animalsData.filter(a => animal.similarAnimalIds && animal.similarAnimalIds.includes(a.id));
  const relatedArticlesList = articlesData.filter(art => art.tags && art.tags.includes(animal.id));

  const hasLinks = similarAnimalsList.length > 0 || relatedArticlesList.length > 0;

  return (
    <>
      <div className="notebook-scrap">
        <h5 className="scrap-title">動物小知識</h5>
        <ul className="scrap-list">
          {animal.funFacts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      </div>

      {hasLinks && (
        <div className="reference-index-card">
          <h5 className="reference-index-title">相關連結</h5>
          <div className="related-links-direct-list" style={{ display: 'flex', flexDirection: 'column' }}>
            {similarAnimalsList.map(sa => (
              <button 
                key={sa.id}
                className="ref-link-item"
                onClick={() => onNavigateAnimal(sa.id)}
              >
                <span className="ref-tag ref-tag-animal">相似動物</span>
                <span className="ref-link-name">{sa.names.zh}（{sa.names.en}）</span>
                <span className="ref-link-arrow">➔</span>
              </button>
            ))}
            {relatedArticlesList.map(art => (
              <button 
                key={art.id}
                className="ref-link-item"
                onClick={() => onNavigateArticle(art.id)}
              >
                <span className="ref-tag ref-tag-article">專題文章</span>
                <span className="ref-link-name">{art.title}</span>
                <span className="ref-link-arrow">➔</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

