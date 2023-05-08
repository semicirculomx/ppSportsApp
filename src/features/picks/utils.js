import {
    usersAdded,
    usersAddedDontUpdate,
    usersSelectors
} from 'features/users/usersSlice'

import { picksAdded } from './picksSlice'

export const populatePick = (pick, state) => {
   return {
   ...pick,
    user: usersSelectors.selectById(state, pick.user.screen_name),
   }
}

export const parsePicks = (picks, { dont_dispatch_picks = false, dont_update_users = false } = {}) => dispatch => {
    try {
        picks = picks.filter(Boolean)
        if (!picks.length)
            return
        let users = picks.map(pick => pick.user).filter(Boolean)

        picks = picks.map(pick => ({
            ...pick,
            user: {
                _id: pick.user._id,
                id: pick.user.id,
                id_str: pick.user.id_str,
                screen_name: pick.user.screen_name,
                role: pick.user.role,
                won_bets: pick.user.won_bets,
                lost_bets: pick.user.lost_bets,               
            }
        }))

        if (!dont_dispatch_picks)
            dispatch(picksAdded(picks))
        if (dont_update_users)
            dispatch(usersAddedDontUpdate(users))
        else
            dispatch(usersAdded(users))

        return picks
    } catch (err) {
        console.log('error parsing', err)
        throw err
    }
}