/**
 * Copy for every inner route, one document per page under `settings/`.
 *
 * Headings use the same convention as the home page: *asterisks* apply the
 * brand gradient, a newline forces a wide-screen line break. `{{legalName}}`
 * and `{{name}}` interpolate from the brand document so a rename in one place
 * flows through the policy pages.
 */

export const aboutPage = {
  eyebrow: 'Meet your coach',
  title: 'Coaching that begins\nwith *listening.*',
  lede: 'I am {{coachName}}, founder of {{name}}. I spent eleven years studying why good people get stuck in good jobs, and the last decade helping them get unstuck — one honest hour at a time.',
  primaryCta: { label: 'Book a Discovery Call', href: '/contact' },
  secondaryCta: { label: 'See how we work', href: '/programs' },
  studioName: 'The Truesaarthi Studio',
  storyEyebrow: 'The story',
  storyTitle: 'I did not set out to be\na *life coach.*',
  storyBody: [
    'For most of my twenties I worked in organisational psychology, which mostly meant designing systems to make large groups of people slightly more effective. I was good at it. I found it almost entirely hollow.',
    'The part that mattered always happened afterwards. Someone would stay behind, close the laptop, and say the real thing — that they had not wanted this job for three years, that they had stopped sleeping, that they could not remember choosing any of it. Twenty minutes of that did more than six months of process design.',
    'So I built a practice around those twenty minutes. No frameworks to sell, no certification ladder to climb, no promise that your life will look like mine. Just a room, a reliable hour, and someone paying close enough attention to notice what you keep walking around.',
    'Nine years later I have had roughly three thousand of those hours. I still find them the most interesting thing I do.',
  ],
  timeline: [
    {
      year: '2011',
      title: 'Organisational psychology',
      text: 'Six years inside large companies, watching capable people become quietly miserable in well-designed roles.',
    },
    {
      year: '2016',
      title: 'Private practice',
      text: 'Left to build a practice around the part of the job that actually helped: the unhurried conversation nobody had budgeted for.',
    },
    {
      year: '2020',
      title: 'ICF accreditation',
      text: 'Certified at ACC level, and started supervising other coaches — which changed how I hear my own questions.',
    },
    {
      year: '2024',
      title: 'The Truesaarthi Studio',
      text: 'Opened a permanent studio in Indiranagar, and began running small retreats twice a year.',
    },
  ],
  beliefsEyebrow: 'What I believe',
  beliefsTitle: 'Six things I would\nsay on day *one*',
  beliefsLede:
    'If you disagree with most of these, we probably are not the right fit — and that is genuinely useful to know before you book.',
  beliefs: [
    'You are not a project to be optimised.',
    'Most stuckness is a decision wearing a disguise.',
    'Advice is cheap; attention is not.',
    'Rest is infrastructure, not a reward.',
    'Small kept promises beat large broken ones.',
    'The goal is a life you want to be inside.',
  ],
  approachEyebrow: 'How I work',
  approachTitle: 'Four principles, held\nfairly *strictly*',
  approachLede:
    'They are not a method. They are the conditions under which this work is honest enough to be worth your money.',
};

export const programsPage = {
  eyebrow: 'Programs',
  title: 'Coaching for\n*real life*',
  lede: 'Three ways in, sized by how much room you have right now. You can move between them, and nobody has ever been talked into the expensive one.',
  primaryCta: { label: 'Book a Discovery Call', href: '/contact' },
  secondaryCta: { label: 'Compare pricing', href: '/pricing' },
  processEyebrow: 'How it works',
  processTitle: 'What actually happens,\nstep by *step*',
  processLede:
    'No mystery, no proprietary method. Here is the whole shape of it before you spend anything.',
  process: [
    {
      number: '01',
      title: 'A free half hour',
      text: 'We talk about what is going on. No forms, no assessment. By the end you will know whether you want to keep going.',
    },
    {
      number: '02',
      title: 'The first session',
      text: 'We find the real problem — often not the one you booked with — and agree what would count as progress.',
    },
    {
      number: '03',
      title: 'The work itself',
      text: 'Fortnightly conversations with small, specific practices in between. I keep notes so you do not have to.',
    },
    {
      number: '04',
      title: 'Closing properly',
      text: 'Every program ends with a review session. Coaching that never finishes is a subscription, not a service.',
    },
  ],
  subjectsEyebrow: 'Subjects',
  subjectsTitle: 'What we tend to\ntalk *about*',
  subjectsLede:
    'Whichever program you choose, these are the territories the work moves through.',
  ctaTitle: 'Still not sure which\none is right?',
  ctaLede:
    'Book the free half hour and we will work it out together. Most people arrive thinking they need the long program and leave booking a single session.',
};

