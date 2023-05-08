import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { NavLink, Link } from 'react-router-dom';
import { Badge, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUnread } from 'features/notify/notifySlice';
import StartPick from 'features/picks/picks-modal.js'
import { faCalendarCheck, faCalendarTimes } from '@fortawesome/free-regular-svg-icons';

function Nav() {
  const [showPickModal, setShowPickModal] = useState(false)
  const notifsCount = useSelector(selectUnread).length;
  const {
    user: { screen_name },
  } = useSelector((state) => state.auth);
  const user_role = useSelector((state) => state.auth.user.role);


  const handleModal = () => {
    console.log('change bottom nav modal')
    setShowPickModal((currentValue) => !currentValue);
  }
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
    onClick: handleModal,
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
          <Button
          onClick={() => {
            handleModal()
          }}
          style={compose.style}
          className="position-absolute custom"
        >
          <FontAwesomeIcon className="" size="2x" icon={compose.icon} />
        </Button>
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
        <StartPick onClose={handleModal} show={showPickModal}/>
      </div>
    </>
  );
}

export default Nav;