import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser'

import { NavLink, Link } from 'react-router-dom'
import { Badge } from 'react-bootstrap'

import { useSelector } from 'react-redux'
import { selectUnread } from 'features/notify/notifySlice'

import {ReactComponent as Cancel} from '../../assets/icons/cancel.svg'



function SidebarNav({isOpen, closeModal}) {
  let notifsCount = useSelector(selectUnread).length
    let { user: { screen_name } } = useSelector(state => state.auth)
    let list = [
        {
            name: "Partidos del día",
            href: "/home",
            icon: faHome
        },
        {
            name: "Picks",
            href: "/explore",
            icon: faSearch
        },
        {
            name: "Análisis",
            href: "/notifications",
            icon: faBell,
            count: notifsCount
        },
        {
            name: "Expertos",
            href: `/user/${screen_name}`,
            icon: faUser,
        }
    ]

  const renderSidebar = () => {
    return (
      <div className={`sidebar-modal ${isOpen ? 'w-100' : 'w-0'}`}>
        <div className={`sidebar ${isOpen ? 'sidebar__show' : 'sidebar__no-show'}`}>
          <div className="sidebar__main">
            <div className="sidebar__main-top">
              <div className="sidebar__main-top-action">
                <Cancel onClick={() => closeModal()} />
              </div>
              {/* <div className="sidebar__main-top-buttons d-flex justify-content-between">
                <div className="button-link">
                  <Football />
                  <span>Picks</span>
                </div>
                <div className="button-link">
                  <Statistics />
                  <span>Stats</span>
                </div>
                <div className="button-link">
                  <Moneybag />
                  <span>Resultados</span>
                </div>
              </div> */}
            </div>
            <div className="sidebar__main-bottom">
            {list.map(item => {
                let vis = item.disabled ? 'disabled' : ''
                let badge = item.count ? <>
                <Badge className="position-absolute" variant="primary" style={{ top: 6, right: 6, left: 'unset' }}>
                  {item.count}</Badge><span className="sr-only">
                    new items
                    </span>
                    </> : null
                return (

                <div key={item.name} className="">
                    <NavLink
                        key={item.name}
                        to={item.href}
                        activeClassName="active"
                        className={`${vis} font-weight-bold btn btn-naked-primary rounded-pill p-3`}
                    >
                        {item.name}
                        {/* <FontAwesomeIcon
                            icon={item.icon}
                            size='lg'
                        /> */}
                    </NavLink>
                    {badge}
                </div>)
            })}
        </div>
              {/* <Leagues leagueClicked={() => closeModal()} /> */}
            </div>
          </div>
        </div>
    )
    // }
    // return <div></div>
  }
  return renderSidebar()
}

export default SidebarNav