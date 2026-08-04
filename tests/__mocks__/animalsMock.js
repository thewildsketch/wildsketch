/**
 * Shared mock animal data for unit tests.
 * Import specific fixtures to keep tests focused and maintainable.
 */

/** Minimal animal with a short briefDescription (≤50 chars). Used to test truncation absence. */
export const shortDescAnimal = {
  id: 'short-desc-animal',
  status: 'published',
  sortOrder: 99,
  names: { zh: '矮子', en: 'Shorty' },
  postureType: 'plantigrade',
  briefDescription: 'This is a short description.',
  coverImage: {
    url: '/assets/images/shorty.jpg',
    sourceName: null,
    sourceUrl: null,
    sourceImage: null,
    uploader: null,
  },
  breeds: [],
  angles: {
    front: { skeleton: null, photos: [] },
    side: { skeleton: null, photos: [] },
    threeQuarter: { skeleton: null, photos: [] },
  },
  funFacts: ['Short fact one is long enough here.', 'Short fact two is long enough here.'],
  similarAnimalIds: [],
  wikiUrl: 'https://zh.wikipedia.org/wiki/test',
  scientificClassification: {
    kingdom: '動物界（Animalia）',
    phylum: '脊索動物門（Chordata）',
    class: '哺乳綱（Mammalia）',
    order: '食肉目（Carnivora）',
    family: '測試科（Testidae）',
    genus: '測試屬（Testus）',
    species: '測試種（Testus shortus）',
  },
};

/** Animal with full attribution on both cover and a front photo. Used to test attribution link rendering. */
export const attributionAnimal = {
  id: 'attribution-test',
  status: 'published',
  sortOrder: 98,
  names: { zh: '測試獸', en: 'TestBeast' },
  postureType: 'digitigrade',
  briefDescription: 'A test animal for verifying attribution rendering.',
  coverImage: {
    url: '/assets/animals/test/cover.jpg',
    sourceName: 'Unsplash',
    sourceUrl: 'https://unsplash.com/photos/cover-test',
    sourceImage: 'https://images.unsplash.com/photo-cover-test',
    uploader: {
      name: 'TestPhotographer',
      profileUrl: 'https://unsplash.com/@testphotographer',
    },
  },
  breeds: [],
  angles: {
    front: {
      skeleton: '/assets/animals/test/front_skeleton.png',
      photos: [
        {
          id: 'photo_test_front_001',
          status: 'published',
          url: '/assets/animals/test/front/front_ref_001.jpg',
          skeleton: '/assets/animals/test/front/front_ref_001_skeleton.png',
          breedId: null,
          sourceName: 'Pexels',
          sourceUrl: 'https://www.pexels.com/photo/test-001',
          sourceImage: null,
          uploader: {
            name: 'PexelsUser',
            profileUrl: 'https://www.pexels.com/@pexelsuser',
          },
          createdAt: '2026-08-01T00:00:00Z',
          updatedAt: '2026-08-01T00:00:00Z',
          publishedAt: '2026-08-01T00:00:00Z',
        },
      ],
    },
    side: { skeleton: null, photos: [] },
    threeQuarter: { skeleton: null, photos: [] },
  },
  funFacts: [
    'Test fact one that is long enough here.',
    'Test fact two that is long enough too.',
  ],
  similarAnimalIds: [],
  wikiUrl: 'https://zh.wikipedia.org/wiki/testbeast',
  scientificClassification: {
    kingdom: '動物界（Animalia）',
    phylum: '脊索動物門（Chordata）',
    class: '哺乳綱（Mammalia）',
    order: '食肉目（Carnivora）',
    family: '測試科（Testidae）',
    genus: '測試屬（Testus）',
    species: '全屬種（Testus fullattributus）',
  },
};

/** Animal with sourceName but NO sourceUrl (cover link should fall back to <span>). */
export const noSourceUrlAnimal = {
  ...attributionAnimal,
  id: 'no-source-url',
  coverImage: {
    ...attributionAnimal.coverImage,
    sourceUrl: null, // sourceName present but no URL to link
  },
};

/** Animal with uploader but NO profileUrl (uploader should render as plain text, not a link). */
export const noProfileUrlAnimal = {
  ...attributionAnimal,
  id: 'no-profile-url',
  coverImage: {
    ...attributionAnimal.coverImage,
    uploader: { name: 'AnonymousPhotographer', profileUrl: null },
  },
};

/** Animal with no attribution at all (cover-attribution element should not render). */
export const noAttributionAnimal = {
  ...attributionAnimal,
  id: 'no-attribution',
  coverImage: {
    url: '/assets/animals/test/cover.jpg',
    sourceName: null,
    sourceUrl: null,
    sourceImage: null,
    uploader: null,
  },
};
