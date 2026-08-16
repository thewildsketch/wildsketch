/**
 * ArticlesView tests.
 *
 * Uses vi.mock to inject controlled article fixtures,
 * decoupling the test from the live articlesData.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArticlesView from '../../../src/components/ArticlesView';

const mockArticles = [
  {
    id: 'article-1',
    title: '鰭足類分辨指南（海豹 vs 海獅 vs 海狗）',
    date: '2026-06-26',
    author: '自然寫生小組',
    tags: ['bear'],
    status: 'published',
    summary: '海豹、海獅、海狗常常讓人傻傻分不清楚？本文教你一秒辨識。',
    coverUrl: 'https://example.com/cover1.jpg',
  },
  {
    id: 'article-draft',
    title: '草稿文章不應顯示',
    date: '2026-06-27',
    author: '自然寫生小組',
    status: 'draft',
    summary: '草稿摘要',
  },
];

for (let i = 2; i <= 11; i++) {
  mockArticles.push({
    id: `article-${i}`,
    title: `專題文章 ${i}`,
    date: `2026-07-0${i}`,
    author: '自然寫生小組',
    status: 'published',
    summary: `專題文章摘要 ${i}`,
  });
}

vi.mock('../../../src/data/articlesData', () => ({
  get articlesData() {
    return mockArticles;
  },
}));

describe('ArticlesView Component', () => {
  it('renders articles grid with cover, meta, title, summary and "閱讀全文 →"', () => {
    const onArticleSelect = vi.fn();
    render(<ArticlesView onArticleSelect={onArticleSelect} />);

    expect(screen.getByTestId('articles-view')).toBeInTheDocument();
    expect(screen.getByText('鰭足類分辨指南（海豹 vs 海獅 vs 海狗）')).toBeInTheDocument();
    expect(screen.getByText('海豹、海獅、海狗常常讓人傻傻分不清楚？本文教你一秒辨識。')).toBeInTheDocument();
    expect(screen.getByText('2026-06-26')).toBeInTheDocument();
    expect(screen.queryByText('草稿文章不應顯示')).not.toBeInTheDocument();

    const readMoreBtns = screen.getAllByText(/閱讀全文\s*→/i);
    expect(readMoreBtns.length).toBe(9); // 9 items on page 1

    fireEvent.click(readMoreBtns[0]);
    expect(onArticleSelect).toHaveBeenCalledWith('article-1');
  });

  it('handles pagination with 9 items per page and scrolls to top on page change', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const onArticleSelect = vi.fn();
    render(<ArticlesView onArticleSelect={onArticleSelect} />);

    // Page 1: should show article-1 and article-2 through article-9 (total 9 published items: 1 + 8)
    expect(screen.getByText('鰭足類分辨指南（海豹 vs 海獅 vs 海狗）')).toBeInTheDocument();
    expect(screen.getByText('專題文章 9')).toBeInTheDocument();
    expect(screen.queryByText('專題文章 10')).not.toBeInTheDocument();

    // Pagination controls: 11 published items -> 2 pages
    const prevBtn = screen.getByRole('button', { name: '«' });
    const nextBtn = screen.getByRole('button', { name: '»' });
    const page1Btn = screen.getByRole('button', { name: '1' });
    const page2Btn = screen.getByRole('button', { name: '2' });

    expect(prevBtn).toBeDisabled();
    expect(page1Btn).toHaveClass('active');
    expect(nextBtn).not.toBeDisabled();

    // Click page 2
    fireEvent.click(page2Btn);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    // Page 2: should show article-10 and article-11 (total 2 items)
    expect(screen.getByText('專題文章 10')).toBeInTheDocument();
    expect(screen.getByText('專題文章 11')).toBeInTheDocument();
    expect(screen.queryByText('鰭足類分辨指南（海豹 vs 海獅 vs 海狗）')).not.toBeInTheDocument();

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();
    expect(page2Btn).toHaveClass('active');

    scrollToSpy.mockRestore();
  });

  it('renders unified empty state when there are no published articles', () => {
    mockArticles.length = 0;
    render(<ArticlesView onArticleSelect={() => {}} />);
    expect(screen.getByText('目前尚無專題文章')).toBeInTheDocument();
    expect(screen.getByText('目前尚無專題文章')).toHaveClass('ann-page-empty');
  });
});
