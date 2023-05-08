import React, { useEffect } from 'react'
import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    usersSelectors,
    followUser,
    unFollowUser,
    //selectUserPosts,
    getUserTimeline,
    getUserPicks,
    getUserPosts
} from './usersSlice'
import { selectUserPosts } from 'features/posts/postsSlice'

// import Spinner from 'comps/Spinner'
import PicksList from 'comps/PicksList'
import PostsList from 'comps/PostsList'
import Heading from 'comps/Heading'
import FollowButton from 'comps/FollowButton'
import { Row, Figure, Col, Tabs, Tab } from 'react-bootstrap'
import ScrollToTop from 'comps/ScrollToTop'
import { currencyFormat, numFormatter } from 'utils/helpers'
import Spinner from 'comps/Spinner'
import WithUrls from 'comps/with-urls'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow as faLocation } from '@fortawesome/free-solid-svg-icons/faLocationArrow'
import { faCalendarAlt as faDate } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink'
import { faTrophy, faWallet, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { selectUserPicks } from 'features/picks/picksSlice'
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons'



export default props => {
    let dispatch = useDispatch()
    let { match: { params: { username } = {} } = {} } = props
    let user = useSelector(state => usersSelectors.selectById(state, username))
    let { user: authUser } = useSelector(state => state.auth)
    let posts = useSelector(state => selectUserPosts(state, user && user.screen_name))
    let { user_timeline_status: status } = useSelector(state => state.users)
    let { user_posts_status: posts_status } = useSelector(state => state.users)
    let { user_picks_status: picks_status } = useSelector(state => state.users)
    let picks = useSelector(state => selectUserPicks(state, user && user.screen_name))
    const [activeTab, setActiveTab] = useState('posts');

    const handleSelect = (key) => {
        setActiveTab(key);
    };

    let getPosts = useCallback(() => {
        dispatch(getUserPosts(username))
        // eslint-disable-next-line
    }, [username])
    
    let getPicks = useCallback(() => {
        dispatch(getUserPicks(username))
            // eslint-disable-next-line
    }, [username])

    useEffect(() => {
         if(status === 'idle') {
            dispatch(getUserTimeline(username))
         }
        // eslint-disable-next-line
    }, [])

    if (status === 'loading' && !user)
        return <Spinner />
    let userFeed = (<>
        <Tabs className="custom-tabs" activeKey={activeTab} onSelect={handleSelect}>
            <Tab eventKey="posts" title={`Análisis`}>
                <PostsList
                    no_carousel
                    status={posts_status}
                    getPosts={getPosts}
                    posts={posts}
                />
            </Tab>
            <Tab eventKey="picks" title={`Picks`}>
                 <PicksList
                    status={picks_status}
                    getPicks={getPicks}
                    picks={picks}
                /> 
            </Tab>
        </Tabs>
    </>)
    let userDetail
    if (!user)
        userDetail = <div className="message font-weight-bold">Este usuario no existe</div>
    else if (user) {
        let { url: { urls: [{ url, expanded_url } = {}] = [] } = {} } = user.entities
        let banner_color = user.profile_banner_color || '#f5f8fa'
        const isNotifEnabled = user.notifications_enabled_device_count > 0
        userDetail = (<>
            <ScrollToTop />
            <Heading title={'Perfil'} btnLogout={authUser ? true : false}/>
            <Figure
                style={{ height: "100px", width: "100%", backgroundColor: banner_color }}
            >
                {!user.profile_banner_color && <Figure.Image
                    src={user.profile_banner_url}
                    className="w-100 h-100"
                />}
            </Figure>
            <div className="p-3 border-bottom">
                <Row className="d-flex custom-btn justify-content-between mt-n2 px-2 align-items-center w-100">
                    <Figure
                        style={{ height: "100px", width: "100px" }}
                        className="mt-n5 rounded-circle overflow-hidden bg-primary"
                    >
                        <Figure.Image
                            className="w-100 h-100"
                            src={user.profile_image_url_https}
                        />
                    </Figure>
                    {authUser && authUser.screen_name === user.screen_name ? (
                        <Link
                            className="btn btn-outline-primary px-3 rounded-pill font-weight-bold"
                            to='/settings/profile'
                        >Editar perfil</Link>
                    ) : (
                        <FollowButton
                            user={user}
                            followUser={() => { dispatch(followUser(user.screen_name)) }}
                            unFollowUser={() => { dispatch(unFollowUser(user.screen_name)) }}
                        />
                    )}
                </Row>
                <div className="flex flex-column">
                    <h5 className="mb-0"><b>{user.name}</b></h5>
                    <div className="text-muted">@{user.screen_name}</div>
                </div>
                <blockquote style={{ maxHeight: '300px' }} className="my-3 overflow-y-auto">
                    <WithUrls>{user.description}</WithUrls>
                    </blockquote>
                    <Row className="d-flex justify-content-between">
                    <Col xs="6" lg="4" className="mb-1">
                        <div className="d-flex text-muted">
                            <FontAwesomeIcon className="mt-1" icon={faWallet} style={{ fontSize: '1em' }} />
                            <span className="ml-1">Bank: {currencyFormat(user.totalBank)}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="d-flex justify-content-between">
                    <Col xs="6" lg="4" className="mb-1">
                        <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1" icon={faTrophy} style={{ fontSize: '1em' }} />
                            <span className="ml-1">Ganadas: {user.won_bets}</span>                     
                        </div>
                    </Col>
                </Row>                
                <Row className="d-flex justify-content-between">
                    <Col xs="6" lg="4" className="mb-1">
                        <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1" icon={faWindowClose} style={{ fontSize: '1em' }} />
                            <span className="ml-1">Perdidas: {user.lost_bets}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="d-flex mb-1 justify-content-between w-100">
                <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1 mr-1" icon={faTelegramPlane} style={{ fontSize: '1em' }} />
                            <WithUrls>{expanded_url || url}</WithUrls>
                            {/* <a className="d-block text-truncate ml-1" target="_blank" rel="noopener noreferrer" href={expanded_url || url}>{display_url || url || expanded_url || 'Just here'}</a> */}
                        </div>
                        {user.location && (
                        <Col sm="6" lg="4" className="mb-1">
                            <div className="d-flex text-muted align-items-top">
                                <FontAwesomeIcon className="mt-1" icon={faLocation} style={{ fontSize: '1em' }} />

                                <span className="ml-1">{user.location || 'Location unknown'}</span>

                            </div>
                        </Col>
                    )}
                </Row>
                <Row className="d-flex mx-auto my-2 text-center justify-content-between align-items-center w-100">
                    { user.role === 'tipster' &&  <Link
                        to={`/user/${user.screen_name}/followers`}
                        className="text-muted mr-2"
                    > <span className='font-weight-bold'>{numFormatter(user.followers_count)}</span> Seguidores</Link>
                     }
                                       <Link
                        to={`/user/${user.screen_name}/friends`}
                        className="text-muted mr-2"
                    ><span className='font-weight-bold'>{numFormatter(user.friends_count)}</span> Siguiendo</Link>
                </Row>             
            </div>
        </>)
    }
    return (<>
        {userDetail}
        {userFeed}
    </>)
}