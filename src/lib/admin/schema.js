/**
 * The single source of truth for the admin panel.
 *
 * Every editable thing on the site is declared here once; `/admin/edit/<key>`
 * renders the forms generically from these definitions and the save actions
 * validate against them. Adding a field to the site is a one-line change here
 * plus using it in the component — there is no per-section form to write.
 *
 * Field types understood by the renderer:
 *   text · textarea · richtext · number · boolean · image · select
 *   date · datetime
 *   list     — array of plain strings
 *   objects  — array of objects, `fields` describes one row
 *   group    — a nested object, `fields` describes it
 *   blocks   — the typed article body (lead / p / h2 / quote / list)
 *   sections — the custom-page builder, rows typed by SECTION_TYPES
 */

/* --------------------------------------------------------------- helpers */

const text = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });
const area = (name, label, extra = {}) => ({ name, label, type: 'textarea', rows: 3, ...extra });
const rich = (name, label, extra = {}) => ({
  name,
  label,
  type: 'richtext',
  hint: 'Wrap words in *asterisks* for the gradient. A new line breaks the heading.',
  ...extra,
});
const num = (name, label, extra = {}) => ({ name, label, type: 'number', ...extra });
const bool = (name, label, extra = {}) => ({ name, label, type: 'boolean', ...extra });
const image = (name, label, extra = {}) => ({ name, label, type: 'image', ...extra });
const list = (name, label, extra = {}) => ({ name, label, type: 'list', ...extra });
const objects = (name, label, fields, extra = {}) => ({
  name,
  label,
  type: 'objects',
  fields,
  ...extra,
});
const group = (name, label, fields, extra = {}) => ({
  name,
  label,
  type: 'group',
  fields,
  ...extra,
});

/** The `{ label, href }` pair used by every button on the site. */
const cta = (name, label) =>
  group(name, label, [text('label', 'Button text'), text('href', 'Links to')], {
    inline: true,
  });

/** eyebrow / title / lede — the header every section shares. */
const heading = ({
  eyebrow = 'eyebrow',
  title = 'title',
  lede = 'lede',
} = {}) => [
  text(eyebrow, 'Small label above'),
  rich(title, 'Heading'),
  area(lede, 'Intro paragraph'),
];

/* ---------------------------------------------------------------- brand */

const siteSection = {
  key: 'site',
  kind: 'single',
  group: 'Brand',
  label: 'Brand & Contact',
  icon: 'Building2',
  description: 'Name, contact details, address, socials and the main menu.',
  fields: [
    text('name', 'Brand name'),
    text('legalName', 'Legal / full name'),
    text('tagline', 'Tagline'),
    text('url', 'Website URL', {
      hint: 'Used for every canonical URL and the sitemap. No trailing slash.',
    }),
    area('description', 'Short description', {
      rows: 3,
      hint: 'Shown in the footer, and the fallback SEO description for any page that leaves its own blank.',
    }),
    text('email', 'Email'),
    text('phone', 'Phone (as displayed)'),
    text('phoneHref', 'Phone (dial format)', { hint: 'e.g. +919876543210' }),
    text('whatsapp', 'WhatsApp number', {
      hint: 'Digits only, with country code. Leave blank to hide.',
    }),
    text('founded', 'Year founded'),
    text('currencySymbol', 'Currency symbol'),
    text('currency', 'Currency code', { hint: 'e.g. INR — used in structured data.' }),
    group('coach', 'The coach', [
      text('name', 'Name'),
      text('role', 'Role'),
      text('credential', 'Credential'),
    ]),
    group('address', 'Address', [
      text('street', 'Street'),
      text('locality', 'City'),
      text('region', 'State'),
      text('postalCode', 'PIN code'),
      text('country', 'Country code'),
    ]),
    objects(
      'stats',
      'Headline numbers',
      [text('value', 'Number'), text('label', 'Label')],
      { addLabel: 'Add a number', titleField: 'label' }
    ),
    objects(
      'socials',
      'Social links',
      [
        text('label', 'Name'),
        text('href', 'URL'),
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          options: ['instagram', 'linkedin', 'youtube', 'facebook', 'twitter'],
        },
      ],
      { addLabel: 'Add a social link', titleField: 'label' }
    ),
    objects(
      'navLinks',
      'Main menu',
      [text('label', 'Menu text'), text('href', 'Links to')],
      {
        addLabel: 'Add a menu item',
        titleField: 'label',
        hint: 'A new page does not appear in the menu until you add it here.',
      }
    ),
  ],
};

