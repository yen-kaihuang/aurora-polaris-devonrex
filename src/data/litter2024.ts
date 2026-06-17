export interface Kitten {
  name: string;
  slug: string;
  color: string;
  sex: string;
  born: string;
  status: string;
  location: string;
  bloodType?: string;
}

// 2024 litter roster, transcribed from the design file.
export const litter2024: Kitten[] = [
  { name: 'FaFa', slug: 'fafa', color: 'Cinnamon Calico', sex: 'Female', born: 'October 10th, 2024', status: 'In Her Forever Home', location: 'Vancouver, Canada' },
  { name: 'Carter', slug: 'carter', color: 'Brown Mackerel Tabby Bicolor', sex: 'Male', born: 'October 10th, 2024', status: 'In His New Forever Home', location: 'Santa Ana, USA' },
  { name: 'Dominic', slug: 'dominic', color: 'Seal Pointed / Bicolor', sex: 'Male', born: 'November 1st, 2024', status: 'In His Forever Home', location: 'New York, USA' },
  { name: 'Drake', slug: 'drake', color: 'Brown Mackerel Tabby', sex: 'Male', born: 'November 1st, 2024', status: 'In His Forever Home', location: 'Vancouver, Canada' },
  { name: 'Dahila', slug: 'dahila', color: 'Lilac Cream Bicolor', sex: 'Female', born: 'November 1st, 2024', status: 'In Her Forever Home', location: 'Vancouver, Canada' },
  { name: 'Cameron', slug: 'cameron', color: 'Lilac Pointed with Blue Eyes', sex: 'Male', born: 'October 10th, 2024', status: 'In His Forever Home', location: 'Vancouver, Canada' },
  { name: 'Kiki', slug: 'kiki', color: 'Pure White', sex: 'Female', born: 'September 15th, 2024', status: 'In Her Forever Home', location: 'Vancouver, Canada' },
  { name: 'Leo', slug: 'leo', color: 'Black Bicolor Van', sex: 'Male', born: 'September 15th, 2024', status: 'In His New Forever Home', location: 'Surrey, Canada' },
  { name: 'Aurora', slug: 'aurora', color: 'Black Bicolor Van', sex: 'Female', born: 'September 15th, 2024', status: 'In Her New Forever Home', location: 'Surrey, Canada' },
  { name: 'Bumi', slug: 'bumi', color: 'Pure White', sex: 'Male', born: 'May 11th, 2024', status: 'In His New Forever Home', location: 'Vancouver, Canada' },
  { name: 'Wilde', slug: 'wilde', color: 'Brown Classic Tabby', sex: 'Male', born: 'May 11th, 2024', status: 'In His Forever Home', location: 'New Westminster, Canada' },
  { name: 'Clara', slug: 'clara', color: 'Pure White', sex: 'Female', born: 'March 10th, 2024', status: 'In Her Forever Home', location: 'Burnaby, Canada' },
  { name: 'YiLei', slug: 'yilei', color: 'Blue Bicolor', sex: 'Male', born: 'May 16th, 2024', status: 'In His Forever Home', location: 'Redmond, USA' },
  { name: 'Felix', slug: 'felix', color: 'Black Bicolor', sex: 'Male', born: 'May 15th, 2024', status: 'In His Forever Home', location: 'North Vancouver, Canada' },
  { name: 'William', slug: 'william', color: 'Blue Lynx Bicolor with Blue Eyes', sex: 'Male', born: 'March 7th, 2024', status: 'In His Forever Home', location: 'Hamilton, Canada' },
  { name: 'Wes', slug: 'wes', color: 'Blue Bicolor', sex: 'Male', born: 'March 7th, 2024', status: 'In His Forever Home', location: 'Vancouver, Canada' },
  { name: 'Warren', slug: 'warren', color: 'Brown Marble Tabby', sex: 'Male', born: 'March 7th, 2024', status: 'In His Forever Home', location: 'New York, USA' },
  { name: 'Valentina', slug: 'valentina', color: 'Green Eyed White', sex: 'Female', born: 'March 1st, 2024', status: 'In Her Forever Home', location: 'Vancouver, Canada' },
  { name: 'Vanessa', slug: 'vanessa', color: 'Green Eyed White', sex: 'Female', born: 'March 1st, 2024', status: 'In Her Forever Home', location: 'Calgary, Canada' },
  { name: 'Dallas', slug: 'dallas', color: 'Black Bicolor Van', sex: 'Male', born: 'November 1st, 2024', status: 'In His Forever Home', location: 'Surrey, Canada' },
];
