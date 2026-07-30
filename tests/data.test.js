import { describe, it, expect } from 'vitest';
import { animalsData } from '../src/data/animalsData';
import { articlesData } from '../src/data/articlesData';

describe('Data Layer Validation', () => {
  it('should contain 6 animals with Traditional Chinese text and taxonomy fields', () => {
    expect(animalsData.length).toBe(6);
    animalsData.forEach(animal => {
      expect(animal.id).toBeDefined();
      expect(animal.names.zh).toBeDefined();
      expect(animal.names.en).toBeDefined();
      expect(animal.postureType).toMatch(/^(digitigrade|unguligrade|plantigrade)$/);
      expect(animal.scientificClassification.kingdom).toContain('（');
      expect(animal.briefDescription).toBeDefined();
      expect(animal.coverImage).toBeDefined();
      expect(typeof animal.coverImage.url).toBe('string');
      expect(Array.isArray(animal.similarAnimalIds)).toBe(true);
    });
  });

  it('should contain articles with content-independent IDs and tags', () => {
    expect(articlesData.length).toBeGreaterThan(0);
    articlesData.forEach(article => {
      expect(article.id).toMatch(/^article-[0-9a-fA-F]{6,}$/); // e.g. article-5d9c1b
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.title).toBeDefined();
    });
  });
});
