import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Media, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import PostText from './PostText';
import ReactionsBar from 'features/posts/ReactionsBar'
import { gameDate } from 'utils/helpers';
import ReactTimeAgo from 'react-time-ago';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Prompt from 'comps/prompt-modal';
import { useHistory } from 'react-router-dom';
import { removePick, updatePick } from 'features/picks/picksSlice';


function Pick({pick}) {
  let { user: authUser, isAuthenticated } = useSelector(state => state.auth)
  let { remove_status: status } = useSelector(state => state.posts)

  const [isExpanded, setIsExpanded] = useState(false);
  let [showPrompt, setShowPrompt] = useState(false)
  let [promptHeader, setPromptHeader] = useState('')
  let [promptBody, setPromptBody] = useState('')
  const dispatch = useDispatch();
  let [error, setError] = useState(null)
  let history = useHistory()
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(pick.status);

  const deletePick = () => {
    setPromptHeader('Seguro que quieres borrar este pick?')
    setPromptBody('No podrás recuperarlo')
    setShowPrompt(true)
  }
  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditModal = () => {
    setShowEditModal(!showEditModal);
  }

  const handleStatusChange = (e) => {
    e.preventDefault();
    setSelectedStatus(e.target.value);

  };

  const updatePickStatus = () => {
    let body = { ...pick , status: selectedStatus }
        // Implementa la lógica de actualización del estado del pick en el store de Redux
    try {
      dispatch(updatePick(body));
      setShowEditModal(false);
    } catch (error) {
      setError(error);
    }
  };

  function getBadgeClass(status) {
    switch (status) {
      case "won":
        return "bg-success";
      case "lost":
        return "bg-danger";
      case "void":
        return "bg-secondary";
      case "pending":
        return "bg-secondary";
      case "cashback": // Aquí está la corrección
        return "bg-warning";
      case "canceled":
        return "bg-dark";
      case "half-won":
        return "bg-secondary";
      case "half-lost":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  }
  
  function getBadgeText(status) {
    console.log(status)
    switch (status) {
      case "won":
        return "Ganada";
      case "lost":
        return "Perdida";
      case "void":
        return "Nulo";
      case "pending":
        return "Pendiente";
      case "cashback":
        return "Reembolsada";
      case "canceled":
        return "Cancelada";
      case "half-won":
        return "Mitad ganada";
      case "half-lost":
        return "Mitad perdida";
      default:
        return "Desconocido";
    }
  }  

  const handleConfirmDelete = async () => {
    try {
      let action = await dispatch(removePick(pick?._id))

      if (action.type === 'picks/removePick/fulfilled') console.log('deleted', action.payload)

    } catch (error) {
      setError(error)
    }
    setShowPrompt(false)
  }
  const handleCancelDelete = () => {
    setShowPrompt(false)
  }
  return (
    <>
      <div onClick={handleExpandClick}>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <h5 className="mb-1">{pick?.pick_title}</h5>
          <small>hace <ReactTimeAgo date={Date.parse(pick?.created_at)} timeStyle="twitter" /></small>
        </div>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <p className="mb-1 text-muted">{pick?.totalOdds}</p>
          <span className={`badge rounded-pill ${getBadgeClass(pick?.status)}`}>
            {getBadgeText(pick?.status)}
          </span>
        </div>
        {isExpanded && (
          <div className="expanded-info">
            {pick &&
              pick?.bets.length > 0 &&
              pick?.bets.map((bet) => (
                <div className="bet-item" key={bet._id}>
                  <div className="timeline"></div>
                  <div className="bet-content">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <span>
                        {bet.match.matchTitle} - ({bet.odds})
                        <br />
                      </span>
                      <p className="mb-1">{bet.market}</p>
                    </div>
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <span className="text-muted">
                        {bet.match.competition} - {bet.match.sport}
                        <br />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
           {authUser?._id === pick?.user._id &&(
             <div className="d-flex w-100 justify-content-end align-items-center">

              <Button
                className="cutom-btn mx-1 btn-light btn-sm"
                onClick={handleEditModal}
              >
                <FontAwesomeIcon icon={faEdit}>Editar</FontAwesomeIcon>

              </Button>

              <Button
                className="cutom-btn mx-1 btn-light btn-sm"
                onClick={e => deletePick(pick)}
              >
                <FontAwesomeIcon icon={faTrash}>Borrar</FontAwesomeIcon>

              </Button>
            </div> 
            )}
          </div>
        )}
      </div>
      <Prompt
        show={showPrompt}
        header="Seguro que quieres borrar este post?"
        body="No podrás recuperarlo"
        cancelText="Cancelar"
        confirmText="Borrar"
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
      />
      <Modal
        size="md"
        centered
        show={showEditModal}
        onHide={handleEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar estado del Pick</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusSelect">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="won">Ganada</option>
                <option value="lost">Perdida</option>
                <option value="void">Nulo</option>
                <option value="pending">Pendiente</option>
                <option value="cashback ">Reembolsada</option>
                <option value="canceled">Cancelada</option>
                <option value="half-won">Mitad ganada</option>
                <option value="half-lost">Mitad perdida</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={updatePickStatus}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Pick;