const podcastSection = {
  key: 'podcast',
  kind: 'single',
  group: 'Brand',
  label: 'Podcast block',
  icon: 'Mic',
  description: 'The dark podcast band on the home page.',
  fields: [
    text('eyebrow', 'Small label above'),
    rich('title', 'Heading'),
    text('name', 'Podcast name'),
    text('tagline', 'Tagline'),
    area('description', 'Description', { rows: 3 }),
    text('href', 'Listen link'),
    text('ctaLabel', 'Button text'),
    image('image', 'Artwork'),
  ],
};

/* ------------------------------------------------------------- templates */

/**
 * What each page template lets you edit.
 *
 * The seven built-in templates match the hand-built routes; `custom` is the
 * page builder, and any page an editor creates on a new URL uses it. Changing
 * a page's template swaps which fields appear — the stored content for the old
 * template is left untouched, so switching back loses nothing.
 */
export const PAGE_TEMPLATES = {
  home: {
    label: 'Home page',
    description: 'The full home page, section by section.',
    builtIn: true,
    fields: [
      group('hero', 'Hero', [
        text('eyebrow', 'Small label above'),
        rich('title', 'Main heading'),
        area('lede', 'Intro paragraph', { rows: 4 }),
        cta('primaryCta', 'Primary button'),
        cta('secondaryCta', 'Secondary button'),
        text('ratingValue', 'Rating shown'),
        text('ratingLabel', 'Rating caption'),
        text('experienceLabel', 'Experience figure'),
        text('experienceNote', 'Experience caption'),
        text('badgeTitle', 'Floating badge title'),
        text('badgeNote', 'Floating badge subtitle'),
        area('quote', 'Pull quote beside the image'),
        text('scrollLabel', 'Scroll hint text'),
      ]),
      group('intro', 'Intro section', [
        ...heading(),
        list('body', 'Paragraphs'),
        text('linkLabel', 'Link text'),
        text('linkHref', 'Link target'),
      ]),
      group('transformation', 'Transformation areas header', heading()),
      group('aboutCoach', 'About the coach', [
        text('eyebrow', 'Small label above'),
        rich('title', 'Heading'),
        list('body', 'Paragraphs'),
        cta('primaryCta', 'Primary button'),
        cta('secondaryCta', 'Secondary button'),
        text('statValue', 'Floating stat'),
        text('statLabel', 'Floating stat caption'),
      ]),
      group('philosophy', 'Philosophy header', heading()),
      group('statement', 'Statement band', heading()),
      group('coachingAreas', 'Coaching areas header', heading()),
      group('programs', 'Programs header', [
        ...heading(),
        text('ctaLabel', 'Button text'),
        text('ctaHref', 'Button links to'),
      ]),
      group('events', 'Events header', [
        ...heading(),
        text('ctaLabel', 'Button text'),
        text('ctaHref', 'Button links to'),
        num('limit', 'How many to show'),
      ]),
      group('testimonials', 'Testimonials header', [
        text('eyebrow', 'Small label above'),
        rich('title', 'Heading'),
        text('ratingValue', 'Rating shown'),
        text('ratingLabel', 'Rating caption'),
        text('selectLabel', 'Story list label'),
      ]),
      group('pricing', 'Pricing band', heading()),
      group('guideCta', 'Free guide block', [
        text('eyebrow', 'Small label above'),
        rich('title', 'Heading'),
        text('guideName', 'Guide name'),
        area('lede', 'Intro paragraph'),
        text('coverLabel', 'Cover label'),
        text('coverTitle', 'Cover title'),
        text('buttonLabel', 'Button text'),
        text('placeholder', 'Email field placeholder'),
        text('note', 'Small print under the form'),
        list('chapters', 'What is inside the guide'),
      ]),
      group('blogPreview', 'Journal preview header', [
        ...heading(),
        text('ctaLabel', 'Button text'),
        text('ctaHref', 'Button links to'),
        num('limit', 'How many to show'),
      ]),
      group('finalCta', 'Closing call to action', [
        text('eyebrow', 'Small label above'),
        rich('title', 'Heading'),
        area('lede', 'Intro paragraph'),
        cta('primaryCta', 'Primary button'),
        cta('secondaryCta', 'Secondary button'),
      ]),
    ],
  },

  about: {
    label: 'About page',
    description: 'The story, the timeline and the beliefs list.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', {
        rows: 4,
        hint: 'Supports {{name}} and {{coachName}}.',
      }),
      cta('primaryCta', 'Primary button'),
      cta('secondaryCta', 'Secondary button'),
      text('studioName', 'Studio caption on the photo'),
      text('storyEyebrow', 'Story label'),
      rich('storyTitle', 'Story heading'),
      list('storyBody', 'Story paragraphs'),
      objects(
        'timeline',
        'Timeline',
        [text('year', 'Year'), text('title', 'Title'), area('text', 'Description')],
        { addLabel: 'Add a milestone', titleField: 'year' }
      ),
      text('beliefsEyebrow', 'Beliefs label'),
      rich('beliefsTitle', 'Beliefs heading'),
      area('beliefsLede', 'Beliefs intro'),
      list('beliefs', 'The beliefs'),
      text('approachEyebrow', 'Approach label'),
      rich('approachTitle', 'Approach heading'),
      area('approachLede', 'Approach intro'),
    ],
  },

  programs: {
    label: 'Programs listing',
    description: 'Headings and the step-by-step process on the programs page.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      cta('primaryCta', 'Primary button'),
      cta('secondaryCta', 'Secondary button'),
      text('processEyebrow', 'Process label'),
      rich('processTitle', 'Process heading'),
      area('processLede', 'Process intro'),
      objects(
        'process',
        'The steps',
        [text('number', 'Number'), text('title', 'Title'), area('text', 'Description')],
        { addLabel: 'Add a step', titleField: 'title' }
      ),
      text('subjectsEyebrow', 'Subjects label'),
      rich('subjectsTitle', 'Subjects heading'),
      area('subjectsLede', 'Subjects intro'),
      rich('ctaTitle', 'Closing heading'),
      area('ctaLede', 'Closing paragraph'),
    ],
  },

  events: {
    label: 'Events listing',
    description: 'Headings and empty-state copy on the events page.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      text('nextUpLabel', 'Badge on the featured event'),
      text('upcomingEyebrow', 'Calendar label'),
      rich('upcomingTitle', 'Calendar heading'),
      area('upcomingLede', 'Calendar intro'),
      text('emptyTitle', 'Shown when there are no events'),
      area('emptyLede', 'Empty-state paragraph'),
    ],
  },

  pricing: {
    label: 'Pricing page',
    description: 'Headings on the pricing page. Prices live on each program.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      text('plansEyebrow', 'Plans label'),
      rich('plansTitle', 'Plans heading'),
      area('plansLede', 'Plans intro'),
      text('faqEyebrow', 'FAQ label'),
      rich('faqTitle', 'FAQ heading'),
      area('faqLede', 'FAQ intro'),
    ],
  },

  blog: {
    label: 'Journal listing',
    description: 'Headings and empty-state copy on the journal page.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      text('featuredLabel', 'Featured badge'),
      text('allEyebrow', 'Archive label'),
      rich('allTitle', 'Archive heading'),
      text('emptyTitle', 'Shown when there are no articles'),
      area('emptyLede', 'Empty-state paragraph'),
    ],
  },

  contact: {
    label: 'Contact page',
    description: 'Headings, form labels and the thank-you message.',
    builtIn: true,
    fields: [
      text('eyebrow', 'Small label above'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      text('formTitle', 'Form heading'),
      area('formLede', 'Form intro'),
      text('successTitle', 'Thank-you heading', { hint: 'Supports {{firstName}}.' }),
      area('successLede', 'Thank-you paragraph'),
      text('detailsEyebrow', 'Contact details label'),
      rich('detailsTitle', 'Contact details heading'),
      text('responseNote', 'Response-time note'),
      text('hoursLabel', 'Opening hours label'),
      text('hours', 'Opening hours'),
    ],
  },

  legal: {
    label: 'Policy page',
    description:
      'A plain policy page. {{legalName}}, {{name}} and {{email}} fill in from your brand details.',
    builtIn: true,
    fields: [
      text('title', 'Page title'),
      text('eyebrow', 'Small label above'),
      text('updated', 'Last updated'),
      objects(
        'sections',
        'Sections',
        [text('heading', 'Heading'), list('body', 'Paragraphs')],
        { addLabel: 'Add a section', titleField: 'heading' }
      ),
    ],
  },

  custom: {
    label: 'Custom page',
    description:
      'Build the page from blocks. Use this for anything that is not one of the built-in pages.',
    builtIn: false,
    fields: [
      text('eyebrow', 'Small label above the heading'),
      rich('title', 'Page heading'),
      area('lede', 'Intro paragraph', { rows: 3 }),
      cta('primaryCta', 'Primary button'),
      cta('secondaryCta', 'Secondary button'),
    ],
  },
};

