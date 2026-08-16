import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import App from '../../../src/App';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';

vi.mock('../../../src/data/articlesData', () => ({
  articlesData: [
    {
      id: 'article-test-1',
      title: '測試文章標題一',
      date: '2026-08-01',
      author: '寫生小組',
      tags: ['cat'],
      status: 'published',
      summary: '測試文章一摘要',
      content: <p>測試文章一全文內容</p>,
    }
  ],
}));

describe('App Shell Navigation & URL Routing', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/');
  });

  it('should render header and support navigation between Home and Articles views', () => {
    render(<App />);
    expect(screen.getAllByText(/WildSketch/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/動物速寫室/i)[0]).toBeInTheDocument();

    // Navigate to Announcements
    const annBtn = screen.getByRole('button', { name: /^公告$/ });
    fireEvent.click(annBtn);
    expect(screen.getByTestId('announcements-view')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/announcements');

    // Navigate to Articles
    const articleBtn = screen.getByRole('button', { name: /^專題文章$/ });
    fireEvent.click(articleBtn);
    expect(screen.getByTestId('articles-view')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/articles');

    // Navigate back to Home
    const homeBtn = screen.getByRole('button', { name: /^首頁$/ });
    fireEvent.click(homeBtn);
    expect(screen.getByTestId('home-view')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  it('should initialize state from URL pathname on load', () => {
    window.history.pushState(null, '', '/animal/cat');
    render(<App />);
    expect(screen.getByTestId('detail-view-full')).toBeInTheDocument();
    expect(screen.getByText('Cat')).toBeInTheDocument();
  });

  it('should initialize article detail view from /articles/:id pathname on load', () => {
    window.history.pushState(null, '', '/articles/article-test-1');
    render(<App />);
    expect(screen.getByTestId('article-detail-view')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '測試文章標題一' })).toBeInTheDocument();
    expect(screen.getByText('測試文章一全文內容')).toBeInTheDocument();
  });

  it('should support navigating from articles list to article detail and back', () => {
    window.history.pushState(null, '', '/articles');
    render(<App />);
    expect(screen.getByTestId('articles-view')).toBeInTheDocument();

    // Click article card or read more to navigate to detail view
    const readMore = screen.getByText(/閱讀全文\s*→/i);
    fireEvent.click(readMore);

    expect(window.location.pathname).toBe('/articles/article-test-1');
    expect(screen.getByTestId('article-detail-view')).toBeInTheDocument();
    expect(screen.getByText('測試文章一全文內容')).toBeInTheDocument();

    // Click back button to return to articles list
    const backBtn = screen.getByRole('button', { name: /返回/i });
    fireEvent.click(backBtn);

    expect(window.location.pathname).toBe('/articles');
    expect(screen.getByTestId('articles-view')).toBeInTheDocument();
  });

  it('should not render animal detail view if animal is not published or does not exist', () => {
    window.history.pushState(null, '', '/animal/non_existent_or_draft');
    render(<App />);
    expect(screen.queryByTestId('detail-view-full')).not.toBeInTheDocument();
  });

  it('should handle popstate event for browser back/forward navigation', () => {
    render(<App />);
    expect(screen.getByTestId('home-view')).toBeInTheDocument();

    act(() => {
      window.history.pushState(null, '', '/animal/cat');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('detail-view-full')).toBeInTheDocument();

    act(() => {
      window.history.pushState(null, '', '/articles/article-test-1');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('article-detail-view')).toBeInTheDocument();

    act(() => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('home-view')).toBeInTheDocument();
  });
});

describe('Header Component', () => {
  it('renders navigation links in correct order: 首頁 → 公告 → 專題文章 → 意見回饋', () => {
    render(<Header activeView="home" onViewChange={() => {}} />);

    expect(screen.getByRole('button', { name: /^首頁$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^公告$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^專題文章$/ })).toBeInTheDocument();
    // 意見回饋 is an external link (<a>)
    expect(screen.getByRole('link', { name: /意見回饋/ })).toBeInTheDocument();
    // 素材提供 has been removed from the nav
    expect(screen.queryByRole('link', { name: /素材提供/ })).not.toBeInTheDocument();
  });

  it('highlights 專題文章 button when activeView is articles or article-detail', () => {
    const { rerender } = render(<Header activeView="articles" onViewChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^專題文章$/ })).toHaveClass('active');

    rerender(<Header activeView="article-detail" onViewChange={() => {}} />);
    expect(screen.getByRole('button', { name: /^專題文章$/ })).toHaveClass('active');
  });
});

describe('Footer Component', () => {
  it('renders copyright text and Instagram social link', () => {
    render(<Footer />);
    expect(screen.getByText(/WildSketch 動物速寫室/)).toBeInTheDocument();
    expect(screen.getByTestId('instagram-link')).toBeInTheDocument();
  });
});
