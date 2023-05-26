import React from 'react'
import Login from 'layouts/landing/Login'
import Signup from 'layouts/landing/Signup'
import Navbar from 'layouts/landing/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Col, Row, Figure } from 'react-bootstrap'

import MediaQuery from 'react-responsive'
import Explore from 'layouts/main/Explore'
import Search from 'features/search/Search'
import UserDetail from 'features/users/UserDetail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import PasswordReset from 'layouts/landing/PasswordReset'
export default props => {
    return (
        <Router>
            <>
                <Navbar />
                <div className="landing-page">
      <Container>
      <Row className="align-items-center justify-content-center">
          <Col md={{ size: 6}} className="text-center">
           <Switch>
           <Route path="/signup">
          <Signup />
            </Route> 
            <Route path="/login">
          <Login />
            </Route>
        <Route path="/password-reset">
          <PasswordReset />
            </Route>
            <Route path="/">
               <Login />
            </Route>
           </Switch>
          </Col>
        </Row>
        <Row>
        </Row>
      </Container>
    </div>
    <footer className="py-3 px-3 landing-footer">
    <div className="container">
        <div className="row">
            <div className="col-md-6">
            <Figure
                    className="mx-auto ml-2 logo-transparent"
                    style={{ height: "75px", width: "135px" 
                }}
                >
                    <Figure.Image
                        src={'white-logo-playerpicks.png'}
                        className="w-100 h-100"
                    />
                </Figure> 
                       <p>
                    Sitio web de entretenimiento deportivo, análisis de expertos en deportes y recomendaciones de apuestas para ganar más!
                    </p>
                </div>
            <div className="col-md-6 mt-3">
                <ul className="list-unstyled">
                    <li><FontAwesomeIcon icon={faLink}/> Políticas de privacidad</li>
                    <li><FontAwesomeIcon icon={faLink}/> Terminos de uso</li>
                    <li><FontAwesomeIcon icon={faLink}/> Terminos de suscripción Playerpicks</li>
                    <li><FontAwesomeIcon icon={faLink}/> Términos y condiciones</li>
                    <li><FontAwesomeIcon icon={faLink}/> FAQ/Ayuda</li>
                    <li><FontAwesomeIcon icon={faLink}/> Patrocinadores</li>
                </ul>
            </div>
        </div>
        <hr />
        <div className="row">
            <div className="col-md-12 text-center">
                <p>&copy; 2023 Playerpicks. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</footer>
                {/* <Container className=''>
                    <Row>
                        <Col xs="12">
                        <Route path="/">
                                    <MediaQuery maxWidth={992}>
                                        <Login compact />
                                        <Explore noSearchBar noSuggestions compact noHeading noTrends/>
                                    </MediaQuery>
                                    <MediaQuery minWidth={993}>
                                        <Explore noSearchBar noSuggestions />
                                    </MediaQuery>
                                </Route> */}
                            {/* <Switch>
                                <Route path="/signup">
                                    <MediaQuery maxWidth={992}>
                                        <Signup />
                                    </MediaQuery>
                                    <MediaQuery minWidth={993}>
                                        <Explore noSearchBar />
                                    </MediaQuery>
                                </Route>
                                <Route path="/login">
                                    <MediaQuery maxWidth={992}>
                                        <Login />
                                    </MediaQuery>
                                    <MediaQuery minWidth={993}>
                                        <Explore noSearchBar />
                                    </MediaQuery>
                                </Route>
                                <Route path="/search" component={Search} />
                                <Route path='/user/:username' component={UserDetail} />
                                <Route path="/">
                                    <MediaQuery maxWidth={992}>
                                        <Login compact />
                                        <Explore noSearchBar noSuggestions compact noHeading noTrends/>
                                    </MediaQuery>
                                    <MediaQuery minWidth={993}>
                                        <Explore noSearchBar noSuggestions />
                                    </MediaQuery>
                                </Route>
                            </Switch> */}
                        {/* </Col> */}
                        {/* <MediaQuery minWidth={993}>
                            <Col className="mx-auto vh-100 sticky-top overflow-y-auto hide-scroll" xs lg="5">
                                <Switch>
                                    <Route path="/signup">
                                        <Signup />
                                    </Route>
                                    <Route path="/">
                                        {/*<Redirect to="/" />*/}
                                    {/*}    <Login />
                                    </Route>
                                </Switch>
                            </Col>
                        </MediaQuery> */}
                    {/* </Row>
                </Container> */}
            </>
        </Router>
    )
}