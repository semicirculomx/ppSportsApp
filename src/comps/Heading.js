import React from 'react'

import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from 'store/authSlice'

import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Row, Figure, NavbarBrand } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import SidebarNav from 'layouts/header/sidebar_nav'

function Heading(props) {
    let { title, btnLogout, backButton, btnProfile, navBar, logo } = props

    let dispatch = useDispatch()
    let history = useHistory()
    const isMobile = useMediaQuery({ query: '(max-width: 576px)' })
    let { user: authUser, isAuthenticated } = useSelector(state => state.auth)
    let [btnTxt, setBtnTxt] = React.useState("Cerrar sesión")
    const [isOpen, setIsOpen] = React.useState(false);
    let [hamburguer, setHamburguer] = React.useState('')

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        setHamburguer(isOpen ? '' : 'open-nav')
      };
    
    if (backButton)
        backButton = (<button
            onClick={() => { isAuthenticated ? history.goBack() : history.push('/') }}
            className="ml-2 btn btn-naked-primary rounded-circle text-primary">
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>)
    if (btnLogout)
        btnLogout = (<button onClick={() => { dispatch(logout()) }}
            className="btn px-2 py-1 mr-2 text-light"
        >{btnTxt}
        </button>)
    if (btnProfile && isAuthenticated)
        btnProfile = (
            <Link
                className="d-flex align-items-end"
                to={`/user/${authUser.screen_name}`}
            >
                <Figure
                    className="bg-border-color rounded-circle overflow-hidden my-auto ml-2"
                    style={{ height: "35px", width: "35px" }}
                >
                    <Figure.Image
                        src={(authUser.default_profile_image) ? '/img/default-profile-vector.svg' : authUser.profile_image_url_https}
                        className="w-100 h-100"
                    />
                </Figure>
            </Link>
        )
        if (logo)
        logo = (
            <NavbarBrand as={Link} to="/">
            <img className="" height="50" width="50" src="/logo-playerpicks.png" alt="logo" />
            {/* <FontAwesomeIcon size="lg" icon={faTwitter} /> */}
        </NavbarBrand>
        )
    if (!navBar && isMobile && isAuthenticated){
        navBar = (
            <>
        <SidebarNav closeModal={() =>{ 
            setIsOpen(false)
            setHamburguer('')
        }} isOpen={isOpen} />
     
            <label className="hamburger">
            <input type="checkbox" className={hamburguer} checked={`${toggleOpen}`} onChange={toggleOpen}></input>
            <svg viewBox="0 0 32 32">
              <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
              <path className="line" d="M7 16 27 16"></path>
            </svg>
          </label>
          </>
        )
    }
    return (
        <div className="d-flex justify-content-between sticky-top text-light bg-color-dark align-items-center">
            <Row className="d-flex align-items-center">
                {navBar}
                {backButton}
                {isMobile && btnProfile}
                <h5 className="my-3 mx-2 pl-2 font-weight-bold">{title}</h5>
            </Row>
            {btnLogout}
            {logo}
        </div>
    )
}
export default Heading