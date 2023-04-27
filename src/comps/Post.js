import React, { useState } from 'react';
import { Media, Row, Col, Badge, Figure, Dropdown, Alert } from 'react-bootstrap';
import PostText from './PostText';
import ReactionsBar from 'features/posts/ReactionsBar'
import UserLink from './user-link';
import ReactTimeAgo from 'react-time-ago';
import { gameDate } from 'utils/helpers';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { removePost } from 'features/posts/postsSlice';
import { useHistory } from 'react-router-dom';
import Prompt from 'comps/prompt-modal';
import MultiMedia from 'comps/MultiMedia'
import QuotedPost from './quoted-post';


function Post({ post, no_reply_tag, comments}) {
  let { user: authUser, isAuthenticated } = useSelector(state => state.auth)
  let { remove_status: status } = useSelector(state => state.posts)
  let [error, setError] = useState(null)
  let [showPrompt, setShowPrompt] = useState(false)
  let [promptHeader, setPromptHeader] = useState('')
  let [promptBody, setPromptBody] = useState('')
  let history = useHistory()
  const dispatch = useDispatch();

  const updatePost = (post) => {
    console.log('update post', post)
  }

  const handleClose = () => {
    console.log(status)
    if (status !== 'error' || true) {
        history.goBack()
    }
  }

  const deletePost = async (post) => {
    setPromptHeader('Seguro que quieres borrar este post?')
    setPromptBody('No podrás recuperarlo')
    setShowPrompt(true)
  }

  const handleConfirmDelete = async () => {
    try {
      let action = await dispatch(removePost(post?._id))

      if (action.type === 'posts/removePost/fulfilled') console.log('deleted', action.payload)

    } catch (error) {
      setError(error)
    }
    setShowPrompt(false)
  }

  const handleCancelDelete = () => {
    setShowPrompt(false)
  }
  return (
    <>
    {!post.quoted_status ?
    <Media className="card">
      <Media.Body className="card-body">
        <div className="pick-title d-flex align-items-center justify-content-between">
          <h2 className="font-weight-bold card-title">{post?.post_title}</h2>
          <small className="text-muted">{gameDate({ matchup: post?.created_at })}</small>
        </div>
        <Row className="align-items-center" justify-content="between">
          <Col xs={9}>
            <Row className="mb-2 mt-2 card-subtitle">
              <span className="font-weight-bold pr-2">ANALYSIS:</span>
              <blockquote className="mb-1 mw-100">
                <PostText to={`/post/${post?.id_str}`} post={post} />
              </blockquote>
            </Row>
          </Col>
        </Row>
        <hr />
        <Row className="d-flex align-items-center">
          <UserLink
            user={post?.user}
            className="rounded-circle p-1"
            to={`/user/${post?.user.screen_name}`}
          >
            <Figure
              className="bg-border-color rounded-circle overflow-hidden"
              style={{ margin: "0 0 0px", height: "30px", width: "30px" }}
            >
              <Figure.Image
                src={(post?.user.default_profile_image) ? '/img/default-profile-vector.svg' : post?.user.profile_image_url_https}
                className="w-100 h-100"
              />
            </Figure>
          </UserLink>
          {/* tick */}
          <span className="text-muted p-1">@{post?.user.screen_name}</span>
          <pre className="m-0 p-1 text-muted flex-grow-1 text-right">{" - "}</pre>
          <span className="p-1 text-muted text-right">hace <ReactTimeAgo date={Date.parse(post?.created_at)} timeStyle="twitter" /></span>

        </Row>

        <Row className="align-items-center" justify-content="between">
          <Col>
            {authUser?._id === post?.user._id && (
              <Dropdown drop="up" className="bg-clear high-index">
                <Dropdown.Toggle
                  className="btn btn-naked-primary rounded-pill"
                  id="comment-dropdown"
                >
                  {<FontAwesomeIcon icon={faEllipsisH} />}
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight className="higher-index rounded-0">
                  <Dropdown.Item
                    className="high-index"
                    as='button'
                    onClick={e => deletePost(post)}
                  >Borrar</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>)}
          </Col>
          <Col >
            <ReactionsBar post={post} />
          </Col>
        </Row>
      </Media.Body>
    </Media> : 
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
                            <PostText expanded comment={comments} post={post} />
                        </blockquote></Row>
                        <Row>
                            <MultiMedia
                                className="mt-2"
                                post={post} />
                            <QuotedPost className="mt-2" post={!no_reply_tag && post.quoted_status} />
                        </Row>
                       
                    </Media.Body>
                </Media>
}

    <Prompt
      show={showPrompt}
      header="Seguro que quieres borrar este post?"
      body="No podrás recuperarlo"
      cancelText="Cancelar"
      confirmText="Borrar"
      handleConfirm={handleConfirmDelete}
      handleCancel={handleCancelDelete}
    />
    </>
  );
}

export default Post;
