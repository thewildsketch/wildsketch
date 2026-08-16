import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticleDetailView from '../../../src/components/ArticleDetailView';

vi.mock('../../../src/data/articlesData', () => ({
  articlesData: [
    {
      id: 'article-1',
      title: '測試專題文章標題',
      date: '2026-08-01',
      author: '自然觀察者',
      status: 'published',
      summary: '測試文章摘要',
      content: (
        <div className="article-rich-content">
          <p>這是專題文章的詳細內容段落一。</p>
          <p>這是專題文章的詳細內容段落二。</p>
        </div>
      ),
    },
    {
      id: 'article-draft',
      title: '草稿文章標題',
      date: '2026-08-02',
      author: '自然觀察者',
      status: 'draft',
      summary: '草稿文章摘要',
      content: <p>草稿內容</p>,
    }
  ],
}));

describe('ArticleDetailView Component', () => {
  it('renders article details correctly for a valid published article', () => {
    const onBack = vi.fn();
    render(<ArticleDetailView articleId="article-1" onBack={onBack} />);

    expect(screen.getByRole('heading', { level: 1, name: '測試專題文章標題' })).toBeInTheDocument();
    expect(screen.getByText(/發布日期:\s*2026-08-01/)).toBeInTheDocument();
    expect(screen.getByText(/作者:\s*自然觀察者/)).toBeInTheDocument();
    expect(screen.getByText('這是專題文章的詳細內容段落一。')).toBeInTheDocument();
    expect(screen.getByText('這是專題文章的詳細內容段落二。')).toBeInTheDocument();

    const backBtn = screen.getByRole('button', { name: /返回/i });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when article is not found or not published', () => {
    const onBack = vi.fn();
    render(<ArticleDetailView articleId="non-existent" onBack={onBack} />);

    expect(screen.getByText('找不到該文章')).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: /返回/i });
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders empty state for draft articles', () => {
    render(<ArticleDetailView articleId="article-draft" onBack={() => {}} />);
    expect(screen.getByText('找不到該文章')).toBeInTheDocument();
  });
});