/**
 * The blocks a custom page is built from. Each entry describes one row of the
 * `sections` field: what it is called, and what it lets you fill in.
 */
export const SECTION_TYPES = {
  richText: {
    label: 'Text section',
    fields: [...heading(), list('body', 'Paragraphs')],
  },
  cards: {
    label: 'Card grid',
    fields: [
      ...heading(),
      objects(
        'items',
        'Cards',
        [text('title', 'Title'), area('text', 'Description')],
        { addLabel: 'Add a card', titleField: 'title' }
      ),
    ],
  },
  steps: {
    label: 'Numbered steps',
    fields: [
      ...heading(),
      objects(
        'items',
        'Steps',
        [text('number', 'Number'), text('title', 'Title'), area('text', 'Description')],
        { addLabel: 'Add a step', titleField: 'title' }
      ),
    ],
  },
  stats: {
    label: 'Headline numbers',
    fields: [
      ...heading(),
      objects(
        'items',
        'Numbers',
        [text('value', 'Number'), text('label', 'Label')],
        { addLabel: 'Add a number', titleField: 'label' }
      ),
    ],
  },
  faq: {
    label: 'Questions & answers',
    fields: [
      ...heading(),
      objects(
        'items',
        'Questions',
        [text('q', 'Question'), area('a', 'Answer', { rows: 4 })],
        { addLabel: 'Add a question', titleField: 'q' }
      ),
    ],
  },
  image: {
    label: 'Picture',
    fields: [image('image', 'Picture'), text('caption', 'Caption')],
  },
  cta: {
    label: 'Call to action',
    fields: [
      ...heading(),
      cta('primaryCta', 'Primary button'),
      cta('secondaryCta', 'Secondary button'),
    ],
  },
};