export const eventsPage = {
  eyebrow: 'What’s coming up',
  title: 'Workshops, conversations\n& *retreats*',
  lede: 'Small by design. A workshop with forty people is a lecture; one with twelve is a conversation, and only one of those changes anything.',
  nextUpLabel: 'Next up',
  upcomingEyebrow: 'The calendar',
  upcomingTitle: 'Everything else\ncoming *up*',
  upcomingLede:
    'Dates are fixed and places are capped. When something sells out it stays listed so you can see the rhythm of the year.',
  emptyTitle: 'Nothing on the calendar right now.',
  emptyLede:
    'The next season is being planned. Leave your email on the contact page and you will hear first.',
};

export const blogPage = {
  eyebrow: 'The journal',
  title: 'Notes on clarity,\nchange & *balance*',
  lede: 'Essays I write between sessions, usually because the same conversation has come up three times in a fortnight. No listicles, no productivity hacks.',
  featuredLabel: 'Featured',
  allEyebrow: 'All articles',
  allTitle: 'The full *archive*',
  emptyTitle: 'No articles published yet.',
  emptyLede: 'The first one is being written. Check back shortly.',
};

export const pricingPage = {
  eyebrow: 'Pricing',
  title: 'Simple, *honest* pricing',
  lede: 'Everything is listed. There is no discovery-call upsell, no premium tier I mention only if you seem wealthy, and no package that exists to make another one look reasonable.',
  plansEyebrow: 'The programs',
  plansTitle: 'Three programs,\nthree *commitments*',
  plansLede:
    'Pick by how much room you have, not by how serious you want to seem. Most people start in the middle.',
  faqEyebrow: 'Questions',
  faqTitle: 'The things people\nask *first*',
  faqLede:
    'If yours is not here, email me. I answer these myself and usually within a day.',
};

export const faqs = [
  {
    id: 'commit',
    order: 1,
    q: 'Do I have to commit to a package?',
    a: 'No. Plenty of people book a single Clarity Session and never book another, which is a perfectly good outcome. You can also start with one and roll the fee into a longer program within thirty days.',
  },
  {
    id: 'free-call',
    order: 2,
    q: 'What happens on the free call?',
    a: 'Thirty minutes, no charge, no sales script. You describe what is going on; I ask a few questions. At the end I tell you honestly whether I think coaching helps here, and sometimes the answer is no.',
  },
  {
    id: 'sliding-scale',
    order: 3,
    q: 'Is there a sliding scale?',
    a: 'Yes. Two places on every program are held at a reduced rate for people for whom the full fee would be the reason not to come. Ask. There is no form and no means-testing.',
  },
  {
    id: 'cancellation',
    order: 4,
    q: 'What is your cancellation policy?',
    a: 'Reschedule freely up to 24 hours before. Inside 24 hours the session is charged, with the obvious exceptions — illness, emergencies, the things that actually happen to people.',
  },
  {
    id: 'outside-india',
    order: 5,
    q: 'Do you work with people outside India?',
    a: 'Regularly. Roughly a third of my clients are in the Gulf, Europe or North America. Sessions run on video and I hold early-morning and late-evening slots specifically for time zones.',
  },
  {
    id: 'is-this-therapy',
    order: 6,
    q: 'Is this therapy?',
    a: 'No, and the distinction matters. Coaching works forward from where you are; therapy works with what happened. If something surfaces that belongs with a therapist, I will say so and help you find one.',
  },
];

