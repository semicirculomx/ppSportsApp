import React, { useState } from "react";
import { gameDate } from "../utils/helpers"

export default ({ bets, onRemove }) => {
  const [betList, setBetList] = useState(bets);

  const handleRemove = (index) => {
    const updatedList = betList.filter((bet, i) => i !== index);
    setBetList(updatedList);
    onRemove(index);
  };

  return (
    <>
        {bets.map((bet, index) => (
            <div className="box slip" key={index}>
                <button className="btn " onClick={() => handleRemove(index)}>X</button>
                <div className="container--wide">
                    <div className="slip__line-numbers">
                        <p className="slip__point">{bet.match.matchTitle}</p>
                        <p className="slip__price">({bet.odds})</p>
                    </div>
                    <p className="slip__line-type">{bet.market}</p>
                    <div className="slip__matchup-info">
                        <p className="slip__matchup">{bet.match.home_team} @ {bet.match.away_team}</p>
                        {gameDate({ matchup: bet.match.commence_time })}
                    </div>
                </div>
            </div>
        ))}
    </>
)
}