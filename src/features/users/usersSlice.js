import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit'
import { request } from 'api'
import { selectUserPicks } from 'features/picks/picksSlice'
import { parsePicks } from 'features/picks/utils'
import { getFeed, selectUserPosts } from 'features/posts/postsSlice'
import { parsePosts } from 'features/posts/utils'
import { userUpdated as authUserUpdated } from 'store/authSlice'

let usersComparer = (a, b) => {
    let statusesEither = b.statuses_count || a.statuses_count
    if (statusesEither && statusesEither > 3) {
        return b.statuses_count - a.statuses_count
    } else if (b.followers_count || a.followers_count) {
        return b.followers_count - a.followers_count
    }
    return b.statuses_count - a.statuses_count
}

const usersAdapter = createEntityAdapter({
    selectId: user => user.screen_name,
    // sortComparer: usersComparer
})
const initialState = usersAdapter.getInitialState({
    user_suggests_status: 'idle',
    user_timeline_status: 'idle',
    user_posts_status: 'idle',
    user_picks_status: 'idle',
    user_timeline_page: 0,
    user_picks_page: 0,
    user_posts_page: 0,
    cancelled_subscribed_status: 'idle',

    user_update_status: 'idle',

    user_friendlist_status: 'idle',
    user_friendlist_page: 0,

    user_followerlist_status: 'idle',
    user_followerlist_page: 0,

    post_likes_status: 'idle',
    post_likes_page: 0,
    post_reposts_status: 'idle',
    post_reposts_page: 0,
    user_subscriberlist_page: 0,
    user_subscriberlist_status: 'idle',


})

export const updateUserDetails = createAsyncThunk(
    'users/updateUserDetails',
    async (body, { dispatch }) => {
        let { user } = await request('/api/updateuser', { body, dispatch })
        if (!user) throw Error('User field null in response')
        dispatch(authUserUpdated(user))
        return dispatch(userAdded(user))
    }
)

export const getUserSuggests = createAsyncThunk(
    'users/getUserSuggests',
    async (_, { dispatch }) => {
        let data = await request('/api/users', { dispatch })
        // console.log(data.users)
        return data.users
    }
)
export const getUserTimeline = createAsyncThunk(
    'users/getUserTimeline',
    async (username, { dispatch, getState }) => {
        let { user_timeline_page: p } = getState().users

        let url = `/api/user_timeline/${username}?p=${p + 1}`
        let { user } = await request(url, { dispatch })
        if (user) {
            dispatch(userAdded(user))
        }
    }
)

export const getUserPicks = createAsyncThunk(
    'users/getUserPicks',
    async (username, { dispatch, getState }) => {
        // let { user_picks_page: p } = getState().users
        let picksLength = selectUserPicks(getState(), username).length
        // if (!picksLength || picksLength === 0) {
        //     dispatch(resetPicksPage())
        //     p = 0
        // }
        let p = Math.floor(picksLength / 10)
        let url = `/api/user_picks/${username}?p=${p + 1}`
        let { user, picks } = await request(url, { dispatch })
        if (user && !picks.length) {
            dispatch(userAdded(user))
        }
        if (picks) {
            dispatch(parsePicks(picks))
        }
        return picks.length
    }
)

export const getUserPosts = createAsyncThunk(
    'users/getUsersPosts',
    async (username, { dispatch, getState }) => {
        // let { user_posts_page: p } = getState().users
        let postsLength = selectUserPosts(getState(), username).length
        // if (!postsLength || postsLength === 0) {
        //     dispatch(resetPostsPage())
        //     p = 0
        // }
        let p = Math.floor(postsLength / 10)
        let url = `/api/user_posts/${username}?p=${p + 1}`
        let { posts, user } = await request(url, { dispatch })
        if (user && !posts.length) {
            dispatch(userAdded(user))
        }
        if (posts) dispatch(parsePosts(posts))

        return posts.length
    }
)

