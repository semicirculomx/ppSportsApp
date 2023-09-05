import React, { useEffect } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFollowers, selectFollowers, followUser, unFollowUser, subscribeUser, unsubscribeUser} from './usersSlice'
import UserList from 'comps/UsersList'
import Heading from 'comps/Heading'

export default props => {
    const dispatch = useDispatch()
    const { match: { params: { username } = {} } = {} } = props
    let { user: authUser } = useSelector(state => state.auth)

    const users = useSelector(state => selectFollowers(state, username))
    const { user_followerlist_status: status } = useSelector(state => state.users)

    const getUsers = useCallback(() => {
        dispatch(getFollowers(username))
    }, [username, dispatch])
    return (<>
        <Heading
            title="Followers"
            backButton
            btnProfile
        />
        <UserList
            subscribe={username => { dispatch(subscribeUser(username)) }}
            unsubscribe={username => { dispatch(unsubscribeUser(username)) }}
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
            getUsers={getUsers}
            status={status}
            users={users}
            tipsterId={authUser._id}
            noPop
        />
    </>)
}