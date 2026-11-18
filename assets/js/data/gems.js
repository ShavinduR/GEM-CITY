/**
 * Loose gemstone inventory.
 * To add a stone: copy one line, give it a unique id, and drop its photo in
 * images/gemw/1/<id>.webp. Prices are in LKR. status: 'available' | 'reserved' | 'sold'.
 *
 * ⚠ Several current photos are stock images with printed captions that do not
 * match the listing (e.g. L1 shows "Zircon"). Replace with real photos of each stone.
 */
const gemPhoto = (id) => ({ src: `images/gemw/1/${id}.webp`, width: 232, height: 223, plinth: true });
const certificate = { src: 'images/opt/certificate-960.webp', srcset: 'images/opt/certificate-480.webp 480w, images/opt/certificate-960.webp 960w', width: 960, height: 646, alt: 'Sample gemmological laboratory report' };

export const GEM_CATEGORIES = [
  { id: 'all', label: 'All gems' },
  { id: 'blue', label: 'Blue sapphire' },
  { id: 'red-pink', label: 'Red & pink' },
  { id: 'yellow-orange', label: 'Yellow & orange' },
  { id: 'purple', label: 'Purple' },
  { id: 'green', label: 'Green' },
];

const DEFAULTS = { origin: 'Sri Lanka (Ceylon)', certificate: 'Gem lab report', status: 'available', page: 'all-gems.html', type: 'gem' };

