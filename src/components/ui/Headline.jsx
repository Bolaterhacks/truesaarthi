import { parseHeadline } from '@/lib/text';

/**
 * Renders a heading stored as plain text in Firestore.
 *
 * `*word*` picks up the brand gradient and a newline becomes a line break that
 * only applies once there is room for it — matching the hand-written headings
 * this replaced. Nothing here interprets HTML, so the worst an editor can do
 * is type a stray asterisk.
 */
export default function Headline({
  text,
  as: Tag = 'h2',
  className = '',
  breakOn = 'sm',
  ...rest
}) {
  const segments = parseHeadline(text);
  const breakClass = breakOn === 'always' ? '' : `hidden ${breakOn}:block`;

  return (
    <Tag className={className} {...rest}>
      {segments.map((segment, i) =>
        segment.br ? (
          <br key={i} className={breakClass} />
        ) : segment.grad ? (
          <span key={i} className="grad-text">
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </Tag>
  );
}

/** The same parsing without a wrapper element, for use inside another tag. */
export function HeadlineText({ text, breakOn = 'sm' }) {
  const segments = parseHeadline(text);
  const breakClass = breakOn === 'always' ? '' : `hidden ${breakOn}:block`;

  return segments.map((segment, i) =>
    segment.br ? (
      <br key={i} className={breakClass} />
    ) : segment.grad ? (
      <span key={i} className="grad-text">
        {segment.text}
      </span>
    ) : (
      <span key={i}>{segment.text}</span>
    )
  );
}
