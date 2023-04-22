import React from 'react'
import Home from './Home'
import Sidebar from './sidebar'
import MediaQuery from 'react-responsive'
import { Row, Col } from 'react-bootstrap'

import { Route, Switch } from 'react-router-dom'
import PostDetail from 'features/posts/PostDetail'
import Explore from './Explore'
import Search from 'features/search/Search'
import UserDetail from 'features/users/UserDetail'
import Compose from 'features/posts/compose-modal'
import Notifies from 'features/notify/notify-page'
import Settings from 'features/settings/settings-page.js'
import bestMatches from 'features/best-matches/bestMatches'
import startPick from 'features/picks/picks-modal.js'
import MatchDetails from 'features/best-matches/matchDetails'


import UserFriends from 'features/users/user-friends'
import UserFollowers from 'features/users/user-followers'

import PostLikes from 'features/users/post-likes'
import PostReposts from 'features/users/post-reposts'

import ChatRoom from 'comps/chat-room-placeholder'

import { useAlerts } from 'features/alerts/alertsContext'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import betCalculator from 'comps/betCalculator'
import TextEditor from 'comps/TextEditor'

export default props => {
    const { ensureCompleteProfile } = useAlerts()
    const dispatch = useDispatch()
    useEffect(() => {
        ensureCompleteProfile()
        // eslint-disable-next-line
    }, [])
    return (
        <Row>
            <Col className="px-sm-4" sm="12" lg="8">
                <Col>
                    <Switch>
                        <Route path='/explore' component={Explore} />
                        <Route path='/search' component={Search} />

                        <Route path="/top-matches" component={bestMatches}/>
                        <Route path="/match/:matchId" component={MatchDetails}/>

                        <Route path="/text-editor" component={TextEditor}/>
                        <Route path="/compose/post" component={Compose}/>

                        <Route path='/post/:postId/likes' component={PostLikes} />
                        <Route path='/post/:postId/reposts' component={PostReposts} />
                        <Route path='/post/:postId' component={PostDetail} />

                        <Route path='/user/:username/friends' component={UserFriends} />
                        <Route path='/user/:username/followers' component={UserFollowers} />
                        <Route path='/user/:username' component={UserDetail} />

                        <Route path='/notifications' component={Notifies} />
                        <Route path='/settings' component={Settings} />
                        <Route path='/chats' component={ChatRoom} />

                        <Route path='/' component={Home} />
                    </Switch>

                    <Route path='/empezar-pick' component={startPick} />
                    
                </Col>
            </Col>

            <MediaQuery minWidth={992}>
                <Col lg="4" className="vh-100 overflow-y-auto hide-scroll sticky-top">
                    <Sidebar />
                </Col>
            </MediaQuery>
        </Row>
    )
}