export const followUser = createAsyncThunk(
    'users/folllowUser',
    async (username, { dispatch, getState }) => {
        dispatch(followingChanged({ username, following: true }))
        username = encodeURIComponent(username)
        await request(`/api/follow/${username}`, { dispatch, body: {} })
        let feedStatus = getState().posts.feed_status
        if (feedStatus === 'done') dispatch(getFeed())
    }
)
export const unFollowUser = createAsyncThunk(
    'users/unFolllowUser',
    async (username, { dispatch }) => {
        dispatch(followingChanged({ username, following: false }))
        username = encodeURIComponent(username)
        return request(`/api/unfollow/${username}`, { dispatch, body: {} })
    }
)
export const getFollowers = createAsyncThunk(
    'users/getFollowers',
    async (username, { dispatch, getState }) => {
        let {
            users: { user_followerlist_page: p },
        } = getState()
        let l = selectFollowers(getState(), username).length
        if (!l) {
            dispatch(resetFollowerlistPage())
            p = 0
        }
        p = parseInt(p)
        username = encodeURIComponent(username)
        let { users = [] } = await request(`/api/followers/${username}?p=${p + 1}`, { dispatch })
        users = users || []
        if (!users.length) return
        users = users
            .map(user => ({ ...user, follower_of: decodeURIComponent(username) }))
            .filter(Boolean)
        dispatch(usersAdded(users))
        return users.length
    }
)
export const getFriends = createAsyncThunk(
    'users/getFriends',
    async (username, { dispatch, getState }) => {
        let {
            users: { user_friendlist_page: p },
        } = getState()
        let l = selectFriends(getState(), username).length
        if (!l) {
            dispatch(resetFriendlistPage())
            p = 0
        }
        p = parseInt(p)
        username = encodeURIComponent(username)
        let { users = [] } = await request(`/api/friends/${username}?p=${p + 1}`, { dispatch })
        users = users || []
        if (!users.length) return
        users = users
            .map(user => ({ ...user, friend_of: decodeURIComponent(username) }))
            .filter(Boolean)
        dispatch(usersAdded(users))
        return users.length
    }
)
export const getLikes = createAsyncThunk(
    'users/getLikes',
    async (postId, { dispatch, getState }) => {
        try {
            let {
                users: { post_likes_page: p },
            } = getState()
            p = parseInt(p)
            let l = selectLikes(getState(), postId).length
            if (!l) {
                dispatch(resetLikesPage())
                p = 0
            }
            let { users = [] } = await request(`/api/post/${postId}/likes?p=${p + 1}`, { dispatch })
            users = users || []
            if (!users.length) return
            users = users.map(user => ({ ...user, liked_post: postId })).filter(Boolean)
            dispatch(usersAdded(users))
            return users.length
        } catch (err) {
            console.log(err)
            throw err
        }
    }
)
export const getReposts = createAsyncThunk(
    'users/getReposts',
    async (postId, { dispatch, getState }) => {
        let {
            users: { post_reposts_page: p },
        } = getState()
        p = parseInt(p)
        let l = selectReposts(getState(), postId).length
        if (!l) {
            dispatch(resetRepostsPage())
            p = 0
        }
        let { users = [] } = await request(`/api/post/${postId}/reposts?p=${p + 1}`, { dispatch })
        users = users || []
        if (!users.length) return
        users = users.map(user => ({ ...user, reposted_post: postId })).filter(Boolean)
        dispatch(usersAdded(users))
        return users.length
    }
)

export const subscribeUser = createAsyncThunk(
    'users/subscribeUser',
    async (username, { dispatch, getState }) => {
        dispatch(subscribingChanged({ username, isSubscribed: true })); // Assuming you have a subscribingChanged action
        username = encodeURIComponent(username);
        let result = await request(`/api/subscriptions/premium/subscribe`, { dispatch, body: {username: username} }); // Adjust the API endpoint accordingly
    }
);