/** Fields every page carries, whatever its template. */
export const PAGE_META_FIELDS = [
  text('title', 'Browser & search title', {
    hint: 'Shown in the tab and as the blue link in Google. Around 60 characters.',
  }),
  area('description', 'Search description', {
    rows: 3,
    hint: 'The grey text under the link in Google. Around 155 characters. Left blank, your brand description is used.',
  }),
  list('keywords', 'Keywords'),
  image('ogImage', 'Social share image', {
    hint: 'Shown when the page is shared. Leave blank to use the generated brand card.',
  }),
  bool('indexFollow', 'Index, follow', {
    default: true,
    hint: 'On, this page is indexed and its links are followed. Turn it off and the page goes noindex, nofollow and drops out of the sitemap.',
  }),
];

export const PAGE_SETTINGS_FIELDS = [
  text('label', 'Page name', { hint: 'Only used in this admin panel.' }),
  text('path', 'URL', {
    hint: 'The address of the page, e.g. /coaching-for-teams. Changing it breaks existing links.',
  }),
  {
    name: 'template',
    label: 'Template',
    type: 'select',
    options: Object.keys(PAGE_TEMPLATES),
  },
  num('order', 'Order in the page list'),
  bool('published', 'Live on the site'),
];

const pagesSection = {
  key: 'page_tb',
  kind: 'pages',
  group: 'Pages',
  label: 'Pages',
  icon: 'FileText',
  description:
    'Every page on the site, listed by URL. Open one to edit its content, its search listing and its questions in one place.',
  addLabel: 'Add a page',
};

/* ---------------------------------------------------------- collections */

