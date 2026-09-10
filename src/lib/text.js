/**
 * Content stored in Firestore is plain text — never HTML — so an editor can
 * never inject markup or break the typography. These two helpers are the whole
 * formatting vocabulary the admin panel exposes.
 */

/** Replace `{{token}}` placeholders from a values map. Unknown tokens vanish. */
export function interpolate(input, values = {}) {
  if (typeof input !== 'string') return input;
  return input.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    values[key] === undefined || values[key] === null ? '' : String(values[key])
  );
}

/**
 * Splits a heading into typed segments the renderer turns into elements:
 * `*word*` becomes a gradient run, a newline becomes a line break.
 *
 *   'Find your *balance*\nnow' →
 *   [{text:'Find your '}, {text:'balance', grad:true}, {br:true}, {text:'now'}]
 */
export function parseHeadline(input) {
  if (typeof input !== 'string' || !input) return [];

  const segments = [];

  input.split('\n').forEach((line, lineIndex) => {
    if (lineIndex > 0) segments.push({ br: true });

    // Odd indices are the contents of a matched *…* pair.
    line.split(/\*([^*]+)\*/g).forEach((part, i) => {
      if (!part) return;
      segments.push({ text: part, grad: i % 2 === 1 });
    });
  });

  return segments;
}

/** Strips the formatting markers — for <title>, meta tags and alt text. */
export const plainText = (input) =>
  typeof input === 'string' ? input.replace(/\*/g, '').replace(/\n/g, ' ') : '';

/**
 * `2026-07-28` → `28 July 2026`, the format the journal displays.
 *
 * Articles carry both a machine `date` (for the sitemap, the article schema
 * and `<time datetime>`) and a written `dateLabel`. The label is the one an
 * editor may want to phrase differently, so it stays editable — this is only
 * what fills it in when it is left blank.
 *
 * UTC throughout, so an article written late in the evening does not display
 * the previous day on a server in another timezone.
 */
export function longDate(iso) {
  // `new Date(null)` is the epoch, not an invalid date, so a null field would
  // otherwise be published as "1 January 1970".
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** `2026-09-18T19:00:00+05:30` → `{ day: '18', month: 'Sep', year: '2026' }` */
export function dateParts(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { day: '', month: '', year: '' };

  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }),
    year: String(date.getUTCFullYear()),
  };
}
