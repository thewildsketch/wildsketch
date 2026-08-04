/**
 * AnnouncementsView tests.
 *
 * Uses vi.mock with a factory function to inject controlled fixture data,
 * decoupling the test from the live (possibly empty) data file.
 *
 * NOTE: vi.mock is hoisted to the top by Vitest, so the factory must be
 * self-contained – no references to variables declared outside the factory.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

vi.mock('../src/data/announcementsData', () => ({
  announcementsData: [
    {
      id: 'ann-pinned',
      title: 'WildSketch 動物速寫室正式上線公告',
      date: '2026-07-22',
      isPinned: true,
      status: 'published',
      content: '歡迎來到 WildSketch！本站旨在提供動物骨架與照片對照參考資源。',
    },
    {
      id: 'ann-plain',
      title: '速寫室燈箱疊加功能優化通知',
      date: '2026-07-24',
      isPinned: false,
      status: 'published',
      content: null,
    },
  ],
}));

import AnnouncementsView from '../src/components/AnnouncementsView';

describe('AnnouncementsView Component', () => {
  it('renders the announcements list and testid wrapper', () => {
    render(<AnnouncementsView />);
    expect(screen.getByTestId('announcements-view')).toBeInTheDocument();
    expect(screen.getByText('WildSketch 動物速寫室正式上線公告')).toBeInTheDocument();
    expect(screen.getByText('速寫室燈箱疊加功能優化通知')).toBeInTheDocument();
  });

  it('expands inline content when an announcement with content is clicked', () => {
    render(<AnnouncementsView />);

    // Content should not be visible initially
    expect(screen.queryByText(/歡迎來到 WildSketch/)).not.toBeInTheDocument();

    // Click the pinned announcement row title
    fireEvent.click(screen.getByText('WildSketch 動物速寫室正式上線公告'));
    expect(screen.getByText(/歡迎來到 WildSketch/)).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(screen.getByText('WildSketch 動物速寫室正式上線公告'));
    expect(screen.queryByText(/歡迎來到 WildSketch/)).not.toBeInTheDocument();
  });

  it('does not expand an announcement whose content is null', () => {
    render(<AnnouncementsView />);
    fireEvent.click(screen.getByText('速寫室燈箱疊加功能優化通知'));
    // No expanded content should appear
    expect(screen.queryByText(/歡迎來到 WildSketch/)).not.toBeInTheDocument();
  });
});
