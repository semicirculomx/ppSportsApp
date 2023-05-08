import React from 'react'
import Search from 'comps/SearchBar'
import FollowCard from './FollowCard'
import TrendingCard from './TrendingCard'
import { Col } from 'react-bootstrap'

import { useLocation } from 'react-router-dom'

function Sidebar() {
    const location = useLocation()
    return (
        <Col>
            <Search className="sticky-top my-2" />

            {/* {!(location.pathname === '/explore/users') ? (
                <FollowCard compact className="my-3" length={5} title="Who to follow" />
            ) : undefined} */}
            {/* <br /> */}
            {!(location.pathname === '/explore') ? (
                <TrendingCard className="my-3" title="Tendencias" />
            ) : undefined}
        </Col>
    )
}

export default Sidebar
