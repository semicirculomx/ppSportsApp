import React, { useEffect } from 'react'
import { useState } from 'react'
import {
    Row,
    Modal,
    Form,
    Figure,
    OverlayTrigger,
    Popover,
    Alert,
    ProgressBar,
} from 'react-bootstrap'
import { TwitterPicker } from 'react-color'
import { useHistory } from 'react-router-dom'
import { filterInput } from 'utils/helpers'

import { useSelector, useDispatch } from 'react-redux'
import { updateUserDetails } from 'features/users/usersSlice'

export default props => {
    let history = useHistory()
    let dispatch = useDispatch()
    let { user } = useSelector(state => state.auth)
    let { user_update_status: status } = useSelector(state => state.users)

    let [color, setColor] = useState(user.profile_banner_color || '#f5f8fa')
    let [name, setName] = useState(user.name || '')
    let [bio, setBio] = useState(user.description || '')
    let [location, setLocation] = useState(user.location || '')
    let { entities: { url: { urls: [{ url } = {}] = [] } = {} } = {} } = user
    let [website, setWebsite] = useState(url || '')
    let [profile, setProfile] = useState(user.profile_image_url_https || getRandomProfileUrl())
    let [bank, setBank] = useState(user.bank || 0)

    let [error, setError] = useState(null)
    let [progress, setProgress] = useState(0)

    const redirected = new URLSearchParams(history.location.search).get('redirected')

    let dirtyProgress = () => {
        if (progress < 90)
            setTimeout(() => { setProgress(90) }, 200)
        return true
    }

    const handleClose = () => {
        if (!error && (status === 'idle')) {
            if (redirected === 'true') history.push('/home')
            else history.goBack()
        }
    }

    const handleSubmit = async () => {
        setError(null)
        setProgress(0)
        try {
            let _name = filterInput(name, 'name', { identifier: 'Name' })
            let description = filterInput(bio, 'html', { max_length: 200, identifier: 'Bio' })
            let profile_banner_color = filterInput(color, null, {
                regex: /^#[0-9A-Fa-f]{3,6}$/,
                identifier: 'Banner color',
            })
            let _location = filterInput(location, 'name', { min_length: 0, identifier: 'Location' })
            let _website = filterInput(website, 'html', {
                min_length: 0,
                identifier: 'Website URL',
            })
            let profile_image_url_https = profile
            let body = {
                name: _name,
                description,
                profile_banner_color,
                location: _location,
                website: _website,
                profile_image_url_https,
                bank,
            }
            let action = await dispatch(updateUserDetails(body))
            if (action.type === 'users/updateUserDetails/fulfilled') {
                setProgress(100)
                handleClose()
            }
        } catch (err) {
            setError(err.message)
        }
    }
    const picker = (
        <Popover id="popover-banner-color">
            <TwitterPicker
                colors={[
                    '#D9E3F0',
                    '#F47373',
                    '#697689',
                    '#37D67A',
                    '#2CCCE4',
                    '#555555',
                    '#dce775',
                    '#ff8a65',
                    '#ba68c8',
                ]}
                color={color}
                onChangeComplete={color => setColor(color.hex)}
                triangle="hide"
            />
        </Popover>
    )
    return (
        <>
            <Modal
                enforceFocus={false}
                className="p-0"
                size="lg"
                scrollable={true}
                show={true}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title>
                        <small className="font-weight-bold">
                            {!redirected ? 'Edita tu perfil' : 'Completa tu perfil'}{' '}
                        </small>
                    </Modal.Title>
                </Modal.Header>
                {status === 'pending' && dirtyProgress() && (
                    <ProgressBar className="rounded-0" now={progress} />
                )}
                {status === 'error' && (
                    <Alert variant="danger" className="mb-0 font-weight-bold text-white">
                       Error al editar los detalles, intentalo de nuevo!
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger" className="mb-0 font-weight-bold text-white">
                        {error}
                    </Alert>
                )}
                <Modal.Body className="pt-1 pb-0 px-0">
                    <fieldset disabled={status === 'pending'}>
                        <Form noValidate onSubmit={e => e.preventDefault()}>
                            <Figure
                                className="d-flex"
                                style={{ height: '200px', width: '100%', backgroundColor: color }}
                            >
                                {user.profile_banner_url && (
                                    <Figure.Image
                                        src={user.profile_banner_url}
                                        className="w-100 h-100"
                                    />
                                )}
                                <OverlayTrigger
                                    rootClose={true}
                                    trigger="click"
                                    placement="auto-start"
                                    overlay={picker}
                                >
                                    <button
                                        style={{ color: color !== '#f5f8fa' && color }}
                                        className="mx-auto my-auto btn btn-outline border px-2 py-1 font-weight-bold"
                                    >
                                        Elige un color de banner
                                    </button>
                                </OverlayTrigger>
                            </Figure>
                            <div className="px-3">
                                <Row className="d-flex justify-content-between mt-n2 px-2 align-items-center w-100">
                                    <Figure
                                        style={{ height: '100px', width: '100px' }}
                                        className="mt-n5 rounded-circle overflow-hidden bg-primary"
                                    >
                                        <Figure.Image className="w-100 h-100" src={profile} />
                                    </Figure>
                                    <button
                                        onClick={() => setProfile(getRandomProfileUrl())}
                                        className="btn btn-outline-primary rounded-pill px-2 py-1 btn-sm font-weight-bold"
                                    >
                                        Cambiar Avatar
                                    </button>
                                </Row>
                                <Form.Group controlId="name">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '1.25rem' }}
                                        type="text"
                                        value={name}
                                        onChange={n => setName(n.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="bio">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        style={{ fontSize: '1.25rem', minHeight: '100px' }}
                                        value={bio}
                                        onChange={n => setBio(n.target.value)}
                                    />
                                </Form.Group>
                               {
                                user && user.role === 'tipster' && 
                                <Form.Group controlId="bank">
                                    <Form.Label>Monto base para Bank de inicio</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="number"
                                        style={{ fontSize: '1.25rem' }}
                                        value={bank}
                                        onChange={n => {
                                            try {
                                                const filteredValue = filterInput(n.target.value, 'natural', { max_length: 9 });
                                                setBank(filteredValue);
                                                setError(null)
                                            } catch (error) {
                                                setError(error.message)
                                                console.log(error);
                                            }
                                        }}
                                    />
                                </Form.Group>
                              } 
                                <Form.Group controlId="location">
                                    <Form.Label>Ubicación</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '1.25rem' }}
                                        type="text"
                                        value={location}
                                        onChange={n => setLocation(n.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="website">
                                    <Form.Label>Web</Form.Label>
                                    <Form.Control
                                        style={{ fontSize: '1.25rem' }}
                                        type="text"
                                        value={website}
                                        onChange={n => setWebsite(n.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </Form>
                    </fieldset>
                </Modal.Body>
                <Modal.Footer className="py-1">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <div></div>
                        <div className="right">
                            <button
                                disabled={status === 'pending'}
                                type="submit"
                                onClick={handleSubmit}
                                className="btn btn-primary rounded-pill px-3 py-1 font-weight-bold"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// straight from server
function getRandomProfileUrl() {
    //geneartes random pic in img
    let imgs = [
        'animals-1298747.svg',
        'bunny-155674.svg',
        'cat-154642.svg',
        'giraffe-2521453.svg',
        'iron-man-3829039.svg',
        'ironman-4454663.svg',
        'lion-2521451.svg',
        'man-1351317.svg',
        'pumpkin-1640465.svg',
        'rat-152162.svg',
        'sherlock-3828991.svg',
        'spider-man-4639214.svg',
        'spiderman-5247581.svg',
        'thor-3831290.svg',
        'tiger-308768.svg',
        'whale-36828.svg',
    ]
    let img = imgs[Math.floor(Math.random() * imgs.length)]
    // TODO A stable and real image server!
    return `/img/${img}`
}
