import React from 'react'
import { Link } from 'react-router-dom'
import { filterInput } from 'utils/helpers'
import { connect } from 'react-redux'
import { login } from 'store/authSlice'
import { Figure, Form, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'

class Signup extends React.Component {
    state = {
        disabled: false,
        error: null
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        console.log(e)
        if (this.state.disabled)
            return
        this.setState({ error: null, disabled: true })
        console.log(this.state)
        try {
            let form = e.target
            let username = filterInput(form.username.value, 'username', { min_length: 4 })
            let password = filterInput(form.password.value, 'password')
            let fullname = filterInput(form.fullname.value, 'name', { min_length: 0 })
            let response = await fetch('/auth/signup', {
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
            if (!response.ok) {
                if (response.status === 409) //conflict
                    throw Error((await response.json()).message)
                throw Error('Algo salio mal')
            }
            let data = await response.json()
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
                <p>
                <small>Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></small>
                            <br />
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
                        to="/login"
                        className="btn button-confirm btn-primary font-weight-bold"
                      >
                        Inicia Sesión
                      </Link>
                    <small className="text-muted ml-2"> ó </small>
                    <Button type="submit" className="btn btn-outline-primary button-confirm font-weight-bold ml-2">
                      Registrate
                    </Button>
                  </div>
                </div>
              </Form>
            </fieldset>
          </Col>
        )
    }
}
export default connect(null, { login })(Signup)