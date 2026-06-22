import { describe, it, expect } from 'vitest';
import { allBreedingCatsQuery, parseCats, type BreedingCat } from './queries';

describe('allBreedingCatsQuery', () => {
  it('查詢字串包含必要欄位', () => {
    expect(allBreedingCatsQuery).toContain('breedingCat');
    expect(allBreedingCatsQuery).toContain('nameEn');
    expect(allBreedingCatsQuery).toContain('nameZh');
    expect(allBreedingCatsQuery).toContain('role');
    expect(allBreedingCatsQuery).toContain('photos');
  });
});

describe('parseCats', () => {
  const sample: BreedingCat[] = [
    {
      _id: '1',
      role: 'king',
      nameEn: 'Elijah',
      nameZh: '伊利亚',
      photos: [{ asset: { _ref: 'image-a' } }],
      color: 'White',
      bloodline: null,
      introEn: null,
      introZh: null,
      displayOrder: 1,
    },
    {
      _id: '2',
      role: 'queen',
      nameEn: 'Vivian',
      nameZh: '薇薇安',
      photos: [{ asset: { _ref: 'image-b' } }],
      color: 'Odd-Eyed',
      bloodline: null,
      introEn: null,
      introZh: null,
      displayOrder: 1,
    },
  ];

  it('依 role 分組為 kings / queens', () => {
    const { kings, queens } = parseCats(sample);
    expect(kings).toHaveLength(1);
    expect(queens).toHaveLength(1);
    expect(kings[0].nameEn).toBe('Elijah');
    expect(queens[0].nameEn).toBe('Vivian');
  });

  it('空陣列時各組皆為空', () => {
    const { kings, queens } = parseCats([]);
    expect(kings).toEqual([]);
    expect(queens).toEqual([]);
  });
});
