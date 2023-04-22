import React from 'react'
import { Link } from 'react-router-dom'
import { filterInput } from 'utils/helpers'
import { connect } from 'react-redux'
import { login } from 'store/authSlice'
import { Figure, Form, Col } from 'react-bootstrap'

class Signup extends React.Component {
    state = {
        disabled: false,
        error: null
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        if (this.state.disabled)
            return
        this.setState({ error: null, disabled: true })
        try {
            let form = e.target
            let username = filterInput(form.username.value, 'username', { min_length: 4 })
            let password = filterInput(form.password.value, 'password')
            let fullname = filterInput(form.fullname.value, 'name', { min_length: 0 })
            let responce = await fetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                    fullname
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!responce.ok) {
                if (responce.status === 409) //conflict
                    throw Error((await responce.json()).message)
                throw Error('Algo salio mal')
            }
            let data = await responce.json()
            console.log(data.message)
            this.setState({ disabled: false })
            this.props.login(data.user)
        } catch (error) {
            console.log(error.message)
            this.setState({ error: error.message, disabled: false })
        }
    }
    render() {
        let disabled = this.state.disabled
        return (
            <Col style={{ maxWidth: "400px" }} className="mx-auto border px-3 py-4">
                {/* <Figure className='d-flex flex-column align-items-end'>
                    <Figure.Image
                        className='align-self-start'
                        width={250}
                        height={250}
                        src="/img/login-thumb-vector.svg"
                        alt="people vector"
                    />
                    <Figure.Caption as="a" href="https://www.freepik.com/free-photos-vectors/people">
                        <small className="text-muted text-wrap">People vector created by pikisuperstar - www.freepik.com</small>
                    </Figure.Caption>
                </Figure> */}
                <h5 className="font-weight-bolder">
                    Regístrate a Player Picks
                </h5>
                <fieldset disabled={disabled}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Elige un nombre de usuario - <small className="text-muted">requerido</small></Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                autoCapitalize="off"
                                autoComplete="off"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="fillname">
                            <Form.Label>Nombre completo - <small className="text-muted">opcional</small></Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                autoCapitalize="on"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Elige una contraseña - <small className="text-muted">requerido</small></Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                            ></Form.Control>
                        </Form.Group>
                        <p className="mt-n2">
                            <small>Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></small>
                            <br />
                            <small className="text-danger">{this.state.error}</small>
                        </p>
                        <div className="d-flex flex-column align-items-center">
                            <button
                                type="submit"
                                className="btn btn-outline-primary font-weight-bold rounded-pill btn-block">
                                <span>Entrar</span>
                            </button>
                            <div className="seperator"><span>or</span></div>
                            <Link
                                to="login"
                                className="btn btn-primary font-weight-bold rounded-pill btn-block">
                                <span>Inicia sesión</span>
                            </Link>
                        </div>
                    </Form>
                </fieldset>
            </Col>
        )
    }
}
export default connect(null, { login })(Signup)