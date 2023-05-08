import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit'
import { request } from 'api'

const bmAdapter = createEntityAdapter({
    selectId: match => match.id_str,
    sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
})
const initialState = bmAdapter.getInitialState({
    feed_status: 'idle', // || 'loading', 'error', 'done'
    feed_page: 0, //page currently on, page to fetch is next one
    compose_status: 'idle', // || 'pending', 'error',
    match_detail_status: 'idle',
    currentMatch: null,
})


export const getBestMatches = createAsyncThunk('bm/getBestMatches', async (_, { dispatch, getState }) => {
    try {
        let {
            bm: { feed_page: p },
        } = getState()
        let url = `/api/matches?best=true&p=${p + 1}`
        let data = await request(url, { dispatch })
        let matches = data || []
        dispatch(matchesAdded(data))
        return matches.length
    } catch (err) {
        console.log(err)
        throw err
    }
})

export const getMatch = createAsyncThunk('bm/getMatch', async (matchId, { dispatch }) => {
    let { match } = await request(`/api/match/${matchId}`, { dispatch })
        console.log(match)
    if (!match) throw Error('Match not available')
    return dispatch(matchAdded(match))
})

export const addBestMatch = createAsyncThunk( 
    'bm/addBestMatch',
    async ({ body, url = '/api/match' }, { dispatch }) => {
        try {
            let  {match}  = await request(url, { body, dispatch})
              if (match) {          
                dispatch(matchesAdded([match]))
              }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
)

const bmSlice = createSlice({
    name: 'bm',
    initialState,
    reducers: {
        matchesAdded: bmAdapter.upsertMany,
        matchAdded: bmAdapter.upsertOne,
    },
    extraReducers: {
        [getBestMatches.rejected]: state => {
            state.feed_status = 'error'
        },
        [getBestMatches.pending]: state => {
            state.feed_status = 'loading'
        },
        [getBestMatches.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.feed_status = 'idle'
                state.feed_page += 1
            } else state.feed_status = 'done'
        },
        [addBestMatch.pending]: state => {
            state.compose_status = 'pending'
        },
        [addBestMatch.rejected]: state => {
            state.compose_status = 'error'
        },
        [addBestMatch.fulfilled]: state => {
                state.compose_status = 'idle'
        },
        [getMatch.pending]: state => {
            state.match_detail_status = 'loading'
        },
        [getMatch.fulfilled]: state => {
            state.match_detail_status = 'idle'
        },
        [getMatch.rejected]: state => {
            state.match_detail_status = 'error'
        },
       

    },
})
const { reducer, actions } = bmSlice
export const {
    matchesAdded,
    matchAdded,
} = actions
export default reducer


 export const bestMatchesSelector = bmAdapter.getSelectors(state => state.bm)

export const selectAllMatches = state => {
    return bestMatchesSelector
        .selectAll(state)
        .filter(Boolean)
}

export const selectMatchById = createSelector(
    [selectAllMatches, (state, matchId) => matchId],
    (matches, matchId) => matches.find(match => match.id_str === matchId)
)

export const selectBestMatches = createSelector([selectAllMatches], matches => matches)