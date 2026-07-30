import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ImageWithFallback from '../src/components/common/ImageWithFallback';
import AnnouncementsView from '../src/components/AnnouncementsView';
import AboutMeBlock from '../src/components/home/AboutMeBlock';
import AnimalFilter from '../src/components/AnimalFilter';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

describe('UI Enhancements & Announcement Components', () => {
  describe('ImageWithFallback Component', () => {
    it('renders img normally when src is valid', () => {
      render(<ImageWithFallback src="/test.jpg" alt="test image" className="card-img" />);
      const img = screen.getByAltText('test image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test.jpg');
    });

    it('renders fallback box when img fails to load (onError)', () => {
      render(<ImageWithFallback src="/broken.jpg" alt="broken image" className="card-img" />);
      const img = screen.getByAltText('broken image');
      fireEvent.error(img);
      expect(screen.getByTestId('img-fallback-box')).toBeInTheDocument();
    });
  });

  describe('AnnouncementsView Component', () => {
    it('renders announcements list and expands content inline on click', () => {
      render(<AnnouncementsView />);
      expect(screen.getByTestId('announcements-view')).toBeInTheDocument();

      // Click on announcement title with content
      const pinnedTitle = screen.getByText('WildSketch 動物解剖與骨架畫冊正式上線！');
      expect(pinnedTitle).toBeInTheDocument();

      fireEvent.click(pinnedTitle);
      expect(screen.getByText(/歡迎來到 WildSketch/)).toBeInTheDocument();
    });
  });

  describe('AboutMeBlock Component', () => {
    it('is temporarily hidden and renders null', () => {
      const { container } = render(<AboutMeBlock />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('AnimalFilter Component', () => {
    it('renders tabs with pure Chinese labels and places scientific names in tooltips', () => {
      const handleFilterChange = vi.fn();
      render(<AnimalFilter currentFilter="all" onFilterChange={handleFilterChange} />);

      // Verify tabs have pure Chinese name on their main button interface (aria-label has only Chinese)
      const plantigradeTab = screen.getByRole('button', { name: /^蹠行類$/ });
      expect(plantigradeTab).toBeInTheDocument();

      // Verify scientific name exists inside the tooltip title span
      const tooltipTitleCh = screen.getByText('蹠行類', { selector: '.tooltip-title' });
      expect(tooltipTitleCh).toBeInTheDocument();
      expect(tooltipTitleCh).toHaveClass('tooltip-title');

      const tooltipTitleEn = screen.getByText('(Plantigrade)');
      expect(tooltipTitleEn).toBeInTheDocument();
      expect(tooltipTitleEn).toHaveClass('tooltip-title-en');
    });
  });


  describe('Header Navigation Links', () => {
    it('renders navigation links in correct order: 首頁 -> 公告 -> 專題文章 -> 素材提供 -> 意見回饋', () => {
      render(<Header activeView="home" onViewChange={() => {}} />);
      
      expect(screen.getByRole('button', { name: /^首頁$/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^公告$/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^專題文章$/ })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /素材提供/ })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /意見回饋/ })).toBeInTheDocument();
    });
  });

  describe('Footer Component', () => {
    it('renders copyright and social links', () => {
      render(<Footer />);
      expect(screen.getByText(/WildSketch 動物速寫室/)).toBeInTheDocument();
      expect(screen.getByTestId('instagram-link')).toBeInTheDocument();
    });
  });
});
