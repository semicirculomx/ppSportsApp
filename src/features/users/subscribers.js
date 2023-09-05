import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscribers, selectSubscribers, unsubscribeUser, subscribeUser } from './usersSlice';
import UserList from 'comps/UsersList';
import Heading from 'comps/Heading';

export default function SubscribersList(props) {
    const dispatch = useDispatch();
    let { user: authUser } = useSelector(state => state.auth)

    const users = useSelector(state => selectSubscribers(state, authUser._id));
    const { user_subscriberlist_status: status } = useSelector(state => state.users);

    const getUsers = useCallback(() => {
        dispatch(getSubscribers(authUser._id));
    }, [authUser, dispatch]);

    return (
        <>
            <Heading
                title="Subscribers"
                backButton
                btnProfile
            />
            <UserList
                subscribe={userid => { dispatch(subscribeUser(userid)) }}
                unsubscribe={userid => { dispatch(unsubscribeUser(userid)) }}
                getUsers={getUsers}
                tipsterId= {true}
                status={status}
                users={users}
                noPop
            />
        </>
    );
}