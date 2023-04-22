import {
    usersAdded,
    usersAddedDontUpdate,
    usersSelectors
} from 'features/users/usersSlice'

import { picksAdded } from './picksSlice'

export const populatePick = (pick, state) => ({
    ...pick,
    user: usersSelectors.selectById(state, pick.user) || pick.backup_user,
    retweeted_by: (pick.retweeted_by && usersSelectors.selectById(state, pick.retweeted_by)) || pick.backup_retweeted_by,
    quoted_status: (pick.quoted_status && populatePick(pick.quoted_status, state))
})

export const parsePicks = (picks, { dont_dispatch_posts = false, dont_update_users = false } = {}) => dispatch => {
    try {

        if (!dont_dispatch_posts)
            dispatch(picksAdded(picks))
        return picks
    } catch (err) {
        console.log('error parsing', err)
        throw err
    }
}