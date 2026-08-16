import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ArticleCoverPlaceholder from '../../../src/components/common/ArticleCoverPlaceholder';

describe('ArticleCoverPlaceholder Component', () => {
  it('renders SVG placeholder with brand titles and badge', () => {
    render(<ArticleCoverPlaceholder articleId="article-123" />);
    
    expect(screen.getByTestId('article-cover-placeholder')).toBeInTheDocument();
    expect(screen.getByText('WildSketch')).toBeInTheDocument();
    expect(screen.getByText('動物速寫室')).toBeInTheDocument();
    expect(screen.getByText('✦ 專題文章 ✦')).toBeInTheDocument();
  });
});
