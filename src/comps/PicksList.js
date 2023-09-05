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
import CategoryCarousel from './CategoryCarousel';


export default function PicksList(props) {
  const { picks = [], getPicks, status, no_carousel } = props;

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [secondLevelFilter, setSecondLevelFilter] = useState('recent');
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('recent');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleFilterChange = (newFilter) => {
    if (['basketball', 'baseball', 'soccer', 'hockey', 'american_football', 'tennis', 'all'].includes(newFilter)) {
      setCategoryFilter(newFilter);
    } else {
      setSecondLevelFilter(newFilter);
    }
  };

  let filteredPicks = picks.filter((post) => {
    if (categoryFilter !== 'all' && !post.categories.includes(categoryFilter)) {
      return false;
    }
  
    switch (secondLevelFilter) {
      case 'recent':
        // Ordena por fecha de creación y devuelve los más recientes
        return picks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'most-liked':
        // Ordena por número de likes y devuelve los más populares
        return picks.sort((a, b) => b.favorite_count - a.favorite_count);
      case 'lost':
        // Filtra por estado "lost"
        return post.pick?.status === 'lost';
      case 'won':
        // Filtra por estado "won"
        return post.pick?.status === 'won';
      case 'upcoming':
        // Filtra por estado "upcoming"
        return post.pick?.status === 'upcoming';
      default:
        return true;
    }
  });

  // eslint-disable-next-line
  useEffect(useCallback(() => {
    if ((status === 'idle' || status === 'done') && !picks.length) {
        getPicks()
        // console.log('fetching on picks load, status:', status)
    }
}, [status, picks, getPicks]), [getPicks])
  // useBottomScrollListener(useCallback(() => {
  //   if (status === "idle") {
  //     getPicks()
  //     console.log('loading more picks, status:', status)
  //   }
  // }, [status, getPicks]), 700, 200, null, true)

  if (status === 'loading' && !picks.length)
    return <Spinner />
  return (
    <>
      {(!no_carousel && status !== 'idle') &&
        <div className=''>
         <CategoryCarousel onCategorySelected={handleFilterChange}/>
        </div>}
      <ListGroup className="pick-card" variant="flush">
        {(picks.length) ? picks.map((pick) => {
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
        {(picks.length > 0) && (
              <div className="custom-btn d-flex justify-content-center" >
              <button onClick={getPicks} className="btn mt-2 mb-4">
                Cargar más
              </button>
              </div>
             )}
      </ListGroup>
    </>
  );
}