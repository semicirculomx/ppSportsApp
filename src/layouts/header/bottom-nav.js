import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { NavLink, Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUnread } from 'features/notify/notifySlice';
import { faBars, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck, faCalendarTimes } from '@fortawesome/free-regular-svg-icons';
import SidebarNav from 'layouts/header/sidebar_nav';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const notifsCount = useSelector(selectUnread).length;
  const {
    user: { screen_name },
  } = useSelector((state) => state.auth);
  const user_role = useSelector((state) => state.auth.user.role);

  const list = [
    {
      name: 'Home',
      href: '/',
      icon: faHome,
    },
    {
      name: 'Partidos de valía',
      href: '/top-matches',
      icon: faCalendarCheck,
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: faSearch,
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: faBell,
      count: notifsCount,
    },
    {
      name: 'Profile',
      href: `/user/${screen_name}`,
      icon: faUser,
    },
  ];

  const compose = {
    name: 'Post',
    icon: faPlusCircle,
    href: '/empezar-pick',
    style: {
      right: '.5em',
      bottom: '4em',
      fontSize: '1.1em',
    },
  };

  return (
    <>
      <div className="fixed-bottom bg-color-dark d-flex justify-content-around">
     {(compose.name === 'Post' && user_role === 'tipster') &&
          <Link
          style={compose.style}
          to={compose.href}
          className="position-absolute"
        >
          <FontAwesomeIcon className="" size="2x" icon={compose.icon} />
        </Link>
         }
        {list.map((item) => {
          const vis = item.disabled ? 'disabled' : '';
          const badge =
            item.count !== undefined ? (
              <>
                <Badge
                  className="position-absolute"
                  variant="primary"
                  style={{ top: 6, right: 6, left: 'unset' }}
                >
                  {item.count}
                </Badge>
                <span className="sr-only">new items</span>
              </>
            ) : null;
          return (
            <div key={item.name} className="d-flex align-items-top position-relative">
              <NavLink
                key={item.name}
                to={item.href}
                onClick={item.onClick}
                activeClassName="active text-muted"
                className={`${vis} text-light p-3`}
              >
                <FontAwesomeIcon icon={item.icon} size="lg" />
              </NavLink>
              {badge}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Nav;