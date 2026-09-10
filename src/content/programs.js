/**
 * Seeded into the `programs` collection. `order` drives display sequence so
 * the admin panel can reorder without touching slugs (which are URLs).
 *
 * `image` is a key into `settings/media` rather than a URL, so re-shooting the
 * art direction stays a one-document change.
 */
export const programs = [
  {
    slug: 'clarity-session',
    order: 1,
    index: '01',
    title: 'Clarity Session',
    kicker: 'Start here',
    duration: '60 minutes',
    format: 'One session · online or in studio',
    price: 2500,
    priceLabel: '₹2,500',
    priceNote: 'per session',
    featured: false,
    accent: 'sky',
    published: true,
    image: 'programClarity',
    excerpt:
      'One focused hour to name what is actually going on — and leave with a decision you can act on this week.',
    summary:
      'Most people arrive carrying six things at once. We take them apart, find the one that is really holding the others in place, and work on that. You leave with language for the problem and a first move small enough that you will actually make it.',
    forWho: [
      'You are stuck on one specific decision',
      'You want to try coaching before committing',
      'You need an honest outside perspective, quickly',
    ],
    includes: [
      'A 60-minute one-to-one session',
      'A short intake questionnaire beforehand',
      'Written session notes within 48 hours',
      'One follow-up email exchange',
    ],
    outcomes: [
      'A clear articulation of what is actually stuck',
      'One decision made, out loud',
      'A first step sized for a real week',
    ],
  },
  {
    slug: 'personal-growth',
    order: 2,
    index: '02',
    title: 'Personal Growth',
    kicker: 'Most chosen',
    duration: '6 sessions · 3 months',
    format: 'Fortnightly · online or in studio',
    price: 14000,
    priceLabel: '₹14,000',
    priceNote: 'six sessions',
    featured: true,
    accent: 'primary',
    published: true,
    image: 'programGrowth',
    excerpt:
      'A three-month arc for rebuilding confidence, boundaries and the way you spend your attention.',
    summary:
      'Six conversations across three months — enough time for something to actually change, short enough to stay urgent. We work on the patterns underneath the symptoms: how you decide, how you rest, what you say yes to and why.',
    forWho: [
      'You keep repeating a pattern you can name but not break',
      'Your confidence does not match your competence',
      'You want structure without a rigid programme',
    ],
    includes: [
      'Six 60-minute one-to-one sessions',
      'A personalised growth map after session one',
      'Between-session practices, kept deliberately small',
      'WhatsApp voice-note support between sessions',
      'A closing review session',
    ],
    outcomes: [
      'Boundaries you can hold without rehearsing them',
      'A working relationship with your own standards',
      'Decisions made from intention rather than reaction',
    ],
  },
  {
    slug: 'life-transformation',
    order: 3,
    index: '03',
    title: 'Life Transformation',
    kicker: 'Deep work',
    duration: '12 sessions · 6 months',
    format: 'Fortnightly · studio preferred',
    price: 38000,
    priceLabel: '₹38,000',
    priceNote: 'twelve sessions',
    featured: false,
    accent: 'pink',
    published: true,
    image: 'programTransformation',
    excerpt:
      'Six months of deep coaching for a genuine change of direction — work, identity, or the shape of an entire life.',
    summary:
      'This is for the seasons that do not respond to tidying. A career you have outgrown, an identity built for someone you no longer are, a life that works on paper and nowhere else. Twelve sessions gives us room to dismantle carefully and rebuild on purpose.',
    forWho: [
      'You are between two versions of your life',
      'Something significant is ending or beginning',
      'You want depth, not motivation',
    ],
    includes: [
      'Twelve 75-minute one-to-one sessions',
      'A full values and direction audit',
      'A written six-month roadmap, revised as we go',
      'Priority scheduling and direct-line support',
      'Two optional partner or family sessions',
      'A closing integration session at month six',
    ],
    outcomes: [
      'A direction you can defend to yourself',
      'The practical architecture to move toward it',
      'A steadier baseline that survives hard weeks',
    ],
  },
];
