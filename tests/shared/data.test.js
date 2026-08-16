import { describe, it, expect } from 'vitest';
import { animalsData } from '../../src/data/animalsData';
import { articlesData } from '../../src/data/articlesData';

describe('Data Layer – Animal Schema Validation', () => {
  it('contains 6 animals with Traditional Chinese names and taxonomy fields', () => {
    expect(animalsData.length).toBe(6);
    animalsData.forEach(animal => {
      expect(animal.id).toBeDefined();
      expect(animal.names.zh).toBeDefined();
      expect(animal.names.en).toBeDefined();
      expect(animal.postureType).toMatch(/^(digitigrade|unguligrade|plantigrade)$/);
      expect(animal.scientificClassification.kingdom).toContain('（');
      expect(animal.briefDescription).toBeDefined();
      expect(Array.isArray(animal.similarAnimalIds)).toBe(true);
    });
  });

  it('every animal has a valid coverImage object with required fields', () => {
    animalsData.forEach(animal => {
      const { coverImage } = animal;
      expect(coverImage).toBeDefined();
      expect(typeof coverImage.url).toBe('string');
      // sourceName is String | null
      expect(coverImage.sourceName === null || typeof coverImage.sourceName === 'string').toBe(true);
      // sourceUrl is String | null
      expect(coverImage.sourceUrl === null || typeof coverImage.sourceUrl === 'string').toBe(true);
      // uploader is Object | null; if object, must have name field
      if (coverImage.uploader !== null && coverImage.uploader !== undefined) {
        expect(typeof coverImage.uploader.name === 'string' || coverImage.uploader.name === null).toBe(true);
      }
    });
  });

  it('every photo in angles has required attribution and lifecycle fields', () => {
    animalsData.forEach(animal => {
      Object.values(animal.angles).forEach(angleData => {
        angleData.photos.forEach(photo => {
          expect(photo.id).toBeDefined();
          expect(photo.status).toMatch(/^(published|draft)$/);
          expect(typeof photo.url).toBe('string');
          // sourceName is String | null
          expect(photo.sourceName === null || typeof photo.sourceName === 'string').toBe(true);
          // sourceUrl is String | null
          expect(photo.sourceUrl === null || typeof photo.sourceUrl === 'string').toBe(true);
          // uploader must have name if present
          if (photo.uploader) {
            expect(typeof photo.uploader.name === 'string' || photo.uploader.name === null).toBe(true);
          }
          // lifecycle timestamps
          expect(photo.createdAt).toBeDefined();
          expect(photo.updatedAt).toBeDefined();
        });
      });
    });
  });

  it('every animal has exactly 2 funFacts within the correct character length range', () => {
    animalsData.forEach(animal => {
      expect(Array.isArray(animal.funFacts)).toBe(true);
      expect(animal.funFacts.length).toBe(2);
      animal.funFacts.forEach(fact => {
        expect(fact.length).toBeGreaterThanOrEqual(38);
        expect(fact.length).toBeLessThanOrEqual(46);
      });
    });
  });

  it('briefDescription for every animal is between 65 and 75 characters', () => {
    animalsData.forEach(animal => {
      const len = animal.briefDescription.length;
      expect(len).toBeGreaterThanOrEqual(65);
      expect(len).toBeLessThanOrEqual(75);
    });
  });
});

describe('Data Layer – Article Schema Validation', () => {
  it('contains articles with correct ID format and tags when data is populated', () => {
    // articlesData may be intentionally empty during development; skip field checks if so
    if (articlesData.length === 0) return;
    articlesData.forEach(article => {
      expect(article.id).toMatch(/^article-[0-9a-fA-F]{6,}$/);
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.title).toBeDefined();
    });
  });
});
