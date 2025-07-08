declare module '@docusaurus/Link' {
  import * as React from 'react';
  interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    className?: string;
    children?: React.ReactNode;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
} 