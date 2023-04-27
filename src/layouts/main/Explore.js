import React, { useCallback } from 'react'

import Search from 'comps/SearchBar'
import Trends from 'features/trends/Trends'
import MediaQuery from 'react-responsive'
import FollowCard from './sidebar/FollowCard'
import Users from 'features/users/UserSuggests'
import Heading from 'comps/Heading'
import { Route, Switch } from 'react-router-dom'
import { Figure } from 'react-bootstrap'
import UsersList from 'comps/UsersList'
import { useDispatch, useSelector } from 'react-redux'
import { followUser, selectSearchUsers, unFollowUser } from 'features/users/usersSlice'
import { changeQuery } from 'features/search/searchSlice'

export default (props) => {
    let dispatch = useDispatch()
    let users = useSelector(state => selectSearchUsers(state, '@jorzarios'))
    let { status } = useSelector(state => state.search)

    let getUsers = () => {
        dispatch(changeQuery('@player10maker'))
    }
        return (<>
        {!props.noHeading && (
            <Heading title="Buscar análisis" />

        )}
        <div className="header">
            {!props.noSearchBar &&
                <MediaQuery maxWidth={1020} >
                    <Search className="w-100 p-2" />
                </MediaQuery>}
        {!props.noRecommend && 
            <UsersList
            getUsers={getUsers}
            status={status}
            users={users}
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
       />
        }
                
        {!props.noTrends && (
                    <Trends />
                )}
        </div>
        {/* <Switch>
            <Route path='/explore/users'>
                <Heading title="Users" />
                <Users noPop />
            </Route>
            <Route path='/'> */}
                {/* {!props.noSuggestions && (
                    <MediaQuery maxWidth={992}>
                        <FollowCard noPop title='Sigue el análisis diario de más expertos' length={4} />
                    </MediaQuery>
                )} */}
                {/* {!props.compact && (
                    <Figure className="d-flex flex-column align-items-end">
                        <Figure.Image src="/img/explore-thumb-vector.svg" alt="" />
                        <Figure.Caption><small><a className="text-muted font-weight-lighter" href="https://www.freepik.com/free-photos-vectors/brochure">Brochure vector created by katemangostar - www.freepik.com</a></small></Figure.Caption>
                    </Figure>
                )} */}
                {/* {!props.noTrends && (
                    <Trends />
                )}
            </Route>
        </Switch> */}
    </>)
}