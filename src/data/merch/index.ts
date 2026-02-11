// Merch data - add new products here
// Each product should have images in src/assets/merch/

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  sizeChart: {
    size: string;
    chest: string;
    length: string;
  }[];
  inStock: boolean;
}

// Import merch images
import tshirtBlack from '@/assets/merch/tshirt-black.jpg';
import hoodieWhite from '@/assets/merch/hoodie-white.jpg';

export const merchItems: MerchItem[] = [
  {
    id: 'tshirt-piggy-black',
    name: 'Piggy Pop Tee Black',
    price: 2990,
    description: 'Оверсайз футболка из 100% хлопка с принтом Piggy на спине. Плотность 240 г/м². Идеальна для концертов и повседневной носки.',
    images: [tshirtBlack, tshirtBlack],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeChart: [
      { size: 'S', chest: '108', length: '70' },
      { size: 'M', chest: '114', length: '72' },
      { size: 'L', chest: '120', length: '74' },
      { size: 'XL', chest: '126', length: '76' },
      { size: 'XXL', chest: '132', length: '78' },
    ],
    inStock: true,
  },
  {
    id: 'hoodie-piggy-white',
    name: 'Piggy Pop Hoodie White',
    price: 5990,
    description: 'Тёплый худи с капюшоном и принтом злой свиньи. 80% хлопок, 20% полиэстер. Принты на рукавах.',
    images: [hoodieWhite, hoodieWhite],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'S', chest: '116', length: '68' },
      { size: 'M', chest: '122', length: '70' },
      { size: 'L', chest: '128', length: '72' },
      { size: 'XL', chest: '134', length: '74' },
    ],
    inStock: true,
  },
];

export default merchItems;
