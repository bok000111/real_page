import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/reducers';
import { setUser } from '@/reducers/authReducer';

export default function NavBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('NavBar rerendered');
  });

  return (
    <nav className='navbar navbar-light'>
      <div className='container'>
        <Link className='navbar-brand' href='/'>
          conduit
        </Link>
      </div>
      <NavList user={user} />
    </nav>
  );
}

function NavList({ user }: { user?: {} }) {
  useEffect(() => {
    console.log('NavList rerendered');
  });
  if (user !== undefined) {
    return <NavListLogin />;
  } else {
    return <NavListGuest />;
  }
}

function NavListLogin() {
  useEffect(() => {
    console.log('NavListLogin rerendered');
  });
  const pathname = usePathname();
  return (
    <ul className='nav navbar-nav pull-xs-right'>
      <NavItem item='Home' href='/' current={pathname} />
      <NavItemEditor current={pathname} />
      <NavItemSettings current={pathname} />
      {/* <NavItem item='Logout' href='/logout' current={pathname} /> */}
    </ul>
  );
}

function NavListGuest() {
  useEffect(() => {
    console.log('NavListGuest rerendered');
  });
  const pathname = usePathname();
  return (
    <ul className='nav navbar-nav pull-xs-right'>
      <NavItem item='Home' href='/' current={pathname} />
      {/* <NavItemEditor current={pathname} /> */}
      {/* <NavItemSettings current={pathname} /> */}
      <NavItem item='Sign in' href='/login' current={pathname} />
      <NavItem item='Sign up' href='/register' current={pathname} />
    </ul>
  );
}

function NavItem({
  item,
  href,
  current,
}: {
  item: string;
  href: string;
  current: string;
}) {
  useEffect(() => {
    console.log('NavItem rerendered');
  });
  let className = 'nav-link';
  if (current === href) {
    className = 'nav-link active';
  }
  return (
    <li className='nav-item'>
      <Link className={className} href={href}>
        {item}
      </Link>
    </li>
  );
}

function NavItemEditor({ current }: { current: string }) {
  useEffect(() => {
    console.log('NavItemEditor rerendered');
  });
  let className = 'nav-link';
  if (current === '/editor') {
    className = 'nav-link active';
  }
  return (
    <li className='nav-item'>
      <Link className={className} href='/editor'>
        {' '}
        <i className='ion-compose'></i>&nbsp;New Article{' '}
      </Link>
    </li>
  );
}

function NavItemSettings({ current }: { current: string }) {
  useEffect(() => {
    console.log('NavItemSettings rerendered');
  });
  let className = 'nav-link';
  if (current === '/settings') {
    className = 'nav-link active';
  }
  return (
    <li className='nav-item'>
      <Link className={className} href='/settings'>
        {' '}
        <i className='ion-gear-a'></i>&nbsp;Settings{' '}
      </Link>
    </li>
  );
}