export const unsubscribeUser = createAsyncThunk(
    'users/cancelSubscription',
    async (username, { dispatch, getState }) => {
        dispatch(subscribingChanged({ username, isSubscribed: false })); // Assuming you have a subscribingChanged action
        username = encodeURIComponent(username);
        let result = await request(`/api/subscriptions/premium/cancel`, { dispatch, body: {username: username} }); // Adjust the API endpoint accordingly
    }
);


export const getSubscribers = createAsyncThunk(
    'users/getSubscribers',
    async (userid, { dispatch, getState }) => {
        let {
            users: { user_subscriberlist_page: p },
        } = getState();
        let l = selectSubscribers(getState(), userid).length;
        if (!l) {
            dispatch(resetSubscriberlistPage());
            p = 0;
        }
        p = parseInt(p);
        userid = encodeURIComponent(userid);
        let { users = [] } = await request(`/api/subscriptions/premium/${userid}?p=${p + 1}`, { dispatch }); // Adjust the API endpoint as needed
        users = users || [];
        console.log(users)
         if (!users.length) return;
         users = users
             .map(user => ({ ...user, subscriber_of: decodeURIComponent(userid) }))
             .filter(Boolean);
         dispatch(usersAdded(users));
         return users.length;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        followingChanged: (state, action) => {
            let { username, following } = action.payload
            usersAdapter.updateOne(state, {
                id: username,
                changes: {
                    following,
                    new: true,
                },
            })
        },
        subscribingChanged: (state, action) => {
            let { username, isSubscribed } = action.payload;
            usersAdapter.updateOne(state, {
                id: username,
                changes: {
                    isSubscribed,
                    new: true,
                },
            });
        },
        resetTimelinePage: state => {
            state.user_timeline_page = 0
        },
        resetPicksPage: state => {
            state.user_picks_page = 0
        },
        resetPostsPage: state => {
            state.user_posts_page = 0
        },
        resetFollowerlistPage: state => {
            state.user_followerlist_page = 0
        },
        resetFriendlistPage: state => {
            state.user_friendlist_page = 0
        },
        resetLikesPage: state => {
            state.post_likes_page = 0
        },
        resetRepostsPage: state => {
            state.post_reposts_page = 0
        },
        resetSubscriberlistPage: state => {
            state.user_subscriberlist_status = 0
        },
        userAdded: usersAdapter.upsertOne,
        usersAdded: usersAdapter.upsertMany,
        usersAddedDontUpdate: usersAdapter.addMany,
    },
    extraReducers: {
        [getUserSuggests.rejected]: state => {
            state.user_suggests_status = 'error'
        },
        [getUserSuggests.pending]: state => {
            state.user_suggests_status = 'loading'
        },
        [getUserSuggests.fulfilled]: (state, action) => {
            state.user_suggests_status = 'idle'
            // console.log(action.payload)
            usersAdapter.addMany(state, action.payload)
        },
        [getUserTimeline.rejected]: state => {
            state.user_timeline_status = 'error'
        },
        [getUserTimeline.pending]: state => {
            state.user_timeline_status = 'loading'
        },
        [getUserTimeline.fulfilled]: (state, action) => {
            state.user_timeline_status = 'done'
        },
        [getUserPicks.rejected]: state => {
            state.user_picks_status = 'error'
        },
        [getUserPicks.pending]: state => {
            state.user_picks_status = 'loading'
        },
        [getUserPicks.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.user_picks_status = 'idle'
                state.user_picks_page += 1
            } else state.user_picks_status = 'done'
        },
        [getUserPosts.rejected]: state => {
            state.user_posts_status = 'error'
        },
        [getUserPosts.pending]: state => {
            state.user_posts_status = 'loading'
        },
        [getUserPosts.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.user_posts_status = 'idle'
                state.user_posts_page += 1
            } else state.user_posts_status = 'done'
        },
        [updateUserDetails.rejected]: state => {
            state.user_update_status = 'error'
        },
        [updateUserDetails.pending]: state => {
            state.user_update_status = 'pending'
        },
        [updateUserDetails.fulfilled]: state => {
            state.user_update_status = 'idle'
        },

        [getFollowers.rejected]: state => {
            state.user_followerlist_status = 'error'
        },
        [getFollowers.pending]: state => {
            state.user_followerlist_status = 'loading'
        },
        [getFollowers.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.user_followerlist_status = 'idle'
                state.user_followerlist_page += 1
            } else state.user_followerlist_status = 'done'
        },

        [getFriends.rejected]: state => {
            state.user_friendlist_status = 'error'
        },
        [getFriends.pending]: state => {
            state.user_friendlist_status = 'loading'
        },
        [getFriends.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.user_friendlist_status = 'idle'
                state.user_friendlist_page += 1
            } else state.user_friendlist_status = 'done'
        },
        [getLikes.rejected]: state => {
            state.post_likes_status = 'error'
        },
        [getLikes.pending]: state => {
            state.post_likes_status = 'loading'
        },
        [getLikes.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.post_likes_status = 'idle'
                state.post_likes_page += 1
            } else state.post_likes_status = 'done'
        },

        [getReposts.rejected]: state => {
            state.post_reposts_status = 'error'
        },
        [getReposts.pending]: state => {
            state.post_reposts_status = 'loading'
        },
        [getReposts.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.post_reposts_status = 'idle'
                state.post_reposts_page += 1
            } else state.post_reposts_status = 'done'
        },

        [getSubscribers.rejected]: state => {
            state.user_subscriberlist_status = 'error';
        },
        [getSubscribers.pending]: state => {
            state.user_subscriberlist_status = 'loading';
        },
        [getSubscribers.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.user_subscriberlist_status = 'idle'
                state.user_subscriberlist_page += 1
            } else state.user_subscriberlist_status = 'done'
        },
    },
})
const { actions, reducer } = usersSlice
export default reducer
export const {
    followingChanged,
    userAdded,
    usersAdded,
    resetTimelinePage,
    resetPicksPage,
    resetPostsPage,
    resetFollowerlistPage,
    resetFriendlistPage,
    usersAddedDontUpdate,
    resetLikesPage,
    resetRepostsPage,
    subscribingChanged,
    resetSubscriberlistPage,

} = actions

