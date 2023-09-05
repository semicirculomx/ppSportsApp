import React from 'react'
import { useCallback } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default props => {
    let { isAuthenticated, user: AuthUser } = useSelector(state => state.auth)

    /**
     * dirty fix, as in unauthenticated, this button wont be visble (hence no handleFollow call, below)
     * but body still executes, giving error
     */
    // if (alerts)
    //     ensureNotifPermission = alerts.ensureNotifPermission

    let { subscribe, user, unsubscribe } = props
    let { isSubscribed } = user;
    let [hoverText, setHoverText] = React.useState('')
    let [hoverVariant, setHoverVariant] = React.useState('')
    let handleSubscribe = async e => {
        e.preventDefault()
        subscribe(user.screen_name)
        console.log(user)
        //ensureNotifPermission()
    }
    let handleUnsubscribe = async e => {
        e.preventDefault()
        unsubscribe(user.screen_name)
        console.log(user)

    }
    let handleMouseEnter = useCallback(async _ => {
        isSubscribed && setHoverText("Cancel subscription")
        isSubscribed && setHoverVariant('danger')
    }, [isSubscribed])
    let handleMouseLeave = async _ => {
        setHoverText('')
        setHoverVariant('')
    }
    let text = !isSubscribed ? "Activar Premium" : "Desactivar Premium"
    let variant = isSubscribed ? "primary" : "outline-primary"
    if (!isAuthenticated
        || (AuthUser && AuthUser.screen_name === user.screen_name))
        return <></>
    return (<>
        <Button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            variant={hoverVariant || variant}
            className="rounded-pill px-3 py-1 font-weight-bold">
            <span>{hoverText || text}</span>
        </Button>
    </>)
}