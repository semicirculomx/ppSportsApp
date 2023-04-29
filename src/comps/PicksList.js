import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Media } from 'react-bootstrap';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Spinner from 'comps/Spinner';
import TryAgain from 'comps/TryAgain';
import Pick from 'comps/Pick';
import { gameDate } from 'utils/helpers';
import FilterComponent from './filterComponent';


function PicksList(props) {
  const { picks = [], getFeedPicks, status, no_filter } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };


  const filteredPicks = picks.filter((pick) => {
    switch (filter) {
      case 'recent':
        // Ordena por fecha de creación y devuelve los más recientes
        return picks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'status':
        // Filtra por estado (por ejemplo, 'pending', 'won', 'lost')
        return pick.status === 'pending';
      default:
        return true;
    }
  });


  // eslint-disable-next-line
  useEffect(useCallback(() => {
    if (status === 'idle' && picks.length === 0) {
      if(getFeedPicks) getFeedPicks();

    }
  }, [status, picks.length, getFeedPicks]), [getFeedPicks]);    // eslint-disable-next-line

  // useBottomScrollListener(useCallback(() => {
  //   if (status === 'idle' && picks.length > 0) {
  //     if(getFeedPicks) getFeedPicks();
  //   }
  // }, [picks.length, getFeedPicks, status]), 700, 200, null, true);

  return (
    <>
      {!no_filter &&
        <div className="px-4 py-2 filter-bar" >
          <FilterComponent onFilterChange={handleFilterChange} />
        </div>
      }

      <ListGroup className=" pick-card" variant="flush">
        {(picks && picks.length > 0) ?
          filteredPicks.map((pick, index) => (
            <ListGroup.Item key={pick.id_str} className={pick.status}>
              <Pick pick={pick} />
            </ListGroup.Item>
          )) : (status === 'idle' &&
            <div className="message">Ya no hay más análisis</div>
          )}
        {status === 'loading' && <Spinner />}
        {status === 'error' && <TryAgain fn={getFeedPicks} />}
      </ListGroup>
    </>
  );
}

export default PicksList;