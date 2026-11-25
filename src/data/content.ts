export const SERVICES = [
  {
    id: 'private-dining',
    index: '01',
    title: 'Private Dining',
    tagline: 'Your table. Your home. My kitchen.',
    body: 'An evening cooked entirely in your space — no ovens in sight, no leaving the room, no dishes. Ideal for intimate dinners, proposals and quiet celebrations.',
    details: ['2 – 12 guests', 'Travels with you', 'Full table styling'],
    priceFrom: 'from £185 pp',
  },
  {
    id: 'events',
    index: '02',
    title: 'Events & Celebrations',
    tagline: 'Weddings, galas, launches.',
    body: 'From six-course wedding breakfasts to 200-seat brand galas, I build a service around the room you actually have, working with your planner or solo.',
    details: ['Full brigade available', 'Off-site kitchens', 'Menu tasting included'],
    priceFrom: 'from £12,000',
  },
  {
    id: 'destination',
    index: '03',
    title: 'Destination Experiences',
    tagline: 'Anywhere with a kitchen.',
    body: 'The chef’s table, wherever you are. I travel worldwide for multi-day residencies — a whole holiday cooked course by course, from Lagos to Lake Como.',
    details: ['Worldwide travel', 'Multi-day residency', 'Sourcing support'],
    priceFrom: 'on enquiry',
  },
  {
    id: 'consulting',
    index: '04',
    title: 'Culinary Consulting',
    tagline: 'For restaurants and brands.',
    body: 'Menu development, kitchen training and brand storytelling for hospitality groups. I help teams build an Afro-global point of view that is their own.',
    details: ['Menu R&D', 'Team training', 'Launch strategy'],
    priceFrom: 'from £4,500',
  },
] as const;

export const JOURNEY = [
  {
    year: '2009',
    title: 'Born in Tamale',
    body: 'Raised between my grandmother’s wood-fired kitchen and the market stalls of Tamale, where every dish carried a story about who it was made for.',
  },
  {
    year: '2014',
    title: 'The Marseille years',
    body: 'A stage apprenticeship in Provence taught me discipline — the quiet, technical backbone that lets West African instinct stay wild.',
  },
  {
    year: '2018',
    title: 'A star in the window',
    body: 'Head chef of a Michelin-listed London room, where jollof made it onto a tasting menu and critics stopped pretending it was a side dish.',
  },
  {
    year: '2021',
    title: 'Into the homes',
    body: 'I left the restaurant floor for good to cook in people’s homes, where there is no service and the conversation never stops.',
  },
  {
    year: 'Now',
    title: 'Mongi Fana',
    body: 'A private practice across the UK, Europe and the Gulf — cooking dinners that people still talk about years later.',
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'We had eaten at every great room in London. Nothing prepared us for Mongi’s jollof. He cooked for six hours in our kitchen and we talked until midnight.',
    name: 'Amara & Tom',
    detail: 'Anniversary dinner · Notting Hill',
  },
  {
    quote:
      'Our wedding breakfast ran to a hundred and forty guests and felt entirely personal. He is the calmest person I have ever met in a kitchen.',
    name: 'Priya R.',
    detail: 'Wedding · Wiltshire',
  },
  {
    quote:
      'He cooked on a yacht off the Amalfi coast. Four services, no complaints, and the crew still talk about the suya.',
    name: 'Marco R.',
    detail: 'Charter week · Amalfi Coast',
  },
] as const;

export const FAQS = [
  {
    q: 'What is the minimum booking?',
    a: 'Two guests. For evenings I usually recommend at least four so the pacing of the tasting menu is unhurried, but I will happily cook a shortened menu for two.',
  },
  {
    q: 'Do you travel with the food?',
    a: 'For private dining I arrive with everything except fresh produce, which I prefer to buy from your local market on the morning of the service.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'Prime Fridays and Saturdays book four to six weeks ahead. Weeknights are usually available within ten days. Destination residencies need eight weeks minimum.',
  },
  {
    q: 'Can you work with allergies?',
    a: 'Absolutely. Every menu is written around you. I ask about allergies, intolerances and preferences in the booking form and build an alternative course for each affected guest.',
  },
  {
    q: 'What about drinks?',
    a: 'I offer pairings built around West African palm wine, fermented cassava beers and old-world cellar wines. I will also happily work with whatever you have in the cellar.',
  },
  {
    q: 'Is the deposit refundable?',
    a: 'A 25% deposit secures your date. It is fully transferable to a new date with 14 days’ notice, and refundable up to 30 days before the service.',
  },
] as const;
