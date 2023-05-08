import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Media } from 'react-bootstrap';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Spinner from 'comps/Spinner';
import TryAgain from 'comps/TryAgain';
import Pick from 'comps/Pick';
import { gameDate } from 'utils/helpers';
import FilterComponent from './filterComponent';


export default function PicksList(props) {
  const { picks = [], getPicks, status, no_filter } = props;

  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('recent');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  let filteredPicks = picks.filter((pick) => {

    switch (filter) {
      case 'recent':
        // Ordena por fecha de creación y devuelve los más recientes
        return picks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'lost':
        // Filtra por estado "lost"
        return pick.status === 'lost';
      case 'won':
        // Filtra por estado "won"
        return pick.status === 'won';
      case 'pending':
        // Filtra por estado "upcoming"
        return pick.status === 'pending';
      default:
        return true;
    }
  });

  // eslint-disable-next-line
  useEffect(useCallback(() => {
    if ((status === 'idle' || status === 'done')) {
      getPicks()
      // console.log('fetching on posts load, status:', status)
    }
  }, [status, getPicks]), [])
  useBottomScrollListener(useCallback(() => {
    if (status === "idle") {
      getPicks()
      console.log('loading more picks, status:', status)
    }
  }, [status, getPicks]), 700, 200, null, true)

  if (status === 'loading' && !picks.length)
    return <Spinner />
  return (
    <>
      {!no_filter &&
        <div className="px-4 py-2 mx-75 filter-bar" >
          <FilterComponent onFilterChange={handleFilterChange} />
        </div>
      }
      <ListGroup className="pick-card" variant="flush">
        {(filteredPicks.length) ? filteredPicks.map((pick) => {
          return (
            <ListGroup.Item
              key={pick.id_str}
              className={pick.status}
              
              as={"div"}>
              <Pick pick={pick} />
            </ListGroup.Item>
          )
        }) : (status === 'idle' &&
          <div className="message">Ya no hay más picks</div>
        )}
        {status === 'loading' && <Spinner />}
        {status === 'error' && <TryAgain fn={getPicks} />}
      </ListGroup>
    </>
  );
}