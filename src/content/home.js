/**
 * Every string on the home page, section by section. Seeded into
 * `settings/home` and fully editable from /admin.
 *
 * Heading convention: wrap words in *asterisks* to give them the brand
 * gradient, and use a newline to force a line break on wide screens.
 * `<Headline>` is the only thing that understands this — no HTML is ever
 * injected, so an editor cannot break the page or the typography.
 */
export const home = {
  hero: {
    eyebrow: 'Personal Growth · Clarity · Life Coaching',
    title: 'Find your direction.\n*Reclaim* your life.',
    lede: 'Truesaarthi is a private coaching practice for people who are doing well on paper and quietly stuck underneath it. We start by listening — not by handing you advice.',
    primaryCta: { label: 'Book Your Session', href: '/contact' },
    secondaryCta: { label: 'Explore Programs', href: '/programs' },
    ratingValue: '4.9',
    ratingLabel: 'from 600+ clients',
    experienceLabel: '9+ years',
    experienceNote: 'of practice',
    badgeTitle: 'Certified Life Coach',
    badgeNote: 'ICF · ACC accredited',
    quote: 'A saarthi does not drive your chariot for you. They make sure you can see the road.',
    scrollLabel: 'Scroll to explore',
  },

  intro: {
    eyebrow: 'About the journey',
    title: 'You don’t need a new life.\nYou need one that *feels like yours.*',
    body: [
      'Most people who come to Truesaarthi are not in crisis. They are capable, busy and quietly exhausted by a life that looks correct from the outside and feels borrowed from the inside.',
      'We do not start with goals. We start with the truth — then build something around it that you can actually live in.',
    ],
    linkLabel: 'Read the full story',
    linkHref: '/about',
  },

  transformation: {
    eyebrow: 'The work',
    title: 'Where real change *begins*',
    lede: 'Four places we tend to start. Most people arrive certain it is one of them and discover, two sessions in, that it was quietly another.',
  },

  aboutCoach: {
    eyebrow: 'Meet your coach',
    title: 'Coaching that begins with *listening.*',
    body: [
      'I spent eleven years in organisational psychology before I realised the most useful thing I did all week was the twenty minutes at the end of a meeting when someone finally said what they meant. So I built a practice around that.',
      'I am not a motivational coach. There are no scripts, no morning routines to adopt, no belief you must hold about the universe. What I offer is close attention, uncomfortable questions asked kindly, and a decade of pattern recognition about why capable people get stuck.',
    ],
    primaryCta: { label: 'More About Me', href: '/about' },
    secondaryCta: { label: 'Book a Discovery Call', href: '/contact' },
    statValue: '9+',
    statLabel: 'Years of\nexperience',
  },

  philosophy: {
    eyebrow: 'How I work',
    title: 'My coaching *philosophy*',
    lede: 'Four principles that shape every session. They are not aspirations — if I break one of them, the work stops being useful.',
  },

  statement: {
    eyebrow: 'Why this matters',
    title: 'Your growth *matters.*\nYour story *matters.*\nYour future starts now.',
    lede: 'Not next quarter. Not when things calm down. The version of you that waits for the right moment has been waiting a while now.',
  },

  coachingAreas: {
    eyebrow: 'What we work on',
    title: 'Eight conversations,\none honest *direction*',
    lede: 'These are the subjects that come up most. In practice they are rarely separate — pull on one and the others move.',
  },

  programs: {
    eyebrow: 'Programs',
    title: 'Coaching for *real life*',
    lede: 'Three ways in, depending on how much room you have. Start small if you are unsure — most people do, and most of them stay.',
    ctaLabel: 'See all programs',
    ctaHref: '/programs',
  },

  events: {
    eyebrow: 'What’s coming up',
    title: 'Workshops, conversations\n& *retreats*',
    lede: 'Small by design. Nothing here holds more than forty people, and most hold twelve.',
    ctaLabel: 'All events',
    ctaHref: '/events',
    limit: 3,
  },

  testimonials: {
    eyebrow: 'Client stories',
    title: 'Stories of *transformation*',
    ratingValue: '4.9',
    ratingLabel: 'Trusted by 600+ clients',
    selectLabel: 'Select a story',
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Simple, *honest* pricing',
    lede: 'No packages you have to be talked into, no discovery-call upsell. The price you see is the price, and the first conversation is free.',
  },

  guideCta: {
    eyebrow: 'Free guide',
    title: 'Start your growth *today*',
    guideName: '7 Steps to Reclaim Balance in Your Life',
    lede: 'A short, practical read you can finish in one sitting and act on the same week.',
    coverLabel: 'The free guide',
    coverTitle: '7 Steps to Reclaim Balance',
    buttonLabel: 'Get the Guide',
    placeholder: 'you@example.com',
    note: 'One email. No sequence, no upsell. Unsubscribe any time.',
    chapters: [
      'Name the thing you are actually tired of',
      'Audit where the week really goes',
      'Reclaim three protected hours',
      'Say one honest no',
      'Rebuild a morning you chose',
      'Set a boundary that holds',
      'Decide what next quarter is for',
    ],
  },

  blogPreview: {
    eyebrow: 'The journal',
    title: 'Reading room',
    lede: 'Essays on clarity, boundaries and the ordinary mechanics of change.',
    ctaLabel: 'Read the journal',
    ctaHref: '/blog',
    limit: 3,
  },

  finalCta: {
    eyebrow: 'Let’s begin',
    title: 'Your life doesn’t have\nto feel overwhelming.',
    lede: 'You deserve clarity, balance, and a life aligned with who you are. The first conversation is thirty minutes, free, and costs you nothing but honesty.',
    primaryCta: { label: 'Book A Discovery Call', href: '/contact' },
    secondaryCta: { label: 'Explore Programs', href: '/programs' },
  },
};
