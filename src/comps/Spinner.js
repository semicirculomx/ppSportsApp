import React from 'react'
import { Spinner, Col } from 'react-bootstrap'

export default function (color) {
    return (
        <Col className="d-flex justify-content-center py-5">
            <div className="loader-spinner"></div>
        </Col>
    )
}