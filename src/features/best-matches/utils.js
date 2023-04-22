import {
    usersAdded,
    usersAddedDontUpdate,
    usersSelectors
} from 'features/users/usersSlice'

export const populatePick = (pick, state) => ({
    ...pick,
    user: usersSelectors.selectById(state, pick.user) || pick.backup_user,
    retweeted_by: (pick.retweeted_by && usersSelectors.selectById(state, pick.retweeted_by)) || pick.backup_retweeted_by,
    quoted_status: (pick.quoted_status && populatePick(pick.quoted_status, state))
})
