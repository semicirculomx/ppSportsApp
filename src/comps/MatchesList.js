// import { useEffect, useCallback } from 'react';
// import { ListGroup, Media, Row, Col, Badge } from 'react-bootstrap';
// import Spinner from './Spinner';
// import TryAgain from './TryAgain';
// import Match from './Match';

// function MatchesList(props) {
//   const { matches, status, getMatches } = props;
//   useEffect(() => {
//     if (status === 'idle' && matches.length === 0) {
//       getMatches();
//       console.log('Fetching matches on load');
//     }
//   }, [status, matches.length, getMatches]);

//   useEffect(() => {
//     if (status === 'idle' && matches.length > 0) {
//       getMatches();
//       console.log('Loading more matches');
//     }
//   }, [status, matches.length, getMatches]);

//   const renderMatch = (match) => {
//     return (
//       <ListGroup.Item key={match.id_str}>
//         <Match match={match} />
//       </ListGroup.Item>
//     );
//   };

//   const renderMatches = () => {
//     if (matches.length === 0) {
//       return <div className="message">No matches for you right now</div>;
//     }
//     return matches.map((match) => renderMatch(match));
//   };

//   return (
//     <ListGroup variant="flush" className="border-bottom pick-card">
//       {status === 'loading' && matches.length === 0 && <Spinner />}
//       {status === 'error' && <TryAgain fn={getMatches} />}
//       {renderMatches()}
//       {status === 'loading' && matches.length > 0 && <Spinner />}
//     </ListGroup>
//   );
// }

//export default MatchesList;

import React from 'react'
import { useEffect, useCallback } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link, useHistory } from 'react-router-dom'
import { Media, Row, ListGroup, Figure } from 'react-bootstrap'
import MultiMedia from 'comps/MultiMedia'
import Spinner from 'comps/Spinner'
import UserLink from 'comps/user-link'
 import Match from 'comps/Match';


import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import TryAgain from './TryAgain'

export default function MatchesList(props) {
    let { matches = [], status, getMatches, no_reply_tag } = props
    let history = useHistory()
    /* 
        Not the best implementation, but I dont want to spend hours to check if changing it breaks anything
    */
    // eslint-disable-next-line
    useEffect(useCallback(() => {
        if ((status === 'idle' || status === 'done') && !matches.length) {
            getMatches()
            // console.log('fetching on matches load, status:', status)
        }
    }, [status, matches, getMatches]), [getMatches])
    useBottomScrollListener(useCallback(() => {
        if (status === "idle" && matches.length) {
            getMatches()
            console.log('loading more matches, status:', status)
        }
    }, [status, matches, getMatches]), 700, 200, null, true)
    if (status === 'loading' && !matches.length)
        return <Spinner />
    return (
        <ListGroup className="match-card" variant="flush" >
            {(matches.length > 0) ? matches.map(match => {
                return (
                     <ListGroup.Item 
                     key={match.id_str}
                     onClick={(e) => {
                        history.push(`/match/${match.id_str}`)
                        }}
                    className="p-0" 
                     >
                     <Match match={match} />
                   </ListGroup.Item>
                )
            }) : (status === 'idle' &&
                <div className="message">No hay más partidos</div>
            )}
            {status === 'loading' && <Spinner />}
            {status === 'error' && <TryAgain fn={getMatches} />}
        </ListGroup>
    )
}