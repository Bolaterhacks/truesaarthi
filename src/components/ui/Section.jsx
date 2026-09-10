const rhythm = {
  // Mobile 80–110px, desktop 120–180px, per the spacing system.
  default: 'py-20 sm:py-24 lg:py-[7.5rem] xl:py-[9rem]',
  loose: 'py-24 sm:py-28 lg:py-[9.5rem] xl:py-[11.25rem]',
  tight: 'py-16 sm:py-20 lg:py-24',
};

/**
 * Every section clips its own overflow so decorative blobs can bleed past the
 * grid without ever creating a horizontal scrollbar.
 */
export default function Section({
  as: Tag = 'section',
  rhythm: pace = 'default',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`relative isolate overflow-hidden ${rhythm[pace]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
