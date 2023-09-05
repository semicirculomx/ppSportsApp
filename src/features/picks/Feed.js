import React from 'react'
import { useCallback } from 'react'

// import ScrollManager from 'comps/ScrollManager'
import { useDispatch, useSelector } from 'react-redux'
import { getPicksFeed, selectFeedPicks } from './picksSlice'

import PicksList from 'comps/PicksList'
import OddspediaWidget from 'comps/BetsComparison'

export default (props) => {
    let { feed_status: status } = useSelector(state => state.picks)
    let picks = useSelector(selectFeedPicks)
    let dispatch = useDispatch()
    // const getPicks = useCallback(() => {
    //     dispatch(getPicksFeed())
    //     // eslint-disable-next-line
    // }, [])
    // if (status === 'error')
    //     append = <TryAgain fn={getPicks} />
  
    return (<>
        {/* <ScrollManager scrollKey="feed-screen" /> */}
        <>
        <OddspediaWidget/>
        </>
    </>)
}
