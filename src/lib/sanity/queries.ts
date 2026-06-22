export interface BreedingCat {
  _id: string;
  role: 'king' | 'queen';
  nameEn: string;
  nameZh: string;
  photos: { asset: { _ref: string } }[];
  color: string | null;
  bloodline: string | null;
  introEn: string | null;
  introZh: string | null;
  displayOrder: number;
}

export const allBreedingCatsQuery = `*[_type == "breedingCat"] | order(role asc, displayOrder asc) {
  _id,
  role,
  nameEn,
  nameZh,
  photos,
  color,
  bloodline,
  introEn,
  introZh,
  displayOrder
}`;

export function parseCats(cats: BreedingCat[]): { kings: BreedingCat[]; queens: BreedingCat[] } {
  return {
    kings: cats.filter((c) => c.role === 'king'),
    queens: cats.filter((c) => c.role === 'queen'),
  };
}
