import { Props } from '@/typing';
import { ReactNode } from 'react';

export default function Box({
  children,
  title,
  icon,
  ...rest
}: Props & { title?: ReactNode; icon?: ReactNode }) {
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
      {title && (
        <h2 className="fw500 fs16 mb8">
          <span className="mr8">{icon}</span>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
