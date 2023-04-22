import React from 'react'
import { useEffect, useCallback } from 'react'
import Heading from 'comps/Heading'
import { Link } from 'react-router-dom'
import { Row, Col, Figure } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import { useSelector, useDispatch } from 'react-redux'
import { selectPickById, getPick, selectReplies, getReplies } from './picksSlice'

import { numFormatter } from 'utils/helpers'
import ScrollToTop from 'comps/ScrollToTop'
import ReactionsBar from './ReactionsBar'
import PickText from 'comps/PickText'
import QuotedPick from 'comps/quoted-pick'
import UserLink from 'comps/user-link'
import Spinner from 'comps/Spinner'
import PicksList from 'comps/PicksList'

export default props => {
    let { match: { params: { pickId } = {} } = {} } = props
    let dispatch = useDispatch()
    let pick = useSelector(state => selectPickById(state, pickId))
    const replies = useSelector(state => selectReplies(state, pickId))
    let { pick_detail_status: status, pick_replies_status } = useSelector(state => state.picks)
    
    useEffect(() => {
        if (!pick)
            dispatch(getPick(pickId))
    }, [pick, pickId, dispatch])

    const getPicks = useCallback(() => {
        dispatch(getReplies(pickId))
    }, [dispatch, pickId])

    if (status === 'loading')
        return <Spinner />
    if (!pick) {
        return <div className="message font-weight-bold">Pick not Found</div>
    }
    
    return (<>
        <ScrollToTop />
        <Heading backButton title="Pick" />
        <Col className="p-3 d-flex flex-column">
            <Row>
                <Row>
                    <UserLink
                        user={pick.user}
                        className="rounded-circle"
                        to={`/user/${pick.user.screen_name}`}
                    >
                        <Figure
                            className="bg-border-color rounded-circle mr-2 overflow-hidden"
                            style={{ height: "50px", width: "50px" }}
                        >
                            <Figure.Image
                                src={(pick.user.default_profile_image) ? '/img/default-profile-vector.svg' : pick.user.profile_image_url_https}
                                className="w-100 h-100"
                            />
                        </Figure>
                    </UserLink>
                    <Col className="d-flex flex-column">
                        <UserLink
                            user={pick.user}
                            to={`/user/${pick.user.screen_name}`}
                            className="text-dark font-weight-bold mr-1">
                            {pick.user.name}
                        </UserLink>
                        {/* tick */}
                        <span className="text-muted mr-1">@{pick.user.screen_name}</span>
                    </Col>
                </Row>
                <Row></Row>
            </Row>
            <Row>
                <span className="text-muted pb-2">
                    {new Date(pick.created_at).toLocaleTimeString()}
                    {" - "}
                    {new Date(pick.created_at).toDateString()}
                </span>
            </Row>
            <Row className="border-top border-bottom d-flex p-2">
                <div className="py-1 pr-3">
                    <span className="font-weight-bold mr-1">{numFormatter(pick.favorite_count)}</span>
                    <Link to={`/pick/${pick.id_str}/likes`} className="text-muted">Likes</Link>
                </div>
                <div className="py-1 pr-3">
                    <span className="font-weight-bold mr-1">{numFormatter(pick.retweet_count)}</span>
                    <Link to={`/pick/${pick.id_str}/repicks`} className="text-muted">Repicks</Link>
                </div>
            </Row>
            <Row className="d-flex justify-content-end align-items-center mt-2 border-bottom">
                <ReactionsBar pick={pick} />
            </Row>
            <PicksList
                no_reply_tag
                picks={replies}
                status={pick_replies_status}
                getPicks={getPicks}
            />
        </Col>
    </>)
}