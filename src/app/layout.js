import { DM_Serif_Display, Manrope } from 'next/font/google';
import './globals.css';

const display = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport = {
  themeColor: '#fcfbff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

/**
 * The root layout is deliberately bare: it owns the document, the fonts and
 * the stylesheet, and nothing else.
 *
 * The public site's header, footer and JSON-LD live in `(site)/layout.js` and
 * the admin chrome lives in `(admin)/layout.js`, so the two never inherit each
 * other's shell — `/admin` is not a marketing page and should not carry one.
 */
export default function RootLayout({ children }) {
  return (
    // data-scroll-behavior tells Next 16 to suppress smooth scrolling during
    // route transitions while keeping it for in-page anchors.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
