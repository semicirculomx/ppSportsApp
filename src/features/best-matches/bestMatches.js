import React from 'react'
import { useCallback } from 'react'

// import ScrollManager from 'comps/ScrollManager'
import { useDispatch, useSelector } from 'react-redux'
import { getBestMatches, selectBestMatches } from './bmSlice'

import MatchesList from 'comps/MatchesList'
import Heading from 'comps/Heading'

export default (props) => {
    let { feed_status: status } = useSelector(state => state.bm)
    let matches = useSelector(selectBestMatches)
    let dispatch = useDispatch()
    const getMatches = useCallback(() => {
        dispatch(getBestMatches())
        
        // eslint-disable-next-line
    }, [])
    // if (status === 'error')
    //     append = <TryAgain fn={getPosts} />
    let append;
    if (status === 'done')
        append = (<>
            <div className="message text-info"></div>
            {/* <FollowCard noPop length={7} title='Los Expertos en Deportes más buscados' /> */}
        </>)
    return (<>
        <Heading title="Partídos importantes"/>
        <MatchesList 
        matches={matches} 
        getMatches = {getMatches}
        status={status}
        />
        {/* {append} */}
    </>)
}