export const usersSelectors = usersAdapter.getSelectors(state => state.users)

export const selectSuggests = createSelector(usersSelectors.selectAll, users =>
    users.filter(user => user.following === false || user.new === true).sort(usersComparer)
)

export const selectSearchUsers = createSelector(
    [usersSelectors.selectAll, (state, query) => query],
    (users, query) => users.filter(user => user.searched === true && user.query === query)
)

export const selectFriends = createSelector(
    [usersSelectors.selectAll, (_, username) => username],
    (users, username) =>
        users
            .filter(user => user.friend_of === username)
            .filter(user => user.friend_of !== user.screen_name)
)
export const selectFollowers = createSelector(
    [usersSelectors.selectAll, (_, username) => username],
    (users, username) =>
        users
            .filter(user => user.follower_of === username)
            .filter(user => user.follower_of !== user.screen_name)
)
export const selectSubscribers = createSelector(
    [usersSelectors.selectAll, (_, userid) => userid],
    (users, userid) =>
        users
            .filter(user => user.subscriber_of === userid)
            .filter(user => user.subscriber_of !== user._id)
)
export const selectLikes = createSelector(
    [usersSelectors.selectAll, (_, postId) => postId],
    (users, postId) => users.filter(user => user.liked_post === postId)
)
export const selectReposts = createSelector(
    [usersSelectors.selectAll, (_, postId) => postId],
    (users, postId) => users.filter(user => user.reposted_post === postId)
)
export const selectIsSubscribed = (state, tipsterId) => {
    const user = state.users.entities[tipsterId];
    return user ? user.isSubscribed : false;
};
// export { selectUserPosts } from 'features/posts/postsSlice'