const programsSection = {
  key: 'programs',
  kind: 'collection',
  group: 'Content',
  label: 'Programs',
  icon: 'Sparkles',
  description: 'The coaching packages, their prices and what each includes.',
  titleField: 'title',
  subtitleField: 'priceLabel',
  idField: 'slug',
  addLabel: 'Add a program',
  defaults: {
    slug: 'new-program',
    title: 'New program',
    published: false,
    accent: 'primary',
    featured: false,
    order: 99,
  },
  fields: [
    text('title', 'Name'),
    text('slug', 'URL slug', {
      hint: 'Appears as /programs/<slug>. Changing it breaks old links.',
    }),
    num('order', 'Display order'),
    bool('published', 'Visible on the site'),
    bool('featured', 'Highlight this one'),
    bool('indexFollow', 'Index, follow', {
      default: true,
      hint: 'Off makes this program page noindex, nofollow and removes it from the sitemap.',
    }),
    text('index', 'Number shown on the card'),
    text('kicker', 'Badge text'),
    text('duration', 'Duration'),
    text('format', 'Format'),
    num('price', 'Price (number)', { hint: 'Used for structured data. Digits only.' }),
    text('priceLabel', 'Price (as displayed)'),
    text('priceNote', 'Price caption'),
    {
      name: 'accent',
      label: 'Accent colour',
      type: 'select',
      options: ['primary', 'sky', 'pink'],
    },
    image('image', 'Photo'),
    area('excerpt', 'Short summary', { rows: 3 }),
    area('summary', 'Full description', { rows: 6 }),
    list('forWho', 'Who it is for'),
    list('includes', 'What is included'),
    list('outcomes', 'What you leave with'),
  ],
};

const eventsSection = {
  key: 'events',
  kind: 'collection',
  group: 'Content',
  label: 'Events',
  icon: 'CalendarDays',
  description: 'Workshops, circles and retreats.',
  titleField: 'title',
  subtitleField: 'location',
  idField: 'slug',
  addLabel: 'Add an event',
  defaults: {
    slug: 'new-event',
    title: 'New event',
    published: false,
    attendanceMode: 'online',
    order: 99,
  },
  fields: [
    text('title', 'Name'),
    text('slug', 'URL slug'),
    num('order', 'Display order'),
    bool('published', 'Visible on the site'),
    {
      name: 'iso',
      label: 'Starts',
      type: 'datetime',
      hint: 'Drives the date chip, the sort order and the Google rich result.',
    },
    { name: 'endIso', label: 'Ends', type: 'datetime' },
    text('time', 'Time (as displayed)'),
    text('location', 'Location (short)'),
    text('locationDetail', 'Location (full)'),
    {
      name: 'attendanceMode',
      label: 'Online or in person',
      type: 'select',
      options: ['online', 'offline'],
    },
    text('price', 'Price (as displayed)', { hint: 'Write "Free" for a free event.' }),
    text('seats', 'Places available'),
    text('registerHref', 'Register link'),
    image('image', 'Photo'),
    area('excerpt', 'Description', { rows: 4 }),
  ],
};

const postsSection = {
  key: 'posts',
  kind: 'collection',
  group: 'Content',
  label: 'Journal',
  icon: 'Newspaper',
  description:
    'Articles. Bodies are built from typed blocks, so nothing can break the layout.',
  titleField: 'title',
  subtitleField: 'category',
  idField: 'slug',
  addLabel: 'Write an article',
  defaults: {
    slug: 'new-article',
    title: 'New article',
    category: 'Clarity',
    published: false,
    featured: false,
    readingTime: '5 min read',
    order: 99,
    body: [{ type: 'lead', text: '' }],
  },
  // Filled in with today's date when a new article is started. It is named
  // here rather than computed into `defaults` because a section object is
  // handed straight to a Client Component, and React refuses to serialise a
  // function across that boundary — the whole editor 500s. Data crosses it;
  // behaviour does not.
  todayFields: ['date'],
  fields: [
    text('title', 'Title'),
    text('slug', 'URL slug', { hint: 'Appears as /blog/<slug>.' }),
    num('order', 'Display order'),
    bool('published', 'Visible on the site'),
    bool('featured', 'Feature at the top of the journal'),
    text('category', 'Category'),
    bool('indexFollow', 'Index, follow', {
      default: true,
      hint: 'Off makes this article noindex, nofollow and removes it from the sitemap. It stays readable at its URL.',
    }),
    { name: 'date', label: 'Published on', type: 'date' },
    text('dateLabel', 'Date (as displayed)', {
      hint: 'Leave blank to write it out from the date above, e.g. 28 July 2026.',
    }),
    text('readingTime', 'Reading time'),
    image('image', 'Cover photo'),
    area('excerpt', 'Excerpt', { rows: 3 }),
    { name: 'body', label: 'Article', type: 'blocks' },
  ],
};

