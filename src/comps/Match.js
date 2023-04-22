import React from 'react';
import PropTypes from 'prop-types';
import { calculateImpliedProbability, dateConverter, gameDate } from '../utils/helpers';
import PostsList from './PostsList';

const Match = ({ match }) => {
  return (
    <div className="match-detail">
    <header className="header-container">
      <div className="row">
        <div className="date-time-channel">{dateConverter(match?.commence_time)} UTC</div>
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
                    src={match ? `/images/${match.competition.toLowerCase()}/${match.home_team.split(" ").join("-")}.png` : '/img/default-profile-vector.svg'}
                    alt={`Logo`}
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
                    className="team-logo"
                    src={match ? `/images/${match.competition.toLowerCase()}/${match.away_team.split(" ").join("-")}.png` : '/img/default-profile-vector.svg'}
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
      <div className="row attribution-row">
        <span className="odds-attribution">Momios actualizados de DraftKings </span>
      </div>
    </header>
  </div>
  );
};

Match.propTypes = {
  match: PropTypes.shape({
    home_team: PropTypes.string.isRequired,
    away_team: PropTypes.string.isRequired,
    commence_time: PropTypes.string.isRequired,
  }).isRequired
};

export default Match;