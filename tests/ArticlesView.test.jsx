import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

    // The content is not visible initially
    expect(screen.queryByText(/真海豹/i)).not.toBeInTheDocument();

    // Click to expand
    const readBtn = screen.getAllByRole('button', { name: /閱讀專題/i })[0];
    fireEvent.click(readBtn);
    
    // The content should now be visible
    expect(screen.getByText(/真海豹/i)).toBeInTheDocument();
    
    // Click to collapse (button text becomes "收起專題")
    const collapseBtn = screen.getByRole('button', { name: /收起專題/i });
    fireEvent.click(collapseBtn);

    // The content should be hidden again
    expect(screen.queryByText(/真海豹/i)).not.toBeInTheDocument();
  });

  it('checks state preservation (e.g., passing pre-selected activeArticleId shows the article expanded initially)', () => {
    render(<TestWrapper initialActiveArticleId="article-5d9c1b" />);
    
    // The pre-selected article's content should be visible initially
    expect(screen.getByText(/真海豹/i)).toBeInTheDocument();
    
    // Other articles' expanded content should not be visible
    expect(screen.queryByText(/掌狀角/i)).not.toBeInTheDocument();
  });
});

