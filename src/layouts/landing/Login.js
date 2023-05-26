import React from 'react'
import { Link } from 'react-router-dom'
import { filterInput } from 'utils/helpers'
// import { AuthContext } from 'utils/context/auth'
import { connect } from 'react-redux'
import { login } from 'store/authSlice'
import { Figure, Form, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faFacebook, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'

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
            let username = filterInput(form.username.value, 'username', { min_length: 4 })
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
            <Col style={{ maxWidth: "400px" }} className="mx-auto my-4 px-1 pb-3">
                
            <fieldset className="custom-form mt-3" disabled={disabled}>
            <Figure
                    className="mx-auto ml-2 logo-transparent d-flex align-items-center"
                    style={{ height: "125px", width: "225px" 
                }}
                >
                    <Figure.Image
                        src={'playerpicks-alt.png'}
                        className="w-100 h-100"
                    />
                </Figure> 
            <div className="title">Sports Betting Entertainment,
            <br /><span>los mejores análisis deportivos en un solo sitio</span>
            </div>             
                <Form onSubmit={this.handleSubmit} >
                <Form.Group controlId="username">
                  <Form.Control
                    placeholder='Usuario'
                    onChange={this.handleChange}
                    value={this.state.username}
                    type="text"
                    name="username"
                    autoCapitalize="off"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Control
                    placeholder="Contraseña"
                    onChange={this.handleChange}
                    value={this.state.password}
                    autoCorrect="off"
                    type="password"
                    name="password"
                  />
                </Form.Group>
                <p>
                  {/* <small ><Link disabled to="/help">Forgot password?</Link></small>
                      <br /> */}
                 <small className="text-danger">{this.state.error}</small>
                </p>
                <div className='mr-auto ml-auto mt-4 social-login d-flex justify-content-between text-center w-50'>
                    <Button> <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon> </Button>
                    <Button> <FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon> </Button>
                    <Button> <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon> </Button>

                </div>
                <div className="d-flex flex-column align-items-center mt-4 px-4 pt-0">
                  <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                  <Link
                        to="/signup"
                        className="btn button-confirm btn-primary font-weight-bold"
                      >
                        Registrarse
                      </Link>
                    <small className="text-muted ml-2"> ó </small>
                    <Button type="submit" className="btn btn-outline-primary button-confirm font-weight-bold ml-2">
                      Iniciar sesión
                    </Button>
                  </div>
                  <p className='mt-1'>
                    <small className="text-danger">Recuperar contraseña</small>
                  </p>
                </div>
              </Form>
            </fieldset>
          </Col>
        )
    }
}
export default connect(null, { login })(Login)