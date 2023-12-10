import { Props } from '@/typing';

export default function Box({ children, ...rest }: Props) {
  return (
    <section
      {...rest}
      style={{
        borderRadius: 12,
        boxShadow: '0 0 6px 1px lightgrey',
        backgroundColor: '#fefefe',
        ...rest.style,
      }}
    >
      {children}
    </section>
  );
}
