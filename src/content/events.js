/**
 * Seeded into the `events` collection.
 *
 * `iso` drives the JSON-LD Event schema, the sort order and the rendered date
 * chip — `day`/`month` are derived from it on read, so an editor sets the date
 * once and the three can never drift apart.
 */
export const events = [
  {
    slug: 'mindset-reset-workshop',
    order: 1,
    iso: '2026-09-18T19:00:00+05:30',
    endIso: '2026-09-18T21:00:00+05:30',
    title: 'Mindset Reset Workshop',
    time: '7:00 PM',
    location: 'Online',
    locationDetail: 'Live on Zoom · replay for 30 days',
    price: 'Free',
    seats: '40 places',
    published: true,
    image: 'eventOnline',
    attendanceMode: 'online',
    registerHref: '/contact',
    excerpt:
      'Reset the patterns that keep you stuck. Two hours on the stories running underneath your decisions, and how to interrupt them.',
  },
  {
    slug: 'boundaries-in-practice',
    order: 2,
    iso: '2026-10-04T10:00:00+05:30',
    endIso: '2026-10-04T16:00:00+05:30',
    title: 'Boundaries In Practice',
    time: '10:00 AM',
    location: 'Bengaluru',
    locationDetail: 'Truesaarthi Studio · Indiranagar',
    price: '₹3,500',
    seats: '16 places',
    published: true,
    image: 'eventWorkshop',
    attendanceMode: 'offline',
    registerHref: '/contact',
    excerpt:
      'A working day on the boundaries you keep meaning to set. We write the sentences, rehearse them, and plan for the pushback.',
  },
  {
    slug: 'the-quiet-weekend-retreat',
    order: 3,
    iso: '2026-11-22T15:00:00+05:30',
    endIso: '2026-11-24T11:00:00+05:30',
    title: 'The Quiet Weekend',
    time: '3:00 PM',
    location: 'Coorg, Karnataka',
    locationDetail: 'Two nights · full board · twelve guests',
    price: '₹18,000',
    seats: '12 places',
    published: true,
    image: 'eventRetreat',
    attendanceMode: 'offline',
    registerHref: '/contact',
    excerpt:
      'Two nights away from the noise. Slow mornings, long walks, and three guided sessions on the direction you are quietly avoiding.',
  },
  {
    slug: 'career-crossroads-circle',
    order: 4,
    iso: '2026-12-09T18:30:00+05:30',
    endIso: '2026-12-09T20:30:00+05:30',
    title: 'Career Crossroads Circle',
    time: '6:30 PM',
    location: 'Online',
    locationDetail: 'Small group · eight people, cameras on',
    price: '₹1,200',
    seats: '8 places',
    published: true,
    image: 'eventCircle',
    attendanceMode: 'online',
    registerHref: '/contact',
    excerpt:
      'A small circle for people mid-decision about their work. You bring the fork in the road; the group brings better questions.',
  },
];
