import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { filterInput } from 'utils/helpers';
import { password_reset } from 'store/authSlice';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class PasswordReset extends React.Component {
  state = {
    username: '',
    newPassword: '',
    confirmPassword: '',
    error: null,
    success: false,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, newPassword, confirmPassword } = this.state;

    // Validar que los campos no estén vacíos y que la nueva contraseña coincida con la confirmación
    if (!username || !newPassword || !confirmPassword) {
      this.setState({ error: 'Faltan datos.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({ error: 'La nueva contraseña no coincide con la confirmación.' });
      return;
    }
// Realizar la solicitud al backend para cambiar la contraseña
try {
  let body = {
    username: filterInput(username, 'username', {min_length: 4}),
    newPassword: filterInput(newPassword, 'password'),
    confirmPassword: filterInput(confirmPassword, 'password')
  } 
  this.props.password_reset({body})
  this.setState({ success: true, error: null });
} catch (error) {
  this.setState({ error: error.message, success: false });
}
};

render() {
const { username, newPassword, confirmPassword, error, success } = this.state;

return (
  <div>
    <h2>Restablecer contraseña</h2>

    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">Contraseña cambiada exitosamente.</Alert>}

    <Form onSubmit={this.handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          value={username}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
      </Form.Group>

      <Form.Group controlId="newPassword">
        <Form.Label>Nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          value={newPassword}
          onChange={(e) => this.setState({ newPassword: e.target.value })}
        />
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirmar nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={(e) => this.setState({ confirmPassword: e.target.value })}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Cambiar contraseña
      </Button>
    </Form>
  </div>
);
}
}

export default connect(state => state, { password_reset })(PasswordReset)
