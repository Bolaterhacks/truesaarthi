const widths = {
  default: 'max-w-[1320px]',
  wide: 'max-w-[1560px]',
  narrow: 'max-w-[880px]',
};

export default function Container({
  as: Tag = 'div',
  size = 'default',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`mx-auto w-full ${widths[size]} px-6 sm:px-8 lg:px-12 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
