import React from 'react'
import { useState, useRef } from 'react'
import { Modal, Media, Alert, ProgressBar, Row, Col } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

import 'emoji-mart/css/emoji-mart.css'
import DOMPurify from 'dompurify'

import ComposeModal from 'features/picks/Compose'


import {ReactComponent as StarRounded} from '../../assets/icons/star-square-svgrepo-com.svg'


export default props => {
    let history = useHistory()

    let { compose_status: status } = useSelector(state => state.posts)

    const [formType, setFormType] = useState(null)

    const handleClose = () => {
        if (status !== 'error' || true) {
            history.goBack()
        }
    }

    return (
        <>
        {formType === null && (
            <Modal
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
                            {'Selecciona un tipo de entrada'}
                        </small>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-1 pb-0">
                    <Media className="h-100 w-100 align-items-center">                                          
                        <Media.Body className="mx-auto">
                        <div className="game-button button-get-plan">
                            <div onClick={() => setFormType('apuesta')}>
                            <StarRounded className="svg-rocket" />
                                <span>Crea una apuesta</span>
                            </div>
                        </div>
                        <div className="game-button button-get-plan">
                            <div onClick={() => setFormType('analisis')}>
                            <StarRounded className="svg-rocket" />
                                <span>Escribe un análisis</span>
                            </div>
                        </div>
                        <div className="game-button button-get-plan">
                           <div onClick={() => setFormType('partido')}>
                            <StarRounded className="svg-rocket" />
                                <span>Crea un partido destacado</span>
                            </div>
                        </div>
                        </Media.Body>
                    </Media>
                </Modal.Body>
            </Modal>
            )}
            {formType && ( 
                    <ComposeModal type={formType} />
                )}
        </>
    )
}
