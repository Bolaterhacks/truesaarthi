/**
 * Brand marks were dropped from lucide v1, so the three we need are inlined
 * here rather than pulling in a second icon package.
 */
const paths = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <path d="M4.6 9.4v10M4.6 5.2v.02" />
      <path d="M10 19.4v-10M10 13.2c0-2 1.4-3.4 3.2-3.4s3.2 1.2 3.2 3.6v6" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4.5" />
      <path d="M10.2 9.3v5.4l4.6-2.7z" />
    </>
  ),
};

export default function SocialIcon({ name, className = 'size-[18px]' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