const testimonialsSection = {
  key: 'testimonials',
  kind: 'collection',
  group: 'Content',
  label: 'Testimonials',
  icon: 'Quote',
  description: 'Client stories shown on the home, programs and about pages.',
  titleField: 'name',
  subtitleField: 'program',
  addLabel: 'Add a testimonial',
  defaults: { published: true, rating: 5, order: 99 },
  fields: [
    text('name', 'Client name'),
    text('role', 'Role or job title'),
    text('program', 'Program taken'),
    text('initials', 'Initials'),
    num('rating', 'Rating out of 5'),
    num('order', 'Display order'),
    bool('published', 'Visible on the site'),
    area('quote', 'What they said', { rows: 5 }),
  ],
};

const transformationSection = {
  key: 'transformationAreas',
  kind: 'collection',
  group: 'Content',
  label: 'Transformation areas',
  icon: 'Compass',
  description: 'The four large image cards under "Where real change begins".',
  titleField: 'title',
  addLabel: 'Add an area',
  defaults: { order: 99, number: '05' },
  fields: [
    text('title', 'Title'),
    text('number', 'Number shown'),
    num('order', 'Display order'),
    area('description', 'Description'),
    image('image', 'Photo'),
    text('href', 'Links to'),
  ],
};

const coachingAreasSection = {
  key: 'coachingAreas',
  kind: 'collection',
  group: 'Content',
  label: 'Coaching subjects',
  icon: 'List',
  description: 'The line-by-line list of subjects covered.',
  titleField: 'title',
  subtitleField: 'note',
  addLabel: 'Add a subject',
  defaults: { order: 99 },
  fields: [
    text('title', 'Subject'),
    text('note', 'Short note'),
    num('order', 'Display order'),
  ],
};

const philosophySection = {
  key: 'philosophy',
  kind: 'collection',
  group: 'Content',
  label: 'Philosophy',
  icon: 'Feather',
  description: 'The numbered principles on the home and about pages.',
  titleField: 'title',
  addLabel: 'Add a principle',
  defaults: { order: 99, number: '05' },
  fields: [
    text('title', 'Principle'),
    text('number', 'Number shown'),
    num('order', 'Display order'),
    area('description', 'Description', { rows: 4 }),
  ],
};

const episodesSection = {
  key: 'episodes',
  kind: 'collection',
  group: 'Content',
  label: 'Podcast episodes',
  icon: 'Mic',
  description: 'The episodes listed in the podcast band.',
  titleField: 'title',
  subtitleField: 'guest',
  addLabel: 'Add an episode',
  defaults: { order: 99 },
  fields: [
    text('title', 'Episode title'),
    text('number', 'Episode number'),
    text('guest', 'Guest'),
    text('duration', 'Duration'),
    text('href', 'Listen link'),
    num('order', 'Display order'),
  ],
};

/* ------------------------------------------------------------- registry */

export const SECTIONS = {
  page_tb: pagesSection,
  site: siteSection,
  media: {
    key: 'media',
    kind: 'media',
    group: 'Brand',
    label: 'Images',
    icon: 'ImageIcon',
    description: 'Every photograph on the site, in one place. Upload to replace.',
  },
  podcast: podcastSection,
  programs: programsSection,
  events: eventsSection,
  posts: postsSection,
  testimonials: testimonialsSection,
  transformationAreas: transformationSection,
  coachingAreas: coachingAreasSection,
  philosophy: philosophySection,
  episodes: episodesSection,
  messages: {
    key: 'messages',
    kind: 'messages',
    group: 'Inbox',
    label: 'Messages',
    icon: 'Inbox',
    description: 'Everything sent through the contact form.',
  },
};

export const SECTION_GROUPS = ['Pages', 'Brand', 'Content', 'Inbox'];

export const sectionsInGroup = (name) =>
  Object.values(SECTIONS).filter((section) => section.group === name);

export const getSection = (key) => SECTIONS[key] ?? null;

export const getTemplate = (name) =>
  PAGE_TEMPLATES[name] ?? PAGE_TEMPLATES.custom;

/** Block types available in the article editor. */
export const BLOCK_TYPES = [
  { type: 'lead', label: 'Opening paragraph' },
  { type: 'p', label: 'Paragraph' },
  { type: 'h2', label: 'Subheading' },
  { type: 'quote', label: 'Pull quote' },
  { type: 'list', label: 'Bulleted list' },
];
