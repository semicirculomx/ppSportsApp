import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getFeed, selectFeedPosts } from './postsSlice'

import PostsList from 'comps/PostsList'
import { Button, Tab, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { getPicksFeed, selectFeedPicks } from 'features/picks/picksSlice'
import PicksList from 'comps/PicksList'
import CategoryCarousel from 'comps/CategoryCarousel'

export default function Feed() {
  const dispatch = useDispatch()
  const posts = useSelector(selectFeedPosts)
  const picks = useSelector(selectFeedPicks)
  const { feed_status: status } = useSelector(state => state.posts)
  const { feed_status: pick_status } = useSelector(state => state.picks)
  const [activeTab, setActiveTab] = useState('posts');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [secondLevelFilter, setSecondLevelFilter] = useState('recent');

  const getPosts = useCallback(() => {
    dispatch(getFeed())
  }, [dispatch])

  const getPicks = useCallback(() => {
    dispatch(getPicksFeed())   
  }, [dispatch])


  const handleSelect = (key) => {
    setActiveTab(key);
};


const handleFilterChange = (newFilter) => {
  if (['basketball', 'baseball', 'soccer', 'hockey', 'american_football', 'tennis', 'all', 'other'].includes(newFilter)) {
    setCategoryFilter(newFilter);
  } else {
    setSecondLevelFilter(newFilter);
  }
};

let filteredPosts = posts.filter((post) => {
  if (categoryFilter === 'other') {
    // Filtrar publicaciones que no están en ninguna categoría conocida
    return !post.post_categories.some(category => ['basketball', 'baseball', 'soccer', 'hockey', 'american_football', 'tennis'].includes(category));
  } else if (categoryFilter !== 'all' && !post.post_categories.includes(categoryFilter)) {
    // Filtrar publicaciones por categoría seleccionada
    return false;
  } 

  switch (secondLevelFilter) {
    case 'recent':
      // Ordena por fecha de creación y devuelve los más recientes
      return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'most-liked':
      // Ordena por número de likes y devuelve los más populares
      return posts.sort((a, b) => b.favorite_count - a.favorite_count);
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

let filteredPicks = picks.filter((pick) => {
  let categories = pick.bets.map((bet) => bet.match.sport.toLowerCase());
 if (categoryFilter === 'other') {
    // Filtrar selecciones que no están en ninguna categoría conocida
    return !categories.some(category => ['basketball', 'baseball', 'soccer', 'hockey', 'american_football', 'tennis'].includes(category));
  } else if (categoryFilter !== 'all' && !categories.includes(categoryFilter)) {
    // Filtrar publicaciones por categoría seleccionada
    return false;
  } 
    switch (secondLevelFilter) {
      case 'recent':
        // Ordenar por fecha de creación y devolver las más recientes
        return true; // Otra lógica de ordenación si es necesaria
      case 'lost':
        // Filtrar por estado "lost"
        return pick.status === 'lost';
      case 'won':
        // Filtrar por estado "won"
        return pick.status === 'won';
      case 'upcoming':
        // Filtrar por estado "upcoming"
        return pick.status === 'upcoming';
      default:
        return true;
    }

  // No es necesario el switch para el filtro por estado, puedes dejarlo fuera del bloque de categorías.
});

  let userFeed = (<>
    <Tabs className="custom-tabs" activeKey={activeTab} onSelect={handleSelect}>
        <Tab eventKey="posts" title={`Análisis`}>
        <PostsList posts={filteredPosts} status={status} getPosts={getPosts} no_carousel={true} />
        </Tab>
        <Tab eventKey="picks" title={`Picks`}>
             <PicksList
                status={pick_status}
                getPicks={getPicks}
                picks={filteredPicks}
            /> 
        </Tab>
    </Tabs>
</>)
  return (
    <>
      <CategoryCarousel onCategorySelected={handleFilterChange}/>
     {userFeed}
    </>
  )
}
