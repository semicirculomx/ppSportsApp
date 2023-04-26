import React from 'react'
import Login from 'layouts/landing/Login'
import Signup from 'layouts/landing/Signup'
import Navbar from 'layouts/landing/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'

import MediaQuery from 'react-responsive'
import Explore from 'layouts/main/Explore'
import Search from 'features/search/Search'
import UserDetail from 'features/users/UserDetail'

export default props => {
    return (
        <Router>
            <>
                <Navbar />
                <Container className='vh-100 d-flex justify-content-center align-items-center'>
                    <Row>
                        <Col xs="12" lg="7">
                            <Switch>
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
                            </Switch>
                        </Col>
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
                    </Row>
                </Container>
            </>
        </Router>
    )
}