import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit'
import { request } from 'api'
import { postsRemoved } from 'features/posts/postsSlice'

import { parsePicks, populatePick } from './utils'
import { userAdded, usersAdded } from 'features/users/usersSlice'

const picksAdapter = createEntityAdapter({
    selectId: pick => pick.id_str,
    sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
})
const initialState = picksAdapter.getInitialState({
    feed_status: 'idle', // || 'loading', 'error', 'done'
    feed_page: 0, //page currently on, page to fetch is next one
    compose_status: 'idle', // || 'pending', 'error',
    pick_detail_status: 'idle',
    remove_status: 'idle',
    update_status: 'idle',
    apiSports: [],
    api_sports_status: 'idle',
    api_league_matches_status: 'idle',
    apiLeagueMatches: [],
    api_match_status: 'idle',
})

export const getPick = createAsyncThunk('picks/getPick', async (pickId, { dispatch }) => {
    let { pick } = await request(`/api/pick/${pickId}`, { dispatch })
    if (!pick) throw Error('Pick not available')
    return dispatch(parsePicks([pick]))
})

export const fetchLeagueMatches = createAsyncThunk(
    'picks/getLeagueMatches',
    async (sport) => {
        const MAX_RETRIES = 1;
        let retries = 0;
        let apiData = null;

        while (retries < MAX_RETRIES) {
            try {
                const response = await fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=7e633aea1cc34e3ceec88cb2bb5d135d&regions=uk&oddsFormat=american&markets=h2h,spreads,totals`);
                if (!response.ok) {
                    throw new Error('Failed to retrieve sports data');
                }
                console.log('fetching league matches data');
                const data = await response.json();
                apiData = data;
                break;
            } catch (error) {
                retries++;
                console.log(`Error fetching league matches data. Retrying (${retries} of ${MAX_RETRIES})...`);
            }
        }

        if (apiData === null) {
            const fallbackResponse = await fetch(`https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=7e633aea1cc34e3ceec88cb2bb5d135d&regions=uk&oddsFormat=american`);
            if (!fallbackResponse.ok) {
                throw new Error('Failed to retrieve sports data');
            }
            console.log('fetching league matches data');
            apiData = await fallbackResponse.json();
        }

        return apiData;
    }
);

export const fetchMatch = createAsyncThunk(
    'picks/fetchMatch',
    async (eventId) => {
            try {
                const response = await fetch(`https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=7e633aea1cc34e3ceec88cb2bb5d135d&regions=us&oddsFormat=american&markets=h2h,spreads,totals&eventIds=${eventId}`);
                if (!response.ok) {
                    throw new Error('Failed to retrieve sports data');
                }
                const data = await response.json();
                console.log('fetching match data', data)
               return data[0]
            } catch (error) {
                console.log(`Error fetching league matches data. Retrying (${1} of ${1})...`);
                console.log(error);
            }
    }
);

export const getSportsData = createAsyncThunk(
    'picks/getSportsData',
    async () => {
        try {
            const response = await fetch('https://api.the-odds-api.com/v4/sports/?apiKey=7e633aea1cc34e3ceec88cb2bb5d135d');
            if (!response.ok) {
                throw new Error('Failed to retrieve sports data');
            }
            console.log('fetching sports data')
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const getPicksFeed = createAsyncThunk('picks/getPicksFeed', async (_, { dispatch, getState }) => {
    try {
        let {
            picks: { feed_page: p },
        } = getState()
        let url = `/api/picks?p=${p + 1}`
        let data = await request(url, { dispatch })
        let picks = data || []
        dispatch(parsePicks(data))
        return picks.length
    } catch (err) {
        console.log(err)
        throw err
    }
})

export const composePick = createAsyncThunk(
    'picks/composePick',
    async ({ body, url = '/api/pick' }, { dispatch }) => {
        try {
            let { pick } = await request(url, { body, dispatch })
            if (pick) pick.user.following = true //work around till server shows this correctly on all picks/users
            return dispatch(parsePicks([pick]))
        } catch (err) {
            console.log(err)
            throw err
        }
    }
)

// Define an async thunk to remove a post
export const removePick = createAsyncThunk(
    'picks/removePick',
    async (pickId, { dispatch }) => {
          try {
            // Send a request to remove the post from the API
            let res = await request(`/api/pick/${pickId}`, {dispatch, method: 'DELETE'})
            if(res.pick) {
                dispatch(picksRemoved([res.pick.id_str]))
            }

            if (res.post){
                // Dispatch the reducer to remove the post from the store
                dispatch(postsRemoved([res.post.id_str]))
            } 
            console.log(res.pick.user)
            dispatch(userAdded(res.pick.user))
        } catch (err) {
            console.log(err)
            throw err
        }
    }
  );

export const updatePick = createAsyncThunk(
    'picks/updatePick',
    async (body, { dispatch }) => {
        try {
           let { pick } = await request(`/api/pick/${body._id}`, { body, dispatch, method: 'PUT' })
            
           if (pick){
             return dispatch(parsePicks([pick]))
        }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
)


const picksSlice = createSlice({
    name: 'picks',
    initialState,
    reducers: {
        picksAdded: picksAdapter.upsertMany,
        pickAdded: picksAdapter.upsertOne,
        pickUpdated: picksAdapter.updateOne,
        picksUpdated: picksAdapter.updateMany,
        pickRemoved: picksAdapter.removeOne,
        picksRemoved: picksAdapter.removeMany,
        pickStatusUpdated: (state, action) => {
            let pick = action.payload
            picksAdapter.updateOne(state, {
                id: pick.id_str,
                changes: {
                    status: pick.status,
                },
            })
        },
    },
    extraReducers: {
        [getPicksFeed.rejected]: state => {
            state.feed_status = 'error'
        },
        [getPicksFeed.pending]: state => {
            state.feed_status = 'loading'
        },
        [getPicksFeed.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.feed_status = 'idle'
                state.feed_page += 1
            } else state.feed_status = 'done'
        },
        [composePick.pending]: state => {
            state.compose_status = 'pending'
        },
        [composePick.rejected]: state => {
            state.compose_status = 'error'
        },
        [composePick.fulfilled]: state => {
            state.compose_status = 'idle'
        },
        [updatePick.pending]: state => {
            state.update_status = 'pending'
        },
        [updatePick.rejected]: state => {
            state.update_status = 'error'
        },
        [updatePick.fulfilled]: state => {
            state.update_status = 'idle'
        },
        [getPick.pending]: state => {
            state.pick_detail_status = 'loading'
        },
        [getPick.fulfilled]: state => {
            state.pick_detail_status = 'idle'
        },
        [getPick.rejected]: state => {
            state.pick_detail_status = 'error'
        },
        [getSportsData.rejected]: state => {
            state.api_sports_status = 'error'
        },
        [getSportsData.pending]: state => {
            state.api_sports_status = 'loading'
        },
        [getSportsData.fulfilled]: (state, action) => {
            let data = action.payload
            if (data.length) {
                state.api_sports_status = 'done'
                state.apiSports = data
            }
        },
        [fetchLeagueMatches.rejected]: state => {
            state.api_league_matches_status = 'error'
        },
        [fetchLeagueMatches.pending]: state => {
            state.api_league_matches_status = 'loading'
        },
        [fetchLeagueMatches.fulfilled]: (state, action) => {
            let data = action.payload
            if (data) {
                state.api_league_matches_status = 'done'
                state.apiLeagueMatches = data
            }
        },
        [fetchMatch.rejected]: state => {
            state.api_match_status = 'error'
        },
        [fetchMatch.pending]: state => {
            state.api_match_status = 'loading'
        },
        [fetchMatch.fulfilled]: (state, action) => {
            let data = action.payload
            console.log(action)
            if (data) {
                console.log(data)
                state.api_match_status = 'done'
                state.apiMatch = data
            }
        },
        [removePick.rejected]: state => {
            state.remove_status = 'error'
        },
        [removePick.pending]: state => {
            state.remove_status = 'loading'
        },
        [removePick.fulfilled]: (state, action) => {
           state.remove_status = 'done'
        },
    },
})
const { reducer, actions } = picksSlice
export const {
    picksAdded,
    pickAdded,
    pickUpdated,
    picksUpdated,
    pickRemoved,
    picksRemoved,
    pickStatusUpdated
} = actions
export default reducer

let feedFilter = pick => {
    return (
        (pick.user.following === true ||
        // || (post.user.new) // Can be customizable in settings someday
        pick.is_feed_pick)
    )
}


export const picksSelectors = picksAdapter.getSelectors(state => state.picks)

export const selectAllPicks = state => {
    return picksSelectors
        .selectAll(state)
        .map(pick => populatePick(pick, state))
        .filter(Boolean)
}


export const getSports = state => state.picks.apiSports

export const getLeagueMatches = state => state.picks.apiLeagueMatches

export const getMatch = state => state.picks.apiMatch

export const selectLeagueMatches = createSelector([getLeagueMatches], apiLeagueMatches => apiLeagueMatches.filter(match => match.home_team && match.away_team))

export const selectPickById = createSelector(
    [selectAllPicks, (state, pickId) => pickId],
    (picks, pickId) => picks.find(pick => pick.id_str === pickId)
)

export const selectApiMatch = createSelector([getMatch], apiMatch => apiMatch)

export const selectFeedPicks = createSelector([selectAllPicks], picks => picks.filter(feedFilter))

export const selectApiSports = createSelector([getSports], apiSports => apiSports)

export const selectUserPicks = createSelector(
    [selectAllPicks, (state, username) => username],
    (picks, username) =>
        picks.filter(
            (pick) => {
                return pick.user.screen_name === username
            }
        )
)