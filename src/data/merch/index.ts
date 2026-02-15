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
import piggyPunkImg from '@/assets/merch/PiggyPunk.png';
import giggyGangImg from '@/assets/merch/GiggyGang.png';
import piggyButchImg from '@/assets/merch/PiggyButch.png';

export const merchItems: MerchItem[] = [
  {
    id: 'piggy-punk',
    name: 'PiggyPunk',
    price: 3500,
    description: 'Оверсайз футболка с дерзким принтом PiggyPunk. 100% хлопок, плотность 240 г/м².',
    images: [piggyPunkImg],
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
    id: 'giggy-gang',
    name: 'GiggyGang',
    price: 3500,
    description: 'Лимитированная футболка GiggyGang для настоящих фанатов.',
    images: [giggyGangImg],
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
    id: 'piggy-butch',
    name: 'PiggyButch',
    price: 4000,
    description: 'Эксклюзивный мерч PiggyButch с уникальным дизайном.',
    images: [piggyButchImg],
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
];

export default merchItems;