export const contactPage = {
  eyebrow: 'Get in touch',
  title: 'Let’s start with\na *conversation.*',
  lede: 'Tell me roughly what is going on. You do not need it worked out — that is the job. I read and answer every message myself.',
  formTitle: 'Send a message',
  formLede:
    'The more specific you are, the more useful my reply will be. Two honest sentences beat a polished paragraph.',
  successTitle: 'Thank you, {{firstName}}.',
  successLede:
    'Your message is with me. I answer these myself, usually within one working day — and always within two.',
  detailsEyebrow: 'Other ways',
  detailsTitle: 'Or reach me\n*directly*',
  responseNote: 'I reply to everything within two working days.',
  hoursLabel: 'Studio hours',
  hours: 'Mon–Fri · 9:00 AM – 6:00 PM IST',
};

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    updated: '1 September 2026',
    sections: [
      {
        heading: 'What this covers',
        body: [
          'This policy explains what {{legalName}} does with information you give us through this website, by email, or during coaching sessions. It applies to every page on this site.',
        ],
      },
      {
        heading: 'What we collect',
        body: [
          'When you send a message or request the free guide, we collect your name, email address and whatever you choose to write. Nothing on this site requires an account, and we do not ask for payment details through the website.',
          'Our host records standard server logs — IP address, browser type, pages requested — for security and diagnostics. These are kept for thirty days.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To reply to you, to run sessions you have booked, and to send the guide if you asked for it. We do not add you to a marketing list without you choosing it, and every email we send has a working unsubscribe link.',
          'We do not sell, rent or trade personal information. Ever, and not to anyone.',
        ],
      },
      {
        heading: 'Session confidentiality',
        body: [
          'Everything discussed in a coaching session is confidential. Session notes are stored encrypted and are never shared. The only exceptions are the legal ones: a credible risk of serious harm to you or someone else, or a court order.',
          'Coaching is not a legally privileged relationship in the way therapy or legal advice can be. That distinction matters and you should know it before you start.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        body: [
          'This site sets no advertising or tracking cookies. Fonts are served from Google Fonts by the framework at build time, so no request leaves for a third-party font service when you load a page.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can ask what we hold about you, ask for it to be corrected, or ask for it to be deleted. Write to us and we will act within thirty days. If you are in the EEA or UK, the GDPR rights of access, rectification, erasure, restriction, portability and objection all apply. If you are in India, the Digital Personal Data Protection Act 2023 gives you equivalent rights.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about this policy go to {{email}}. We answer them ourselves.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Legal',
    updated: '1 September 2026',
    sections: [
      {
        heading: 'Who we are',
        body: [
          'This site is operated by {{legalName}}. Using it, booking a session or buying a program means you accept these terms.',
        ],
      },
      {
        heading: 'What coaching is and is not',
        body: [
          'Coaching is a forward-looking, collaborative conversation. It is not therapy, medical advice, legal advice or financial advice, and it does not diagnose or treat any condition. If you are in crisis, please contact a qualified clinician or an emergency service.',
          'You remain responsible for your own decisions and their outcomes. Nothing said in a session is a guarantee of any particular result.',
        ],
      },
      {
        heading: 'Booking and payment',
        body: [
          'Sessions are confirmed once payment is received. Program fees may be paid in full or in instalments agreed in writing before the first session. All prices are in Indian rupees and include applicable taxes unless stated otherwise.',
        ],
      },
      {
        heading: 'Cancellation and rescheduling',
        body: [
          'You may reschedule any session free of charge up to 24 hours beforehand. Sessions cancelled inside 24 hours are charged in full, except in cases of illness or emergency, which we handle case by case and generously.',
          'Unused sessions in a program expire twelve months after the first session.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'If after your first session of a multi-session program you decide it is not for you, tell us within seven days and we will refund the balance of the unused sessions in full. After that point, fees for booked sessions are non-refundable.',
        ],
      },
      {
        heading: 'Confidentiality',
        body: [
          'We hold everything you share in confidence, subject to the exceptions set out in the Privacy Policy. We ask the same of you regarding anything shared by other participants in a group workshop or retreat.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'Worksheets, guides and written materials remain the property of {{legalName}} and are licensed to you for your own personal use. Please do not redistribute or resell them.',
        ],
      },
      {
        heading: 'Changes to these terms',
        body: [
          'We may update these terms. The version in force is the one published here on the date you book. Material changes will be noted with a revised "last updated" date at the top of this page.',
        ],
      },
    ],
  },
};
