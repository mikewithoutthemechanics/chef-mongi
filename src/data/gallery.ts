export const GALLERY = [
  { id: 'g1', caption: 'Jollof risotto, smoked tomato broth', tag: 'Signature', span: 'tall' },
  { id: 'g2', caption: 'Suya beef, pickled daikon', tag: 'Starter', span: 'wide' },
  { id: 'g3', caption: 'Okra & aged tenderloin', tag: 'Main', span: 'sq' },
  { id: 'g4', caption: 'Palm wine flight, Bendelry', tag: 'Pairing', span: 'sq' },
  { id: 'g5', caption: 'Dawadawa lemon tart', tag: 'Dessert', span: 'wide' },
  { id: 'g6', caption: 'Kunu chocolate delice', tag: 'Dessert', span: 'tall' },
] as const;

export const STATS = [
  { value: 14, suffix: ' yrs', label: 'Behind the pass' },
  { value: 380, suffix: '+', label: 'Private services' },
  { value: 21, suffix: '', label: 'Countries cooked in' },
  { value: 1, suffix: ' star', label: 'Michelin, 2018–2021' },
] as const;

export const NAV_LINKS = [
  { label: 'Menu', to: '/menu' },
  { label: 'Experience', to: '/experience' },
  { label: 'Story', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
] as const;
