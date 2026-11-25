export type Dish = {
  id: string;
  name: string;
  origin: string;
  description: string;
  price: number;
  course: 'Amuse' | 'Starter' | 'Main' | 'Dessert' | 'Pairing';
  pairing?: string;
  tags: string[];
};

export const DISHES: Dish[] = [
  {
    id: 'jollof-risotto',
    name: 'Smoked Jollof Risotto',
    origin: 'Lagos · Milano',
    description:
      'Cacauyau rice slowly released in smoked tomato broth, finished with aged parmesan and a burnt-chilli oil that blooms in the warmth of the palate.',
    price: 34,
    course: 'Starter',
    tags: ['Signature', 'Vegetarian'],
  },
  {
    id: 'suya-tataki',
    name: 'Suya Beef Tataki',
    origin: 'Kano · Kyoto',
    description:
      'Hanging-aged striploin seared rare, dusted in yaji and served with pickled daikon, tamarind gel and a smoked bone-marrow emulsion.',
    price: 42,
    course: 'Starter',
    pairing: 'Barolo, Alto Piemonte',
    tags: ['Signature', 'Contains nuts'],
  },
  {
    id: 'jollof-souffle',
    name: 'Jollof Soufflé',
    origin: 'Accra · Paris',
    description:
      'Airy soufflé of fermented cassava and red pepper, crowned with brown-butter shito and a fine lace of palm sugar.',
    price: 26,
    course: 'Amuse',
    tags: ['Gluten-free'],
  },
  {
    id: 'okra-tenderloin',
    name: 'Okra & Aged Tenderloin',
    origin: 'Savannah · Buenos Aires',
    description:
      'Filet mignon lacquered in palm-nut dukkah, rested on confit okra, and lifted with a hibiscus-and-pepper reduction.',
    price: 68,
    course: 'Main',
    pairing: 'Malbec, Mendoza',
    tags: ['Chef’s pick'],
  },
  {
    id: 'peri-peri-quail',
    name: 'Flame Peri-Peri Quail',
    origin: 'Maputo · Marseille',
    description:
      'Whole quail glazed in peri-peri butter, charred over open flame, with preserved lemon, cashew and a smoked aubergine purée.',
    price: 58,
    course: 'Main',
    tags: ['Spicy'],
  },
  {
    id: 'dawadawa-tart',
    name: 'Dawadawa Lemon Tart',
    origin: 'Tamale · Lyon',
    description:
      'Crisp pâte sucrée, a bright preserved-lemon curd, and a cloud of dawadawa meringue scented with West African bay.',
    price: 24,
    course: 'Dessert',
    pairing: 'Late-harvest Riesling',
    tags: ['Vegetarian'],
  },
  {
    id: 'kunu-chocolate',
    name: 'Kunu Chocolate Delice',
    origin: 'Ilorin · Brussels',
    description:
      'Single-origin Ghanaian 72%, set against tart hibiscus gel, salted caramel and toasted almond praline.',
    price: 26,
    course: 'Dessert',
    tags: ['Contains nuts'],
  },
  {
    id: 'palm-wine-pairing',
    name: 'Palm Wine Pairing Flight',
    origin: 'Bendelry · 3 glasses',
    description:
      'Three pours of small-batch palm wine, from dry and mineral to rich and amber, chosen to trace the arc of the menu.',
    price: 45,
    course: 'Pairing',
    tags: ['Contains alcohol'],
  },
];

export const MENUS = [
  {
    id: 'signature',
    name: 'The Signature Tasting',
    courses: 9,
    duration: '3 hrs 15 min',
    price: 185,
    note: 'Chef’s full expression. Available in-home or on location.',
    featured: true,
  },
  {
    id: 'odyssey',
    name: 'The Afro-Global Odyssey',
    courses: 13,
    duration: '4 hrs',
    price: 265,
    note: 'A region-by-region journey across West Africa and beyond.',
    featured: false,
  },
  {
    id: 'lunch',
    name: 'Long Table Lunch',
    courses: 6,
    duration: '2 hrs 30 min',
    price: 120,
    note: 'A relaxed midday service built for lingering conversation.',
    featured: false,
  },
] as const;
