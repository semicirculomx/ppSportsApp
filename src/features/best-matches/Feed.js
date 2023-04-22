import React from 'react'
import { useCallback } from 'react'

// import ScrollManager from 'comps/ScrollManager'
import { useDispatch, useSelector } from 'react-redux'
import { getBestMatches, selectFeedMatches } from './bmSlice'

import FollowCard from 'layouts/main/sidebar/FollowCard'
import MatchesList from 'comps/MatchesList'

export default (props) => {
    let { feed_status: status } = useSelector(state => state.matches)
    let matches = useSelector(selectFeedMatches)
    let dispatch = useDispatch()
    const getMatches = useCallback(() => {
        dispatch(getBestMatches())
        // eslint-disable-next-line
    }, [])
    // if (status === 'error')
    //     append = <TryAgain fn={getMatches} />
    let append;
    if (status === 'done')
        append = (<>
            <div className="message text-info"></div>
            {/* <FollowCard noPop length={7} title='Los Expertos en Deportes más buscados' /> */}
        </>)
    return (<>
        {/* <ScrollManager scrollKey="feed-screen" /> */}
        <MatchesList
            matches={matches}
            status={status}
            getMatches={getMatches}
        />
        {append}
    </>)
}
