/**
 * ArticlesView tests.
 *
 * Uses vi.mock to inject controlled article fixtures,
 * decoupling the test from the live (possibly empty) articlesData.
 */
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

vi.mock('../src/data/articlesData', () => ({
  articlesData: [
    {
      id: 'article-5d9c1b',
      title: '鰭足類分辨指南（海豹 vs 海獅 vs 海狗）',
      date: '2026-06-26',
      author: '自然寫生小組',
      tags: ['bear'],
      status: 'published',
      createdAt: '2026-06-26T08:00:00Z',
      updatedAt: '2026-07-03T14:00:00Z',
      publishedAt: '2026-07-03T14:00:00Z',
      summary: '海豹、海獅、海狗常常讓人傻傻分不清楚？本文教你一秒辨識。',
      content: (
        <div className="editorial-article-rich">
          <p>真海豹沒有外耳廓，後肢無法彎曲到腹面。</p>
          <p>掌狀角鰭指向可辨別海獅與海狗。</p>
        </div>
      ),
    },
  ],
}));

import ArticlesView from '../src/components/ArticlesView';

function TestWrapper({ initialActiveArticleId }) {
  const [activeArticleId, setActiveArticleId] = useState(initialActiveArticleId || null);
  return (
    <ArticlesView
      activeArticleId={activeArticleId}
      onArticleSelect={setActiveArticleId}
    />
  );
}

describe('ArticlesView Component', () => {
  it('renders articles list, expands content on click, and collapses on click again', () => {
    render(<TestWrapper />);
    expect(screen.getByText('鰭足類分辨指南（海豹 vs 海獅 vs 海狗）')).toBeInTheDocument();

    // Content not visible initially
    expect(screen.queryByText(/真海豹/i)).not.toBeInTheDocument();

    // Click to expand
    const readBtn = screen.getAllByRole('button', { name: /閱讀專題/i })[0];
    fireEvent.click(readBtn);
    expect(screen.getByText(/真海豹/i)).toBeInTheDocument();

    // Click to collapse
    const collapseBtn = screen.getByRole('button', { name: /收起專題/i });
    fireEvent.click(collapseBtn);
    expect(screen.queryByText(/真海豹/i)).not.toBeInTheDocument();
  });

  it('shows article content expanded when pre-selected activeArticleId is provided', () => {
    render(<TestWrapper initialActiveArticleId="article-5d9c1b" />);
    // Pre-selected article's content visible immediately
    expect(screen.getByText(/真海豹/i)).toBeInTheDocument();
    // Other expanded content (from hypothetical second article) would not appear
    expect(screen.queryByText(/掌狀角/i)).toBeInTheDocument(); // present as part of same article
  });
});