export const GEMS = [
  { id: 'A1', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 2.15, shape: 'Oval', priceFrom: 450000, priceTo: 650000, photos: [gemPhoto('A1')] },
  { id: 'A2', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 1.85, shape: 'Cushion', priceFrom: 380000, priceTo: 520000, photos: [gemPhoto('A2')] },
  { id: 'A3', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 3.05, shape: 'Round', priceFrom: 750000, priceTo: 950000, photos: [gemPhoto('A3')], featured: true },
  { id: 'A4', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 2.40, shape: 'Oval', priceFrom: 420000, priceTo: 580000, photos: [gemPhoto('A4')] },
  { id: 'A5', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 1.90, shape: 'Pear', priceFrom: 310000, priceTo: 450000, photos: [gemPhoto('A5')] },
  { id: 'A6', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 2.25, shape: 'Emerald', priceFrom: 350000, priceTo: 480000, photos: [gemPhoto('A6')] },
  { id: 'A7', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 1.70, shape: 'Heart', priceFrom: 280000, priceTo: 390000, photos: [gemPhoto('A7')] },
  { id: 'A8', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 2.80, shape: 'Oval', priceFrom: 620000, priceTo: 850000, photos: [gemPhoto('A8')], featured: true },
  { id: 'A9', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 2.00, shape: 'Cushion', priceFrom: 390000, priceTo: 540000, photos: [gemPhoto('A9')] },
  { id: 'A10', name: 'Ceylon Blue Sapphire', category: 'blue', carat: 3.50, shape: 'Oval', priceFrom: 850000, priceTo: 1200000, photos: [gemPhoto('A10')], featured: true },
  { id: 'M1', name: 'Vivid Red Spinel', category: 'red-pink', carat: 1.55, shape: 'Oval', priceFrom: 125000, priceTo: 185000, photos: [gemPhoto('M1')] },
  { id: 'M2', name: 'Vivid Red Spinel', category: 'red-pink', carat: 2.10, shape: 'Cushion', priceFrom: 195000, priceTo: 245000, photos: [gemPhoto('M2')], featured: true },
  { id: 'M3', name: 'Vivid Red Spinel', category: 'red-pink', carat: 1.80, shape: 'Pear', priceFrom: 145000, priceTo: 195000, photos: [gemPhoto('M3')] },
  { id: 'M4', name: 'Vivid Red Spinel', category: 'red-pink', carat: 2.50, shape: 'Oval', priceFrom: 210000, priceTo: 290000, photos: [gemPhoto('M4')] },
  { id: 'P1', name: 'Pink Sapphire', category: 'red-pink', carat: 3.25, shape: 'Oval', priceFrom: 310000, priceTo: 425000, photos: [gemPhoto('P1')], featured: true },
  { id: 'P2', name: 'Pink Sapphire', category: 'red-pink', carat: 2.45, shape: 'Pear', priceFrom: 225000, priceTo: 310000, photos: [gemPhoto('P2')] },
  { id: 'P3', name: 'Pink Sapphire', category: 'red-pink', carat: 1.95, shape: 'Heart', priceFrom: 175000, priceTo: 240000, photos: [gemPhoto('P3')] },
  { id: 'P4', name: 'Pink Sapphire', category: 'red-pink', carat: 2.80, shape: 'Round', priceFrom: 260000, priceTo: 350000, photos: [gemPhoto('P4')] },
  { id: 'P5', name: 'Pink Sapphire', category: 'red-pink', carat: 1.65, shape: 'Oval', priceFrom: 150000, priceTo: 210000, photos: [gemPhoto('P5')] },
  { id: 'P6', name: 'Pink Sapphire', category: 'red-pink', carat: 3.10, shape: 'Cushion', priceFrom: 280000, priceTo: 350000, photos: [gemPhoto('P6')] },
  { id: 'P7', name: 'Pink Sapphire', category: 'red-pink', carat: 2.20, shape: 'Round', priceFrom: 185000, priceTo: 240000, photos: [gemPhoto('P7')] },
  { id: 'P8', name: 'Pink Sapphire', category: 'red-pink', carat: 1.45, shape: 'Oval', priceFrom: 95000, priceTo: 135000, photos: [gemPhoto('P8')] },
  { id: 'O1', name: 'Orange Sapphire', category: 'yellow-orange', carat: 2.40, shape: 'Oval', priceFrom: 280000, priceTo: 395000, photos: [gemPhoto('O1')] },
  { id: 'Y1', name: 'Vivid Yellow Sapphire', category: 'yellow-orange', carat: 3.15, shape: 'Cushion', priceFrom: 450000, priceTo: 680000, photos: [gemPhoto('Y1')], featured: true },
  { id: 'Y2', name: 'Vivid Yellow Sapphire', category: 'yellow-orange', carat: 2.60, shape: 'Round', priceFrom: 310000, priceTo: 485000, photos: [gemPhoto('Y2')] },
  { id: 'Y3', name: 'Vivid Yellow Sapphire', category: 'yellow-orange', carat: 1.80, shape: 'Oval', priceFrom: 220000, priceTo: 345000, photos: [gemPhoto('Y3')] },
  { id: 'Y4', name: 'Vivid Yellow Sapphire', category: 'yellow-orange', carat: 2.20, shape: 'Pear', priceFrom: 265000, priceTo: 410000, photos: [gemPhoto('Y4')] },
  { id: 'Y5', name: 'Vivid Yellow Sapphire', category: 'yellow-orange', carat: 4.05, shape: 'Oval', priceFrom: 650000, priceTo: 890000, photos: [gemPhoto('Y5')], featured: true },
  { id: 'E1', name: 'Green Sapphire', category: 'green', carat: 2.55, shape: 'Oval', priceFrom: 180000, priceTo: 250000, photos: [gemPhoto('E1')] },
  { id: 'E2', name: 'Green Sapphire', category: 'green', carat: 1.90, shape: 'Cushion', priceFrom: 125000, priceTo: 180000, photos: [gemPhoto('E2')] },
  { id: 'E3', name: 'Green Sapphire', category: 'green', carat: 2.30, shape: 'Oval', priceFrom: 160000, priceTo: 225000, photos: [gemPhoto('E3')] },
  { id: 'L1', name: 'Purple Sapphire', category: 'purple', carat: 1.85, shape: 'Oval', priceFrom: 140000, priceTo: 195000, photos: [gemPhoto('L1')] },
  { id: 'L2', name: 'Purple Sapphire', category: 'purple', carat: 2.40, shape: 'Cushion', priceFrom: 210000, priceTo: 290000, photos: [gemPhoto('L2')] },
  { id: 'L3', name: 'Purple Sapphire', category: 'purple', carat: 2.10, shape: 'Heart', priceFrom: 165000, priceTo: 235000, photos: [gemPhoto('L3')] },
  { id: 'L4', name: 'Purple Sapphire', category: 'purple', carat: 1.60, shape: 'Oval', priceFrom: 120000, priceTo: 175000, photos: [gemPhoto('L4')] },
  { id: 'L5', name: 'Purple Sapphire', category: 'purple', carat: 3.20, shape: 'Pear', priceFrom: 320000, priceTo: 450000, photos: [gemPhoto('L5')], featured: true },
  { id: 'L6', name: 'Purple Sapphire', category: 'purple', carat: 2.75, shape: 'Cushion', priceFrom: 245000, priceTo: 340000, photos: [gemPhoto('L6')] },
  { id: 'L7', name: 'Purple Sapphire', category: 'purple', carat: 1.95, shape: 'Round', priceFrom: 155000, priceTo: 220000, photos: [gemPhoto('L7')] },
].map((gem) => ({ ...DEFAULTS, ...gem, photos: [...gem.photos, certificate] }));
