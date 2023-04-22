import React from 'react'
import { useEffect, useCallback, useState } from 'react'
import { Media, Row, ListGroup, Figure } from 'react-bootstrap'
import Spinner from 'comps/Spinner'
import Post from 'comps/Post'
import FilterComponent from 'comps/filterComponent';
import ReactTimeAgo from 'react-time-ago'

import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import TryAgain from './TryAgain'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import CategoryCarousel from './CategoryCarousel'
import PostTag from './post-tag'
import { Link } from 'react-router-dom'
import MultiMedia from 'comps/MultiMedia'
import UserLink from './user-link'
import PostText from './PostText'
import QuotedPost from './quoted-post'
import { useSelector } from 'react-redux'

export default function PostsList(props) {
    let { posts = [], status, getPosts, no_reply_tag, no_filter, no_carousel, comments} = props
    const [categoryFilter, setCategoryFilter] = useState('all');
const [secondLevelFilter, setSecondLevelFilter] = useState('recent');


    // const [selectedItems, setSelectedItems] = useState(new Set());
    //const [showDeleteButton, setShowDeleteButton] = useState(false);


// const handleDeleteSelected = () => {
//     // Aquí puedes despachar la acción de eliminar los elementos seleccionados
//     // y actualizar el estado de tu aplicación
//     // dispatch(deleteItems([...selectedItems]));
  
//     // Limpia los elementos seleccionados
//     setSelectedItems(new Set());
//     setShowDeleteButton(false);
//   };
  
      // const handleClearSelection = () => {
      //   setSelectedItems(new Set());
      //   setShowDeleteButton(false);
      // };

      // const handleItemClick = (itemId) => {
      //   const newSelectedItems = new Set(selectedItems);
      
      //   if (newSelectedItems.has(itemId)) {
      //     newSelectedItems.delete(itemId);
      //   } else {
      //     newSelectedItems.add(itemId);
      //   }
      
      //   setSelectedItems(newSelectedItems);
      //   setShowDeleteButton(newSelectedItems.size > 0);
      // };
    

      const handleFilterChange = (newFilter) => {
        if (['basketball', 'baseball', 'soccer', 'hockey', 'american_football', 'tennis', 'all'].includes(newFilter)) {
          setCategoryFilter(newFilter);
        } else {
          setSecondLevelFilter(newFilter);
        }
      };

      let filteredPosts = posts.filter((post) => {
        if (categoryFilter !== 'all' && post.post_category !== categoryFilter) {
          return false;
        }
      
        switch (secondLevelFilter) {
          case 'recent':
            // Ordena por fecha de creación y devuelve los más recientes
            return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          case 'most-liked':
            // Ordena por número de likes y devuelve los más populares
            return posts.sort((a, b) => b.likes.length - a.likes.length);
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
      
      
    /* 
        Not the best implementation, but I dont want to spend hours to check if changing it breaks anything
    */
    // eslint-disable-next-line
    useEffect(useCallback(() => {
        if ((status === 'idle' || status === 'done') && !posts.length) {
            getPosts()
            // console.log('fetching on posts load, status:', status)
        }
    }, [status, posts, getPosts]), [getPosts])
    // useBottomScrollListener(useCallback(() => {
    //     if (status === "idle" && posts.length) {
    //         getPosts()
    //         console.log('loading more posts, status:', status)
    //     }
    // }, [status, posts, getPosts]), 700, 200, null, true)

    // const selectedItemStyle = {
    //     backgroundColor: 'rgba(0, 123, 255, 0.1)',
    //   };

    const repliesCard = ( <ListGroup variant="flush" className="border-bottom">
    {(posts.length > 0) ? posts.map(post => {
        let { retweeted_by } = post
        return (
            <ListGroup.Item
                className="px-3"
                action
                as={"div"}
                // to={`/post/${post.id_str}`}
                key={post.id_str + (retweeted_by && retweeted_by.id_str)}
            >
                <Row className="d-flex px-3 pb-1 mt-n2 text-muted">
                    <PostTag no_reply_tag={no_reply_tag} post={post} />
                </Row>
                <Link className="stretched-link" to={`/post/${post.id_str}`}></Link>
                <Media className="mb-n2 w-100">
                    <UserLink
                        user={post.user}
                        className="rounded-circle"
                    >
                        <Figure
                            className="bg-border-color rounded-circle mr-2 overflow-hidden"
                            style={{ height: "30px", width: "30px" }}
                        >
                            <Figure.Image
                                src={(post.user.default_profile_image) ? '/img/default-profile-vector.svg' : post.user.profile_image_url_https}
                                className="w-100 h-100"
                            />
                        </Figure>
                    </UserLink>
                    <Media.Body className="w-50">
                        <Row className="d-flex align-items-center">
                          
                            {/* tick */}
                            <span className="text-muted mr-1">@{post.user.screen_name}</span>
                            <pre className="m-0 text-muted">{" - "}</pre>
                            <span className="text-muted"><ReactTimeAgo date={Date.parse(post.created_at)} timeStyle="twitter" /></span>
                        </Row>
                        <Row className="mb-n1 mt-1"><blockquote className="mb-1 mw-100">
                            <PostText to={`/post/${post.id_str}`} post={post} />
                        </blockquote></Row>
                        <Row>
                            <MultiMedia
                                className="mt-2"
                                post={post} />
                            <QuotedPost className="mt-2" post={!no_reply_tag && post.quoted_status} />
                        </Row>
                       
                    </Media.Body>
                </Media>
            </ListGroup.Item>
        )
    }) : (status === 'idle' &&
        <div className="message">No hay más respuestas </div>
    )}
    {status === 'loading' && <Spinner />}
    {status === 'error' && <TryAgain fn={getPosts} />}
</ListGroup>
)

    if (status === 'loading' && !posts.length)
        return <Spinner />
    return (
        <>
        {!no_carousel && 
        <div className=''>
         <CategoryCarousel onCategorySelected={handleFilterChange}/>
        </div>}
             {!no_filter && 
        <div className='px-4 py-2 filter-bar'>
        <FilterComponent onFilterChange={handleFilterChange} />
        {/* {showDeleteButton && (
  <div style={{ display: "flex", alignItems: "center" }}>
    <span>{selectedItems.size} items seleccionados</span>
          <button
      onClick={handleDeleteSelected}
      style={{
        marginLeft: "10px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "5px 10px",
      }}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
    <button
      onClick={handleClearSelection}
      style={{
        marginLeft: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "5px 10px",
      }}
    >
      Limpiar Selección
    </button>
  </div>
)} */}
        </div>}
        {comments && 
          repliesCard
        }
        {!comments &&
        <ListGroup variant="flush" className="post-card">
            {(filteredPosts.length) ? filteredPosts.map(post => {
                    // const isSelected = selectedItems.has(post.id_str);
                let { retweeted_by } = post
                return (
                  <ListGroup.Item
                        action
                        as={"div"}
                        className="py-1 px-4" 
                        key={post.id_str + (retweeted_by && retweeted_by.id_str)}
                       /*onClick={() => handleItemClick(post.id_str)} */
        // style={isSelected ? selectedItemStyle : {}}
                        >
                  <Post post={post} />
                </ListGroup.Item>
                )
            }) : (status === 'idle' &&
                <div className="message">Ya no hay más análisis</div>
            )}
            {status === 'loading' && <Spinner />}
            {status === 'error' && <TryAgain fn={getPosts} />}
        </ListGroup>
      }
              </>
    )
}

// import React from 'react'
// import { useEffect, useCallback, useState} from 'react'
// import { Media, Row, ListGroup, Figure, Dropdown } from 'react-bootstrap'
// import Spinner from 'comps/Spinner'
// import Post from 'comps/Post'

// import { useBottomScrollListener } from 'react-bottom-scroll-listener'
// import TryAgain from './TryAgain'

// export default function PostsList(props) {
//     let { posts = [], status, getPosts, no_reply_tag, filter, value } = props
//     const [selectedPosts, setSelectedPosts] = useState([]);

//     /* 
//         Not the best implementation, but I dont want to spend hours to check if changing it breaks anything
//     */
//     // eslint-disable-next-line
//     useEffect(useCallback(() => {
//         if ((status === 'idle' || status === 'done') && !posts.length) {
//             getPosts()
//             // console.log('fetching on posts load, status:', status)
//         }
//     }, [status, posts, getPosts]), [getPosts])
//     useBottomScrollListener(useCallback(() => {
//         if (status === "idle" && posts.length) {
//             getPosts()
//             console.log('loading more posts, status:', status)
//         }
//     }, [status, posts, getPosts]), 700, 200, null, true)

//     const handlePostSelect = (postId) => {
//         if (selectedPosts.includes(postId)) {
//           setSelectedPosts(selectedPosts.filter((id) => id !== postId));
//         } else {
//           setSelectedPosts([...selectedPosts, postId]);
//         }
//       };
    
//   const handleFilterChange = (e) => {
//    console.log(e.target.value)
//   }

//     if (status === 'loading' && !posts.length)
//         return <Spinner />
//     return (
//         <>
//        <div className="select-toolbar d-flex justify-content-between align-items-center mb-3">
//   <div className="d-flex align-items-center">
//     <div className="mr-3">
//       <Dropdown>
//         <Dropdown.Toggle variant="secondary" id="filter-dropdown">
//           Filter
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           <Dropdown.Item
//             active={true}
//             onClick={handleFilterChange}
//             value="all"
//           >
//             All
//           </Dropdown.Item>
//           <Dropdown.Item
//             active={false}
//             onClick={handleFilterChange}
//             value="sports"
//           >
//             Sports
//           </Dropdown.Item>
//           <Dropdown.Item
//             active={false}
//             onClick={handleFilterChange}
//             value="politics"
//           >
//             Politics
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </div>
//     <div className="selected-posts">
//       {selectedPosts.length > 0 ? (
//         <>
//           <span>{selectedPosts.length} selected</span>
//           <button
//             className="btn btn-danger delete-btn"
//             onClick={() => console.log(selectedPosts)}
//           >
//             Delete selected
//           </button>
//         </>
//       ) : (
//         <span>No posts selected</span>
//       )}
//     </div>
//   </div>
// </div>
//         <ListGroup variant="flush" className="post-card border-bottom">
//             {(posts.length > 0) ? posts.map(post => {
//                 let { retweeted_by } = post
//                 return (
//                   <ListGroup.Item
//                         action
//                         as={"div"}
//                         className="py-1 px-4" 
//                         key={post.id_str + (retweeted_by && retweeted_by.id_str)}
//                         >
//                   <div className="form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   id={post._id}
//                   checked={selectedPosts.includes(post._id)}
//                   onChange={() => handlePostSelect(post._id)}
//                 />
//                 <label className="form-check-label" htmlFor={post._id}>
//                 <Post post={post} />
//                 </label>
//               </div>
//                 </ListGroup.Item>
//                 )
//             }) : (status === 'idle' &&
//                 <div className="message">Ya no hay más análisis</div>
//             )}
//             {status === 'loading' && <Spinner />}
//             {status === 'error' && <TryAgain fn={getPosts} />}
//         </ListGroup>
//          {selectedPosts.length > 0 && (
//             <div className="d-flex justify-content-end mt-3">
//               <button className="btn btn-danger mr-3" onClick={() => console.log(selectedPosts)}>Borrar seleccionados</button>
//               {/* add other actions for selected posts */}
//             </div>
//           )}
//          </>
//     )
// }

// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   selectFeedPosts,
//   selectUserPosts,
//   selectReplies,
//   selectSearchPosts,
// } from 'features/posts/postsSlice';
// import FilterComponent from 'comps/filterComponent';
//  import { useBottomScrollListener } from 'react-bottom-scroll-listener'

// const filterOptions = [
//   { label: 'Recientes', value: 'recent' },
//   { label: 'Status', value: 'status' },
//   { label: 'Título', value: 'title' },
//   // Agrega más opciones de filtro aquí
// ];

// const PostList = (props) => {
//   let { posts = [], status, getPosts, no_reply_tag, filter, value } = props
//   const feedPosts = useSelector(selectFeedPosts);
//   const userPosts = useSelector(state => selectUserPosts(state, value));
//   const replies = useSelector(state => selectReplies(state, value));
//   const searchPosts = useSelector(state => selectSearchPosts(state, value));

//   const _posts = useMemo(() => {
//     switch (filter) {
//       case 'feed':
//         return feedPosts;
//       case 'user':
//         return userPosts;
//       case 'replies':
//         return replies;
//       case 'search':
//         return searchPosts;
//       default:
//         throw new Error(`Invalid filter: ${filter}`);
//     }
//   }, [filter, feedPosts, userPosts, replies, searchPosts]);

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(useCallback(() => {
//             if ((status === 'idle' || status === 'done') && !posts.length) {
//                 getPosts()
//                 // console.log('fetching on posts load, status:', status)
//             }
//         }, [status, posts, getPosts]), [getPosts])
//         useBottomScrollListener(useCallback(() => {
//             if (status === "idle" && posts.length) {
//                 getPosts()
//                 console.log('loading more posts, status:', status)
//             }
//         }, [status, posts, getPosts]), 700, 200, null, true)

//   const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

//   const handleFilterChange = (name, filterValue) => {
//     setSelectedFilter(filterValue);
//   };

//   const filteredPosts = useMemo(() => {
//     switch (selectedFilter) {
//       case 'recent':
//         return _posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       case 'status':
//         // Filtra los posts por status aquí
//         break;
//       case 'title':
//         return _posts.sort((a, b) => a.title.localeCompare(b.title));
//       default:
//         return _posts;
//     }
//   }, [_posts, selectedFilter]);

//   return (
//     <div>
//       <FilterComponent
//         filters={[
//           {
//             name: 'postFilter',
//             label: 'Filtrar por:',
//             options: filterOptions,
//           },
//         ]}
//         onChange={handleFilterChange}
//       />
//       {filteredPosts.map(post => (
//         <div key={post.id_str} className="post">
//           {/* Aquí renderizas el contenido del post */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PostList;

