import React, { useState } from 'react';
import { useEffect, useCallback } from 'react'
import Heading from 'comps/Heading'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, Figure, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { selectPostById, getPost, selectReplies, getReplies } from 'features/posts/postsSlice'
import { getMatch, selectMatchById } from './bmSlice';
import { calculateImpliedProbability, dateConverter, numFormatter, truncatedText } from 'utils/helpers'
import ScrollToTop from 'comps/ScrollToTop'
import UserLink from 'comps/user-link'
import Spinner from 'comps/Spinner'
import PostsList from 'comps/PostsList'
import { getAllByAltText } from '@testing-library/react';
import { Fragment } from 'react';
import PicksList from 'comps/PicksList';
import { fetchMatch, selectApiMatch } from 'features/picks/picksSlice'
import { findLongestMarketsArray } from 'utils/helpers';


export default props => {
  let { matchId } = useParams();
  let dispatch = useDispatch()
  let { match_detail_status: status } = useSelector(state => state.bm)
  let match = useSelector(state => selectMatchById(state, matchId))
  let apiMatch = useSelector(selectApiMatch)

  let [homeTeamImageName, setHomeTeamImageName] = useState(null)
  let [awayTeamImageName, setAwayTeamImageName] = useState(null)

  useEffect(() => {
    if (!match){
      dispatch(getMatch(matchId))
     } else {
    //  dispatch(fetchMatch(match.match_id));
      setAwayTeamImageName(match.away_team.split(" ").join("-"));
      setHomeTeamImageName(match.home_team.split(" ").join("-"));
     }
  }, [match, matchId, dispatch])
  // const getPosts = useCallback(() => {
  //     dispatch(getReplies(postId))
  // }, [dispatch, postId])
  // useEffect(() => {
  //   if (!match) {
  //     dispatch(getMatch(matchId));
  //   } else {
  //     dispatch(fetchMatch(match.match_id));
  //     setAwayTeamImageName(match.away_team.split(" ").join("-"));
  //     setHomeTeamImageName(match.home_team.split(" ").join("-"));
  //   }
  // }, [dispatch, matchId, match]);

  // useEffect(() => {
  //   if (!match) {
  //     console.log(match)
  //     console.log(apiMatch)
  //     dispatch(fetchMatch(match.match_id));
  //   } else {
  //     // let bookmaker = findLongestMarketsArray(apiMatch.bookmakers);
  //     // setBookmaker(bookmaker);
  //     console.log(match)
  //     console.log(apiMatch);
  //   }
  // }, [apiMatch]);

  if (status === 'loading')
    return <Spinner />
  if (!match) {
    return <div className="message font-weight-bold">Post not Found</div>
  }

  if(match) {
    return (
      <>
      <Heading navBar title={`${match.home_team.substring(0, 3)} - ${match.away_team.substring(0, 3)}`} backButton/>
      <div className="match-detail py-3">
        <header className="header-container">
          <div className="row justify-content-center">
            <p className="date-time-channel">{dateConverter(match?.commence_time)} UTC</p>
          </div>
          <div className="row">
            <table className="main-table">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>ML</th>
                  <th>Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="team-details">
                      <img
                        className="team-logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/icons/user.svg`;
                        }}
                        src={homeTeamImageName && `/images/${match.competition.toLowerCase().trim()}/${homeTeamImageName}.png`}
                        alt={homeTeamImageName}
                        loading="lazy"
                      />
                      <div className="team-name-container">
                        <div className="team-name">{match?.home_team}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small-box">
                      <div className="value-content">
                        <div className="current-value">
                          <span className="primary">{match.bookmaker ? match.bookmaker.markets[0].outcomes[0].price : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small-box">
                      <div className="value-content">
                        <div className="current-value">
                          <span className="primary">{calculateImpliedProbability(match.bookmaker ? match.bookmaker.markets[0].outcomes[0]?.price : 'N/A')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="team-details">
                      {/* {awayTeamImageName && ( */}
                      <img
                       onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `/icons/user.svg`;
                      }}
                        className="team-logo"
                        src={awayTeamImageName && `/images/${match.competition.toLowerCase()}/${awayTeamImageName}.png`}
                        alt={`Logo`}
                        loading="lazy"
                      />
                      <div className="team-name-container">
                        <div className="team-name">{match?.away_team}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small-box">
                      <div className="value-content">
                        <div className="current-value">
                          <span className="primary">{match.bookmaker ? match.bookmaker.markets[0].outcomes[1].price : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small-box">
                      <div className="value-content">
                        <div className="current-value">
                          <span className="primary">{calculateImpliedProbability(match.bookmaker ? match.bookmaker.markets[0].outcomes[1]?.price : 'N/A')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center attribution-row">
            <span className="odds-attribution">Momios actualizados de DraftKings </span>
          </div>
        </header>
        { (match.posts.length > 0) &&
        (
            <>
           <PostsList no_carousel no_filter posts={match.posts}/>
     {/* <PicksList no_filter picks={match.picks} /> */}
            </>
          )}
      </div>
      </>
    );
  }
  
};