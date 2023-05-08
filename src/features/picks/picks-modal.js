import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { Modal, Media, Alert, ProgressBar, Row, Col } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ComposeModal from 'features/picks/Compose'


import {ReactComponent as StarRounded} from '../../assets/icons/star-square-svgrepo-com.svg'


export default props => {
    let [showPicksModal, setShowPicksModal] = useState(props.show)

    const [formType, setFormType] = useState(null)

    const closeModal = () => {
        console.log('closemodal pick modal')
        setFormType(null)
            setShowPicksModal((currentValue) => !currentValue);
            props.onClose()
    }

    useEffect(() => {
      setShowPicksModal(props.show)
    }, [props.show])

    return (
        <>
        {formType === null && (
            <Modal
                className="p-0"
                size="lg"
                scrollable={true}
                show={showPicksModal}
                onHide={closeModal}
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
                    <ComposeModal onClose={closeModal} show={showPicksModal} type={formType} />
                )}
        </>
    )
}
