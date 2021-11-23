import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconProps } from '@material-ui/core';

interface RouterLinkProps {
  children?: IconProps;
  href?: string;
  className?: string;
  tabIndex?: number;
  testId?: string;
  materialIcon?: IconProps;
}

const RouterLink = (props: RouterLinkProps) => {
  const router = useRouter();
  const activeClass = 'router-link-exact-active';
  const activeClasses = props.className ? `${props.className} ${activeClass}` : activeClass;

  return (
    <Link href={props.href}>
      <span className="d-inline-flex align-items-center router-link">
        <a
          className={router.asPath === props.href ? activeClasses : props.className}
          tabIndex={props.tabIndex}
          data-testid={props.testId}>
          {props.children}
        </a>
      </span>
    </Link>
  );
};

export default RouterLink;
