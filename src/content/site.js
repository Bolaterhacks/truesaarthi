/**
 * Brand, contact and identity. Seeded into `settings/site` and used as the
 * fallback whenever Firestore is unreachable or not yet seeded.
 *
 * Every value here is editable from /admin — treat these as placeholders.
 */
export const site = {
  name: 'Truesaarthi',
  legalName: 'Truesaarthi Coaching',
  tagline: 'Life & Leadership Coaching',
  // Swap for the production domain — every canonical URL and JSON-LD id
  // is derived from this one value.
  url: 'https://truesaarthi.com',
  description:
    'Private coaching for people who want a life that actually fits them. Clarity, confidence and direction — built one honest conversation at a time.',
  email: 'hello@truesaarthi.com',
  phone: '+91 98765 43210',
  phoneHref: '+919876543210',
  whatsapp: '919876543210',
  address: {
    street: '4th Floor, Indiranagar 100ft Road',
    locality: 'Bengaluru',
    region: 'KA',
    postalCode: '560038',
    country: 'IN',
  },
  currency: 'INR',
  currencySymbol: '₹',
  founded: '2016',
  coach: {
    name: 'Aarav Sharma',
    role: 'Certified Life & Leadership Coach',
    credential: 'ICF Associate Certified Coach (ACC)',
  },
  socials: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  ],
  stats: [
    { value: '9+', label: 'Years of practice' },
    { value: '600+', label: 'Clients guided' },
    { value: '3.2k', label: 'Sessions held' },
    { value: '4.9', label: 'Average rating' },
  ],
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Programs', href: '/programs' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
};
