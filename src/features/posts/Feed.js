import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getFeed, selectFeedPosts } from './postsSlice'

import PostsList from 'comps/PostsList'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

export default function Feed() {
  const dispatch = useDispatch()
  const posts = useSelector(selectFeedPosts)
  const { feed_status: status } = useSelector(state => state.posts)

  const getPosts = useCallback(() => {
    dispatch(getFeed())
   // dispatch(getPicksFeed())
  }, [dispatch])
  
  return (
    <>
      <PostsList posts={posts} status={status} getPosts={getPosts} />
    </>
  )
}
