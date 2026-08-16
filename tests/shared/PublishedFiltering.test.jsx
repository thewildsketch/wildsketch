import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import HomeView from '../../src/components/HomeView';
import AnnouncementsView from '../../src/components/AnnouncementsView';
import ArticlesView from '../../src/components/ArticlesView';
import AnimalInsights from '../../src/components/AnimalInsights';
import PhotoPanel from '../../src/components/PhotoPanel';

vi.mock('../../src/data/announcementsData', () => ({
  announcementsData: [
    {
      id: 'ann-published-1',
      title: '已發布公告 1',
      date: '2026-07-20',
      isPinned: false,
      status: 'published',
      content: '這是已發布公告的內容',
    },
    {
      id: 'ann-draft-1',
      title: '草稿公告 1',
      date: '2026-07-25',
      isPinned: true,
      status: 'draft',
      content: '這是草稿公告內容，不應呈現',
    },
  ],
}));

vi.mock('../../src/data/articlesData', () => ({
  articlesData: [
    {
      id: 'article-published-1',
      title: '已發布專題文章 1',
      date: '2026-07-20',
      author: '編輯部',
      tags: ['cat', 'dog'],
      status: 'published',
      summary: '已發布文章摘要',
      content: <div>已發布文章內文</div>,
    },
    {
      id: 'article-draft-1',
      title: '草稿專題文章 1',
      date: '2026-07-25',
      author: '草稿作者',
      tags: ['cat'],
      status: 'draft',
      summary: '草稿文章摘要，不應出現',
      content: <div>草稿文章內文</div>,
    },
  ],
}));

vi.mock('../../src/data/animalsData', () => ({
  animalsData: [
    {
      id: 'cat',
      status: 'published',
      names: { zh: '貓', en: 'Cat' },
      postureType: 'digitigrade',
      funFacts: ['貓咪小知識'],
      similarAnimalIds: ['dog', 'draft_wolf'],
    },
    {
      id: 'dog',
      status: 'published',
      names: { zh: '狗', en: 'Dog' },
      postureType: 'digitigrade',
      funFacts: ['狗狗小知識'],
      similarAnimalIds: ['cat'],
    },
    {
      id: 'draft_wolf',
      status: 'draft',
      names: { zh: '野狼草稿', en: 'Draft Wolf' },
      postureType: 'digitigrade',
      funFacts: ['野狼小知識'],
      similarAnimalIds: ['dog'],
    },
  ],
}));

