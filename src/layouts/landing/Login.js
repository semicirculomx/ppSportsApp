import React from 'react'
import { Link } from 'react-router-dom'
import { filterInput } from 'utils/helpers'
// import { AuthContext } from 'utils/context/auth'
import { connect } from 'react-redux'
import { login } from 'store/authSlice'
import { Figure, Form, Col } from 'react-bootstrap'

class Login extends React.Component {
    // static contextType = AuthContext;
    state = {
        disabled: false,
        error: null,
        password: '',
        username: ''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        if (this.state.disabled)
            return
        this.setState({ error: null, disabled: true })
        try {
            let form = e.target
            let username = filterInput(form.username.value, 'username', { min_length: 6 })
            let password = filterInput(form.password.value, 'password')
            let response = await fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // console.log(response);
            if (response.status >= 500) {
                throw Error('Algo salio mal.')
            }
            else if (response.status >= 400) {
                throw Error('Incorrect credentials')
            }
            else if (response.ok) {
                let data = await response.json()
                console.log(data.message)
                this.setState({ disabled: false })
                this.props.login(data.user)
            }
        } catch (error) {
            console.log(error.message)
            this.setState({ error: error.message, disabled: false })
        }
    }
    render() {
        let disabled = this.state.disabled
        return (
            <Col style={{ maxWidth: "400px" }} className="mx-auto px-3 pb-3">
                {/* {!this.props.compact && (
                    <Figure className='d-flex flex-column align-items-end'>
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
                    </Figure>
                )} */}
                <fieldset className="custom-form mt-3" disabled={disabled}>
                <div class="title">Sports Betting Entertainment,<br/><span>los mejores análisis deportivos en un solo sitio</span></div>
                    <Form onSubmit={this.handleSubmit} >
                        <Form.Group controlId="username">
                            <Form.Control
                                placeholder='Usuario'
                                onChange={this.handleChange}
                                value={this.state.username}
                                type="text"
                                name="username"
                                autoCapitalize="off"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-0" controlId="password">
                            <Form.Control
                                placeholder="Contraseña"
                                onChange={this.handleChange}
                                value={this.state.password}
                                autoCorrect="off"
                                type="password"
                                name="password"
                            ></Form.Control>
                        </Form.Group>
                        <div className="d-flex flex-column align-items-center">
                            <button type="submit" className="btn btn-outline-primary btn-block button-confirm font-weight-bold">
                                Iniciar sesión
                            </button>
                            <small className="text-muted m-2">or</small>
                            <Link
                                to="/signup"
                                className="btn button-confirm btn-primary btn-block font-weight-bold"
                            >
                                Registrarse
                            </Link>
                            <p className='mt-1'>
                            <small ><Link disabled to="/">Forgot password?</Link></small>
                            <br />
                            <small className="text-danger">{this.state.error}</small>
                        </p>
                        </div>
                    </Form>
                </fieldset>
            </Col>
        )
    }
}
export default connect(null, { login })(Login)