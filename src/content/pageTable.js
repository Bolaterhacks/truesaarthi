import { home } from './home';
import {
  aboutPage,
  blogPage,
  contactPage,
  eventsPage,
  faqs,
  legal,
  pricingPage,
  programsPage,
} from './pages';

/**
 * Every page on the site, as one row per URL — seeded into `page_tb`.
 *
 * A page owns three things at once, which is the whole point of keeping them
 * in a single document: its **meta** (what search engines and social cards
 * see), its **content** (what the template renders), and its **faqs** (which
 * also feed Google's FAQ rich result on the pages that have them).
 *
 * `template` picks the renderer. The seven built-in templates map to the
 * hand-built routes; `custom` is the page builder, and any row an editor adds
 * with a new path is served by the catch-all route from its `sections`.
 *
 * Content bodies are imported rather than re-typed so this file stays a
 * manifest — the prose still lives in home.js and pages.js.
 */
export const pageTable = [
  {
    path: '/',
    label: 'Home',
    template: 'home',
    order: 1,
    published: true,
    meta: {
      title: 'Truesaarthi — Life & Leadership Coaching',
      description:
        'Private coaching for people who want a life that actually fits them. Clarity, confidence and direction — built one honest conversation at a time.',
      keywords: [
        'life coach',
        'life coaching India',
        'leadership coaching',
        'career coaching',
        'personal development',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: home,
    faqs: [],
  },

  {
    path: '/about',
    label: 'About',
    template: 'about',
    order: 2,
    published: true,
    meta: {
      title: 'About',
      description:
        'Nine years of private practice, eleven before that in organisational psychology, and a way of working that starts with listening rather than advice.',
      keywords: [
        'about the coach',
        'certified life coach',
        'ICF ACC coach',
        'coaching philosophy',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: aboutPage,
    faqs: [],
  },

  {
    path: '/programs',
    label: 'Programs',
    template: 'programs',
    order: 3,
    published: true,
    meta: {
      title: 'Coaching Programs',
      description:
        'Three coaching programs: a single Clarity Session, a three-month Personal Growth arc, and a six-month Life Transformation. Online or in studio.',
      keywords: [
        'coaching programs',
        'one to one coaching',
        'clarity session',
        'personal growth coaching',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: programsPage,
    faqs: [],
  },

  {
    path: '/events',
    label: 'Events',
    template: 'events',
    order: 4,
    published: true,
    meta: {
      title: 'Workshops, Conversations & Retreats',
      description:
        'Upcoming coaching workshops, small-group circles and weekend retreats — online and in Bengaluru. Nothing here holds more than forty people.',
      keywords: [
        'coaching workshops',
        'life coaching retreat',
        'group coaching',
        'mindset workshop',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: eventsPage,
    faqs: [],
  },

  {
    path: '/pricing',
    label: 'Pricing',
    template: 'pricing',
    order: 5,
    published: true,
    meta: {
      title: 'Pricing',
      description:
        'Coaching prices in full and without an upsell. Every program is listed with what it includes, and the first conversation is free.',
      keywords: [
        'life coaching price',
        'coaching fees India',
        'coaching packages',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: pricingPage,
    // FAQs live on the page that shows them, so one screen edits the copy and
    // the questions together — and the rich result stays in sync with both.
    faqs,
  },

  {
    path: '/blog',
    label: 'Journal',
    template: 'blog',
    order: 6,
    published: true,
    meta: {
      title: 'Journal',
      description:
        'Short essays on clarity, boundaries, rest, confidence and career change — the things that come up in almost every coaching session.',
      keywords: [
        'life coaching blog',
        'personal growth essays',
        'clarity',
        'boundaries',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: blogPage,
    faqs: [],
  },

  {
    path: '/contact',
    label: 'Contact',
    template: 'contact',
    order: 7,
    published: true,
    meta: {
      title: 'Book a Session',
      description:
        'Book a free 30-minute discovery call, or ask a question. Sessions run online worldwide and in studio in Bengaluru.',
      keywords: [
        'book a life coach',
        'discovery call',
        'contact coach',
        'coaching consultation',
      ],
      ogImage: '',
      indexFollow: true,
    },
    content: contactPage,
    faqs: [],
  },

  {
    path: '/privacy',
    label: 'Privacy Policy',
    template: 'legal',
    order: 8,
    published: true,
    meta: {
      title: 'Privacy Policy',
      description:
        'How Truesaarthi collects, uses and protects your personal information.',
      keywords: [],
      ogImage: '',
      indexFollow: true,
    },
    content: legal.privacy,
    faqs: [],
  },

  {
    path: '/terms',
    label: 'Terms of Service',
    template: 'legal',
    order: 9,
    published: true,
    meta: {
      title: 'Terms of Service',
      description:
        'The terms that apply to coaching sessions, programs and events booked with Truesaarthi.',
      keywords: [],
      ogImage: '',
      indexFollow: true,
    },
    content: legal.terms,
    faqs: [],
  },
];
