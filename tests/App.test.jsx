import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App';

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

  it('should handle popstate event for browser back/forward navigation', () => {
    render(<App />);
    expect(screen.getByTestId('home-view')).toBeInTheDocument();

    act(() => {
      window.history.pushState(null, '', '/animal/cat');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('detail-view-full')).toBeInTheDocument();

    act(() => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('home-view')).toBeInTheDocument();
  });
});

