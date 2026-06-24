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

export interface AvailableKitten {
  _id: string;
  nameEn: string;
  nameZh: string;
  photos: { asset: { _ref: string } }[];
  gender: 'male' | 'female';
  color: string | null;
  birthday: string | null;
  status: 'available' | 'reserved';
  introEn: string | null;
  introZh: string | null;
}

export const allAvailableKittensQuery = `*[_type == "availableKitten"] | order(_createdAt asc) {
  _id,
  nameEn,
  nameZh,
  photos,
  gender,
  color,
  birthday,
  status,
  introEn,
  introZh
}`;
