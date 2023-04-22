import { configureStore } from '@reduxjs/toolkit'
import postsReducer from 'features/posts/postsSlice'
import searchReducer from 'features/search/searchSlice'
import trendsReducer from 'features/trends/trendsSlice'
import usersReducer from 'features/users/usersSlice'
import notifyReducer from 'features/notify/notifySlice'
import authReducer from './authSlice'
import picksReducer from 'features/picks/picksSlice'
import bmReducer from 'features/best-matches/bmSlice'
// import { loadState, saveState } from 'utils/localStorage'

const store = configureStore({
    reducer: {
        bm: bmReducer,
        picks: picksReducer,
        posts: postsReducer,
        search: searchReducer,
        trends: trendsReducer,
        users: usersReducer,
        notify: notifyReducer,
        auth: authReducer
    }
})

export default store