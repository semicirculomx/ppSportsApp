import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import Search from 'comps/SearchBar'
import { Link } from 'react-router-dom'
import { Navbar, Row, Container } from 'react-bootstrap'

class Navigationbar extends React.Component {
    render() {
        return (
            <Navbar sticky="top" className="py-1 bg-color-dark" style={{ zIndex: 10000 }}>
                <Container>
                    <Navbar.Brand as={Link} className="btn btn-naked-primary text-primary" to="/">
                        <img className="" height="45" width="45" src="/logo-playerpicks.png" alt="logo" />
                        {/* <FontAwesomeIcon size="lg" icon={faTwitter} /> */}
                    </Navbar.Brand>
                    <Search className="form-inline w-100" />
                    <Row className="ml-auto d-none d-lg-flex justify-content-end w-50">
                        <Link to="/login" className="btn btn-outline-primary rounded-pill px-3 py-2 font-weight-bold">Entrar</Link>
                        <Link to="/signup" className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold ml-2">Registrarse</Link>
                    </Row>
                </Container>
            </Navbar>
        )
    }
}
export default Navigationbar