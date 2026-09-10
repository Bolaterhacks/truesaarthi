/**
 * The four short, ordered lists that drive the editorial sections. Each is
 * seeded into its own collection so the admin panel can add, reorder and
 * remove rows without a deploy.
 */

/** The four large editorial cards in "Where Real Change Begins". */
export const transformationAreas = [
  {
    id: 'self-discovery',
    order: 1,
    number: '01',
    title: 'Self Discovery',
    description:
      'Work out what you actually want, underneath everything you were told to want.',
    image: 'areaSelfDiscovery',
    href: '/programs/clarity-session',
  },
  {
    id: 'confidence',
    order: 2,
    number: '02',
    title: 'Confidence',
    description:
      'Build a steadiness that holds in the rooms where it usually leaves you.',
    image: 'areaConfidence',
    href: '/programs/personal-growth',
  },
  {
    id: 'career-purpose',
    order: 3,
    number: '03',
    title: 'Career & Purpose',
    description:
      'Choose work that pays you in more than money — and make the move properly.',
    image: 'areaCareer',
    href: '/programs/life-transformation',
  },
  {
    id: 'life-balance',
    order: 4,
    number: '04',
    title: 'Life Balance',
    description:
      'Rebuild the week so rest is structural, not something you earn back.',
    image: 'areaBalance',
    href: '/programs/personal-growth',
  },
];

/** The line-based list — every subject we work on. */
export const coachingAreas = [
  { id: 'self-discovery', order: 1, title: 'Self Discovery', note: 'Values, patterns, honesty' },
  { id: 'career-direction', order: 2, title: 'Career Direction', note: 'Transitions and next moves' },
  { id: 'confidence', order: 3, title: 'Confidence', note: 'Voice, presence, self-trust' },
  { id: 'personal-growth', order: 4, title: 'Personal Growth', note: 'Habits that hold' },
  { id: 'relationships', order: 5, title: 'Relationships', note: 'Boundaries and repair' },
  { id: 'life-balance', order: 6, title: 'Life Balance', note: 'Time, energy, rest' },
  { id: 'mindset', order: 7, title: 'Mindset', note: 'The stories underneath' },
  { id: 'purpose', order: 8, title: 'Purpose', note: 'Meaning you can act on' },
];

export const philosophy = [
  {
    id: 'clarity-first',
    order: 1,
    number: '01',
    title: 'Clarity First',
    description:
      'Before anything changes, the problem has to be said out loud in words that are true. Most sessions begin here — and about half of them end here too.',
  },
  {
    id: 'small-steps',
    order: 2,
    number: '02',
    title: 'Small Steps Matter',
    description:
      'I would rather you keep a small promise for a month than break an ambitious one in a week. Momentum is built from things you can repeat while tired.',
  },
  {
    id: 'empowered-growth',
    order: 3,
    number: '03',
    title: 'Empowered Growth',
    description:
      'I do not hand out plans. You know your life better than I ever will — my work is to ask the question you have been avoiding, then hold the silence after it.',
  },
  {
    id: 'self-awareness',
    order: 4,
    number: '04',
    title: 'Self Awareness',
    description:
      'Every pattern made sense once. We look for what yours was protecting before deciding whether it still earns its place.',
  },
];

export const episodes = [
  {
    id: 'ep-24',
    order: 1,
    number: '24',
    title: 'The year I stopped optimising',
    guest: 'with Dr. Halima Sheikh',
    duration: '48 min',
    href: '',
  },
  {
    id: 'ep-23',
    order: 2,
    number: '23',
    title: 'On leaving something that was working',
    guest: 'with Peter Nakashima',
    duration: '52 min',
    href: '',
  },
  {
    id: 'ep-22',
    order: 3,
    number: '22',
    title: 'Ambition after burnout',
    guest: 'with Rosa Fernandes',
    duration: '41 min',
    href: '',
  },
];

export const podcast = {
  name: 'The Saarthi Conversations',
  tagline: 'Conversations that shift perspective',
  description:
    'Unhurried conversations with people who changed direction late, quietly, or badly — and what it actually took. New episodes every other Thursday.',
  href: 'https://podcasts.apple.com',
  eyebrow: 'The podcast',
  title: 'Listen on the *long way round*',
  ctaLabel: 'Listen to the podcast',
  image: 'podcast',
};