describe('Frontend Published Filtering Alignment', () => {
  describe('1. HomeView & AnimalGrid filtering', () => {
    const mockAnimals = [
      {
        id: 'published-cat',
        status: 'published',
        names: { zh: '已發布貓', en: 'Published Cat' },
        postureType: 'digitigrade',
        coverImage: { url: '/cat.jpg' },
      },
      {
        id: 'draft-tiger',
        status: 'draft',
        names: { zh: '草稿老虎', en: 'Draft Tiger' },
        postureType: 'digitigrade',
        coverImage: { url: '/tiger.jpg' },
      },
      {
        id: 'published-bear',
        status: 'published',
        names: { zh: '已發布熊', en: 'Published Bear' },
        postureType: 'plantigrade',
        coverImage: { url: '/bear.jpg' },
      },
    ];

    it('renders only published animals in HomeView and ignores draft animals', () => {
      render(<HomeView animals={mockAnimals} onAnimalSelect={vi.fn()} />);

      expect(screen.getByText('已發布貓')).toBeInTheDocument();
      expect(screen.getByText('已發布熊')).toBeInTheDocument();
      expect(screen.queryByText('草稿老虎')).not.toBeInTheDocument();
    });

    it('filters correctly by postureType among published animals only', () => {
      render(<HomeView animals={mockAnimals} onAnimalSelect={vi.fn()} />);

      const digitigradeTab = screen.getByRole('button', { name: /^趾行類$/ });
      fireEvent.click(digitigradeTab);

      expect(screen.getByText('已發布貓')).toBeInTheDocument();
      expect(screen.queryByText('草稿老虎')).not.toBeInTheDocument();
      expect(screen.queryByText('已發布熊')).not.toBeInTheDocument();
    });
  });

  describe('2. AnnouncementsView filtering', () => {
    it('renders only published announcements and hides draft announcements', () => {
      render(<AnnouncementsView />);

      expect(screen.getByText('已發布公告 1')).toBeInTheDocument();
      expect(screen.queryByText('草稿公告 1')).not.toBeInTheDocument();
    });
  });

  describe('3. ArticlesView filtering', () => {
    it('renders only published articles and hides draft articles', () => {
      render(<ArticlesView activeArticleId={null} onArticleSelect={vi.fn()} />);

      expect(screen.getByText('已發布專題文章 1')).toBeInTheDocument();
      expect(screen.queryByText('草稿專題文章 1')).not.toBeInTheDocument();
    });

    it('does not display content of draft article even if activeArticleId matches', () => {
      render(<ArticlesView activeArticleId="article-draft-1" onArticleSelect={vi.fn()} />);

      expect(screen.queryByText('草稿專題文章 1')).not.toBeInTheDocument();
      expect(screen.queryByText('草稿文章內文')).not.toBeInTheDocument();
    });
  });

  describe('4. AnimalInsights filtering', () => {
    it('renders only published similar animals and published related articles', () => {
      const currentAnimal = {
        id: 'cat',
        status: 'published',
        funFacts: ['Fact 1'],
        similarAnimalIds: ['dog', 'draft_wolf'],
      };

      const handleNavAnimal = vi.fn();
      const handleNavArticle = vi.fn();

      render(
        <AnimalInsights
          animal={currentAnimal}
          onNavigateAnimal={handleNavAnimal}
          onNavigateArticle={handleNavArticle}
        />
      );

      // Published similar animal (dog) should be rendered
      expect(screen.getByText(/狗（Dog）/)).toBeInTheDocument();
      // Draft similar animal (draft_wolf) must NOT be rendered
      expect(screen.queryByText(/野狼草稿/)).not.toBeInTheDocument();

      // Published article (tagged with 'cat') should be rendered
      expect(screen.getByText('已發布專題文章 1')).toBeInTheDocument();
      // Draft article (tagged with 'cat') must NOT be rendered
      expect(screen.queryByText('草稿專題文章 1')).not.toBeInTheDocument();
    });
  });

  describe('5. PhotoPanel photo status filtering', () => {
    it('renders only photos with status published and excludes draft photos', () => {
      const photos = [
        {
          id: 'photo_pub_1',
          status: 'published',
          url: '/pub1.jpg',
          skeleton: '/pub1_skel.png',
        },
        {
          id: 'photo_draft_1',
          status: 'draft',
          url: '/draft1.jpg',
          skeleton: '/draft1_skel.png',
        },
        '/legacy_pub.jpg', // string legacy format is treated as published
      ];

      render(<PhotoPanel photos={photos} />);

      const images = screen.getAllByRole('img');
      // Should have 2 images (photo_pub_1 and legacy_pub.jpg), not 3
      expect(images.length).toBe(2);
      expect(screen.getByAltText('參考照片 1')).toHaveAttribute('src', '/pub1.jpg');
      expect(screen.getByAltText('參考照片 2')).toHaveAttribute('src', '/legacy_pub.jpg');
    });

    it('renders empty photos-grid when all photos are draft', () => {
      const photos = [
        {
          id: 'photo_draft_1',
          status: 'draft',
          url: '/draft1.jpg',
        },
        {
          id: 'photo_draft_2',
          status: 'draft',
          url: '/draft2.jpg',
        },
      ];

      render(<PhotoPanel photos={photos} />);
      const grid = document.querySelector('.photos-grid');
      expect(grid).toBeInTheDocument();
      expect(grid.children.length).toBe(0);
    });
  });
});
